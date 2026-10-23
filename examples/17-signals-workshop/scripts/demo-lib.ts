// Shared helpers for `pnpm demo1..4`: server startup, fresh threads, Studio URLs,
// a thread-stream watcher that tracks real run state, and Enter-paced cue steps.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";

export const base = process.env.BASE ?? "http://localhost:4111";
export const args = process.argv.slice(3);
export const AUTO = args.includes("--auto") || !process.stdin.isTTY;
export const NO_OPEN =
  args.includes("--no-open") || process.env.NO_OPEN === "1";
const projectDir = new URL("..", import.meta.url).pathname;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
};

// ---- server -----------------------------------------------------------------------------
const up = async () => {
  try {
    const r = await fetch(`${base}/api/agents`, {
      signal: AbortSignal.timeout(2000),
    });
    if (!r.ok) return false;
    const j: any = await r.json();
    return "assistant" in j && "builder" in j ? true : "other";
  } catch {
    return false;
  }
};

const alive = (pid: number) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e: any) {
    return e?.code === "EPERM";
  }
};

export async function ensureServer() {
  const state = await up();
  if (state === "other")
    throw new Error(
      `${base} answers, but it is not the studio-demo project. Stop whatever is on :4111.`,
    );
  if (state) return console.log(c.dim(`server: Studio is running at ${base}`));
  // Nothing answers on :4111. A dev.lock naming a live process means an orphaned `mastra dev` would make a new one refuse to start.
  const lockFile =
    process.env.DEMO_LOCK_FILE ?? `${projectDir}.mastra/dev.lock`;
  try {
    const { pid } = JSON.parse(readFileSync(lockFile, "utf8"));
    if (typeof pid === "number" && alive(pid)) {
      throw new Error(
        `.mastra/dev.lock names PID ${pid}, which is still running, but nothing answers on :4111.\n  A new \`mastra dev\` will refuse to start while it holds the lock. If it is a stale orphan, stop it yourself:\n    kill ${pid}\n  then start Studio (pnpm dev in the example directory) and run this demo again. (Not killed automatically.)`,
      );
    }
  } catch (e) {
    if ((e as Error).message.includes("dev.lock names")) throw e;
  }
  throw new Error("Start Studio first: pnpm dev (in the example directory)");
}

export async function api(
  path: string,
  body?: unknown,
  method = body === undefined ? "GET" : "POST",
) {
  const r = await fetch(base + path, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const t = await r.text();
  if (!r.ok)
    throw new Error(`${method} ${path} → ${r.status} ${t.slice(0, 300)}`);
  return t ? JSON.parse(t) : {};
}

export async function newThread(agentId: string, title: string) {
  const t = await api(`/api/memory/threads?agentId=${agentId}`, {
    resourceId: agentId,
    title,
  });
  return t.id as string;
}

// Studio 1.35.0: an agent thread lives at /agents/<agentId>/threads/<threadId> (/chat/<id> redirects there).
export const studioUrl = (agentId: string, threadId: string) =>
  `${base}/agents/${agentId}/threads/${threadId}`;
export function openStudio(
  agentId: string,
  threadId: string,
  url = studioUrl(agentId, threadId),
) {
  console.log(c.dim(`open: ${url}`));
  if (!NO_OPEN) spawnSync(process.env.OPEN_CMD ?? "open", [url]); // OPEN_CMD lets a test capture the URL instead of launching a browser
  return url;
}

// ---- thread watcher: real run state from the thread's SSE stream -------------------------
type Run = {
  id: string;
  started: number;
  finished?: number;
  tools: string[];
  toolResults: string[];
  text: string;
  signals: string[];
  synthetic: boolean;
};
export class Watcher {
  runs = new Map<string, Run>();
  raw: any[] = [];
  private abort = new AbortController();
  constructor(
    readonly agentId: string,
    readonly threadId: string,
  ) {}
  async start() {
    const r = await fetch(
      `${base}/api/agents/${this.agentId}/threads/subscribe`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: this.abort.signal,
        body: JSON.stringify({
          resourceId: this.agentId,
          threadId: this.threadId,
        }),
      },
    );
    if (!r.ok || !r.body) throw new Error(`subscribe failed ${r.status}`);
    void this.pump(r.body.getReader());
    await sleep(300);
  }
  private async pump(reader: ReadableStreamDefaultReader<Uint8Array>) {
    const dec = new TextDecoder();
    let buf = "";
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) return;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, i).trim();
          buf = buf.slice(i + 1);
          if (line.startsWith("data:"))
            try {
              this.onChunk(JSON.parse(line.slice(5)));
            } catch {}
        }
      }
    } catch {}
  }
  private onChunk(ch: any) {
    this.raw.push(ch);
    const id: string | undefined = ch.runId;
    if (!id) return;
    let run = this.runs.get(id);
    if (!run)
      this.runs.set(
        id,
        (run = {
          id,
          started: Date.now(),
          tools: [],
          toolResults: [],
          text: "",
          signals: [],
          synthetic: false,
        }),
      );
    const p = ch.payload ?? {};
    switch (ch.type) {
      case "start":
        run.synthetic = String(p.messageId ?? "").startsWith(
          "persisted-signal:",
        );
        break;
      case "tool-call":
        run.tools.push(p.toolName);
        break;
      case "tool-result":
        run.toolResults.push(p.toolName);
        break;
      case "text-delta":
        run.text += p.text ?? "";
        break;
      case "finish":
        run.finished = Date.now();
        break;
      default:
        if (typeof ch.type === "string" && ch.type.startsWith("data-"))
          run.signals.push(
            ch.type + ":" + JSON.stringify(ch.data ?? {}).slice(0, 200),
          );
    }
  }
  get real() {
    return [...this.runs.values()].filter((r) => !r.synthetic);
  }
  get active() {
    return this.real.filter((r) => !r.finished);
  }
  sawText(re: RegExp) {
    return this.raw.some((ch) => re.test(JSON.stringify(ch)));
  }
  async waitFor(label: string, pred: () => boolean, ms = 90_000) {
    const t0 = Date.now();
    while (!pred()) {
      if (Date.now() - t0 > ms)
        throw new Error(`timed out (${ms / 1000}s) waiting for: ${label}`);
      await sleep(100);
    }
  }
  /** Wait until the thread is idle: no active run and nothing new for `quietMs`. */
  async idle(label = "thread idle", quietMs = 2500, ms = 180_000) {
    const t0 = Date.now();
    let quietSince = 0;
    for (;;) {
      const busy = this.active.length > 0;
      if (busy) quietSince = 0;
      else if (!quietSince) quietSince = Date.now();
      if (!busy && quietSince && Date.now() - quietSince >= quietMs) return;
      if (Date.now() - t0 > ms)
        throw new Error(`timed out waiting for: ${label}`);
      await sleep(150);
    }
  }
  stop() {
    this.abort.abort();
  }
}

// ---- pacing ----------------------------------------------------------------------------
const rl = AUTO
  ? undefined
  : createInterface({ input: process.stdin, output: process.stdout });
const cleanups: Array<() => void | Promise<void>> = [];
export const onCleanup = (f: () => void | Promise<void>) =>
  void cleanups.push(f);
let leaving = false;
export async function leave(code: number) {
  if (leaving) return;
  leaving = true;
  for (const f of cleanups)
    try {
      await f();
    } catch {}
  rl?.close();
  process.exit(code);
}
process.on("SIGINT", () => {
  console.log(c.dim("\n^C: stopping the demo, leaving the server running."));
  void leave(130);
});
rl?.on("SIGINT", () => process.emit("SIGINT"));

let stepNo = 0;
export async function step(
  cue: string,
  detail: string,
  fn: () => Promise<void>,
  prompt = "[Enter] to run",
) {
  stepNo++;
  console.log(
    `\n${c.cyan(c.bold(`→ ${cue}`))}${detail ? c.dim(`\n   ${detail}`) : ""}`,
  );
  if (rl)
    await new Promise<void>((res) =>
      rl.question(c.dim(`   ${prompt} `), () => res()),
    );
  await fn();
}
export const say = (s: string) => console.log(c.dim("   " + s));

export const checks: Array<[boolean, string]> = [];
export function check(ok: boolean, what: string) {
  checks.push([ok, what]);
  console.log(`   ${ok ? c.green("✓") : c.red("✗")} ${what}`);
}
export const armHold = () => api("/demo/hold", {});
export const releaseIn = (ms: number) =>
  api("/demo/release-in", { ms }).catch(() => undefined);
