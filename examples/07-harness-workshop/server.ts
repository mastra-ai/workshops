import { createServer } from "node:http";
import { Agent } from "@mastra/core/agent";
import { Harness } from "@mastra/core/harness";
import type { HarnessEvent } from "@mastra/core/harness";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

// --- Harness setup -------------------------------------------------------
// Same orchestrator-with-subagents harness as basic.ts, but instead of running
// one prompt from the CLI we host it behind an HTTP server. The browser talks
// to it over two endpoints: an SSE stream for events and a POST for messages.

const storage = new LibSQLStore({
    id: "server-store",
    url: "file:./mastra.db",
});

const agent = new Agent({
    id: "orchestrator",
    name: "Orchestrator",
    instructions: `You are an orchestrator agent. You have access to specialized subagents.
Use the "researcher" subagent to look up factual information.
Use the "poet" subagent to create creative writing.
Delegate each part of the task to the appropriate subagent exactly once.
Once you have the results you need, present the final answer to the user directly and stop — do not re-delegate or repeat work that is already done.`,
    model: "anthropic/claude-haiku-4-5",
});

const harness = new Harness({
    id: "server-harness",
    agent,
    modes: [{ id: "chat", name: "Chat", default: true }],
    storage,
    memory: new Memory({ storage }),
    subagents: [
        {
            id: "researcher",
            name: "Researcher",
            description: "Looks up factual information and provides well-sourced answers.",
            instructions:
                "You are a research assistant. Provide accurate, factual information with clear explanations. Be concise but thorough.",
            defaultModelId: "anthropic/claude-haiku-4-5",
        },
        {
            id: "poet",
            name: "Poet",
            description: "Creates creative writing like poems, haikus, and short stories.",
            instructions:
                "You are a creative poet. Write vivid, evocative poetry and creative prose. Match the requested style.",
            defaultModelId: "anthropic/claude-haiku-4-5",
        },
    ],
});

await harness.init();

// One durable session per browser client, keyed by resourceId. The same
// resourceId always resolves to the same session, so a reconnecting tab
// resumes its own thread.
const sessions = new Map<string, Awaited<ReturnType<typeof harness.createSession>>>();

async function getSession(resourceId: string) {
    let session = sessions.get(resourceId);
    if (!session) {
        session = await harness.createSession({ resourceId });
        session.grantTool("subagent");
        sessions.set(resourceId, session);
    }
    return session;
}

// --- Event shaping -------------------------------------------------------
// Translate the raw HarnessEvent stream into compact JSON the UI understands.
// Returning undefined drops events the UI does not render.

function toClientEvent(event: HarnessEvent): Record<string, unknown> | undefined {
    switch (event.type) {
        case "agent_start":
            return { type: "agent_start" };
        case "subagent_start":
            return { type: "subagent_start", agentType: event.agentType, task: event.task };
        case "subagent_end":
            return { type: "subagent_end", agentType: event.agentType, durationMs: event.durationMs };
        case "tool_start":
            return { type: "tool_start", toolName: event.toolName };
        case "message_end": {
            const text = event.message.content
                .filter((c): c is Extract<typeof c, { type: "text" }> => c.type === "text")
                .map((c) => c.text)
                .join("");
            return text ? { type: "assistant", text } : undefined;
        }
        case "usage_update":
            return event.usage.totalTokens > 0
                ? { type: "usage", totalTokens: event.usage.totalTokens }
                : undefined;
        case "error":
            return { type: "error", message: event.error.message };
        case "agent_end":
            return { type: "agent_end", reason: event.reason ?? "complete" };
        default:
            return undefined;
    }
}

// --- HTTP server ---------------------------------------------------------

const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/") {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(HTML);
        return;
    }

    // SSE: subscribe a client to its session's event stream.
    if (req.method === "GET" && url.pathname === "/api/stream") {
        const resourceId = url.searchParams.get("resourceId");
        if (!resourceId) {
            res.writeHead(400).end("missing resourceId");
            return;
        }
        const session = await getSession(resourceId);

        res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            connection: "keep-alive",
        });
        res.write(": connected\n\n");

        const unsubscribe = session.subscribe((event) => {
            const payload = toClientEvent(event);
            if (payload) res.write(`data: ${JSON.stringify(payload)}\n\n`);
        });

        req.on("close", () => unsubscribe());
        return;
    }

    // Send a user message into the client's session. Fire-and-forget: the turn
    // streams back over the SSE channel, so we ack immediately.
    if (req.method === "POST" && url.pathname === "/api/message") {
        const body = await readBody(req);
        const { resourceId, content } = JSON.parse(body || "{}");
        if (!resourceId || !content) {
            res.writeHead(400).end("missing resourceId or content");
            return;
        }
        const session = await getSession(resourceId);
        void session.sendMessage({ content });
        res.writeHead(202, { "content-type": "application/json" }).end(JSON.stringify({ ok: true }));
        return;
    }

    res.writeHead(404).end("not found");
});

function readBody(req: import("node:http").IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
        req.on("error", reject);
    });
}

const PORT = Number(process.env.PORT ?? 4111);
server.listen(PORT, () => {
    console.log(`Harness server listening on http://localhost:${PORT}`);
});

// --- Embedded single-file UI ---------------------------------------------

const HTML = /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Harness Chat</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  :root {
    color-scheme: dark;
    --bg: #07080d;
    --panel: rgba(20, 24, 38, 0.66);
    --border: rgba(120, 140, 200, 0.14);
    --text: #e8ecf6;
    --muted: #8b93ab;
    --accent: #7c5cff;
    --accent2: #22d3ee;
    --user-grad: linear-gradient(135deg, #6d4bff 0%, #8b5cf6 100%);
    --shadow: 0 18px 50px -12px rgba(0, 0, 0, 0.6);
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
    color: var(--text);
    background: var(--bg);
    overflow: hidden;
  }
  /* animated aurora backdrop */
  body::before {
    content: "";
    position: fixed; inset: -30%;
    background:
      radial-gradient(40% 40% at 20% 25%, rgba(124, 92, 255, 0.35), transparent 60%),
      radial-gradient(35% 35% at 80% 20%, rgba(34, 211, 238, 0.28), transparent 60%),
      radial-gradient(45% 45% at 65% 85%, rgba(236, 72, 153, 0.22), transparent 60%);
    filter: blur(30px);
    animation: drift 22s ease-in-out infinite alternate;
    z-index: 0;
  }
  @keyframes drift {
    0%   { transform: translate(0, 0) scale(1); }
    50%  { transform: translate(-3%, 4%) scale(1.08); }
    100% { transform: translate(4%, -3%) scale(1.04); }
  }

  .app {
    position: relative;
    z-index: 1;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  header {
    width: 100%;
    max-width: 820px;
    padding: 22px 24px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .logo {
    width: 38px; height: 38px; border-radius: 11px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: grid; place-items: center;
    box-shadow: 0 8px 24px -6px rgba(124, 92, 255, 0.7);
    font-size: 20px;
    animation: float 5s ease-in-out infinite;
  }
  @keyframes float { 50% { transform: translateY(-4px); } }
  .titles h1 { margin: 0; font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
  .titles p { margin: 2px 0 0; font-size: 12.5px; color: var(--muted); }
  .status {
    margin-left: auto; display: flex; align-items: center; gap: 7px;
    font-size: 12px; color: var(--muted);
    padding: 6px 11px; border-radius: 999px;
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; box-shadow: 0 0 10px #34d399; }
  .dot.busy { background: #fbbf24; box-shadow: 0 0 10px #fbbf24; animation: pulse 1s ease-in-out infinite; }
  @keyframes pulse { 50% { opacity: 0.35; } }

  .scroll {
    flex: 1; width: 100%;
    overflow-y: auto;
    display: flex; justify-content: center;
  }
  .scroll::-webkit-scrollbar { width: 10px; }
  .scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 8px; border: 3px solid transparent; background-clip: padding-box; }
  #log {
    width: 100%; max-width: 820px;
    padding: 8px 24px 28px;
    display: flex; flex-direction: column; gap: 14px;
  }

  .empty {
    margin: auto; text-align: center; color: var(--muted);
    display: flex; flex-direction: column; align-items: center; gap: 18px;
    padding: 60px 0;
  }
  .empty .big { font-size: 42px; }
  .empty h2 { margin: 0; font-size: 20px; color: var(--text); font-weight: 600; }
  .chips { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .chip {
    cursor: pointer; font-size: 13px; color: var(--text);
    padding: 9px 14px; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .chip:hover { transform: translateY(-2px); border-color: rgba(124,92,255,0.6); background: rgba(124,92,255,0.12); }

  .row { display: flex; gap: 12px; align-items: flex-end; animation: rise 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
  .row.user { flex-direction: row-reverse; }
  @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .avatar {
    flex: 0 0 auto; width: 32px; height: 32px; border-radius: 10px;
    display: grid; place-items: center; font-size: 15px;
    border: 1px solid var(--border);
  }
  .avatar.bot { background: linear-gradient(135deg, rgba(124,92,255,0.35), rgba(34,211,238,0.25)); }
  .avatar.me  { background: rgba(255,255,255,0.06); }

  .bubble {
    max-width: 76%;
    padding: 13px 16px; border-radius: 16px;
    line-height: 1.6; font-size: 14.5px;
    white-space: pre-wrap; word-break: break-word;
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow);
  }
  .user .bubble {
    background: var(--user-grad);
    color: white;
    border-bottom-right-radius: 5px;
  }
  .assistant .bubble {
    background: var(--panel);
    border: 1px solid var(--border);
    border-bottom-left-radius: 5px;
  }
  .bubble code, .bubble pre {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 13px;
  }
  .bubble pre {
    margin: 8px 0 0; padding: 12px 14px;
    background: rgba(0,0,0,0.35); border-radius: 10px;
    border: 1px solid var(--border); overflow-x: auto;
  }

  /* activity rail: subagent + tool chips */
  .activity { display: flex; flex-direction: column; gap: 8px; align-self: center; width: 100%; max-width: 76%; }
  .act {
    display: flex; align-items: center; gap: 10px;
    font-size: 12.5px; color: var(--muted);
    padding: 9px 13px; border-radius: 12px;
    background: rgba(255,255,255,0.03); border: 1px solid var(--border);
    animation: rise 0.3s ease;
  }
  .act .tag {
    font-family: "JetBrains Mono", monospace; font-size: 11px; font-weight: 500;
    padding: 2px 8px; border-radius: 7px; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .act.researcher .tag { background: rgba(34,211,238,0.16); color: #67e8f9; }
  .act.poet .tag { background: rgba(236,72,153,0.16); color: #f9a8d4; }
  .act .task { flex: 1; color: var(--text); opacity: 0.85; }
  .act .spin { width: 13px; height: 13px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); border-top-color: var(--accent2); animation: spin 0.7s linear infinite; }
  .act .done { color: #34d399; }
  .act .ms { color: var(--muted); font-variant-numeric: tabular-nums; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .pill { align-self: center; font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; opacity: 0.7; }

  .composer {
    width: 100%; max-width: 820px; padding: 14px 24px 22px;
  }
  form {
    display: flex; gap: 10px; align-items: center;
    padding: 8px 8px 8px 18px; border-radius: 18px;
    background: var(--panel); backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  form:focus-within { border-color: rgba(124,92,255,0.6); box-shadow: 0 0 0 4px rgba(124,92,255,0.12), var(--shadow); }
  input {
    flex: 1; border: none; outline: none; background: transparent;
    color: var(--text); font-size: 15px; font-family: inherit;
  }
  input::placeholder { color: var(--muted); }
  button {
    flex: 0 0 auto; width: 42px; height: 42px; border-radius: 13px; border: none;
    background: linear-gradient(135deg, var(--accent), #9b6bff);
    color: white; cursor: pointer; display: grid; place-items: center;
    transition: transform 0.15s ease, opacity 0.15s ease, filter 0.15s ease;
    box-shadow: 0 8px 22px -8px rgba(124,92,255,0.9);
  }
  button:hover:not(:disabled) { transform: translateY(-1px) scale(1.04); filter: brightness(1.08); }
  button:active:not(:disabled) { transform: scale(0.96); }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  button svg { width: 19px; height: 19px; }
</style>
</head>
<body>
<div class="app">
  <header>
    <div class="logo">✦</div>
    <div class="titles">
      <h1>Harness Chat</h1>
      <p>orchestrator delegating to researcher &amp; poet</p>
    </div>
    <div class="status"><span class="dot" id="dot"></span><span id="statusText">ready</span></div>
  </header>

  <div class="scroll" id="scroll">
    <div id="log">
      <div class="empty" id="empty">
        <div class="big">✦</div>
        <h2>What should the team work on?</h2>
        <div class="chips">
          <div class="chip">Research pangolins, then write a haiku</div>
          <div class="chip">Explain black holes, then a limerick</div>
          <div class="chip">Facts about octopuses + a short poem</div>
        </div>
      </div>
    </div>
  </div>

  <div class="composer">
    <form id="form">
      <input id="input" autocomplete="off" placeholder="Ask the orchestrator anything…" />
      <button id="send" type="submit" aria-label="Send">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/></svg>
      </button>
    </form>
  </div>
</div>

<script>
  const resourceId = "web-" + Math.random().toString(36).slice(2);
  const log = document.getElementById("log");
  const scroll = document.getElementById("scroll");
  const form = document.getElementById("form");
  const input = document.getElementById("input");
  const send = document.getElementById("send");
  const dot = document.getElementById("dot");
  const statusText = document.getElementById("statusText");

  // track in-flight subagent chips so we can flip them to "done"
  const activeAgents = {};

  function clearEmpty() {
    const empty = document.getElementById("empty");
    if (empty) empty.remove();
  }

  function scrollDown() {
    scroll.scrollTo({ top: scroll.scrollHeight, behavior: "smooth" });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  // light markdown: **bold**, \`code\`, and triple-backtick blocks
  function render(text) {
    let html = escapeHtml(text);
    html = html.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, (_, code) => "<pre>" + code.trim() + "</pre>");
    html = html.replace(/\`([^\`]+)\`/g, "<code>$1</code>");
    html = html.replace(/\\*\\*([^*]+)\\*\\*/g, "<strong>$1</strong>");
    return html;
  }

  function addMessage(role, text) {
    clearEmpty();
    const row = document.createElement("div");
    row.className = "row " + role;
    const avatar = document.createElement("div");
    avatar.className = "avatar " + (role === "user" ? "me" : "bot");
    avatar.textContent = role === "user" ? "🧑" : "✦";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = render(text);
    row.append(avatar, bubble);
    log.appendChild(row);
    scrollDown();
  }

  function ensureActivityRail() {
    let rail = document.getElementById("rail");
    if (!rail) {
      rail = document.createElement("div");
      rail.className = "activity";
      rail.id = "rail";
      log.appendChild(rail);
    }
    return rail;
  }

  function addSubagentStart(agentType, task) {
    clearEmpty();
    const rail = ensureActivityRail();
    const el = document.createElement("div");
    el.className = "act " + agentType;
    el.innerHTML =
      '<span class="tag">' + agentType + '</span>' +
      '<span class="task">' + escapeHtml(task) + '</span>' +
      '<span class="spin"></span>';
    rail.appendChild(el);
    activeAgents[agentType] = el;
    scrollDown();
  }

  function addSubagentEnd(agentType, ms) {
    const el = activeAgents[agentType];
    if (!el) return;
    const spin = el.querySelector(".spin");
    if (spin) spin.outerHTML = '<span class="done">✓</span>';
    const msEl = document.createElement("span");
    msEl.className = "ms";
    msEl.textContent = ms + "ms";
    el.appendChild(msEl);
    delete activeAgents[agentType];
  }

  function addPill(text) {
    const el = document.createElement("div");
    el.className = "pill";
    el.textContent = text;
    log.appendChild(el);
    scrollDown();
  }

  function setBusy(busy) {
    send.disabled = busy;
    dot.classList.toggle("busy", busy);
    statusText.textContent = busy ? "working…" : "ready";
  }

  const es = new EventSource("/api/stream?resourceId=" + resourceId);
  es.onmessage = (e) => {
    const ev = JSON.parse(e.data);
    switch (ev.type) {
      case "agent_start": setBusy(true); break;
      case "subagent_start": addSubagentStart(ev.agentType, ev.task); break;
      case "subagent_end": addSubagentEnd(ev.agentType, ev.durationMs); break;
      case "tool_start": break; // folded into subagent chips
      case "assistant":
        // skip the echo of the user's own prompt
        if (lastSent && ev.text.trim() === lastSent.trim()) break;
        document.getElementById("rail")?.removeAttribute("id");
        addMessage("assistant", ev.text);
        break;
      case "usage": addPill(ev.totalTokens.toLocaleString() + " tokens"); break;
      case "error": addMessage("assistant", "⚠️ " + ev.message); break;
      case "agent_end": setBusy(false); input.focus(); break;
    }
  };

  let lastSent = "";
  async function sendMessage(content) {
    content = content.trim();
    if (!content) return;
    lastSent = content;
    addMessage("user", content);
    input.value = "";
    setBusy(true);
    await fetch("/api/message", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ resourceId, content }),
    });
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); sendMessage(input.value); });
  document.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) sendMessage(chip.textContent);
  });
  input.focus();
</script>
</body>
</html>`;
