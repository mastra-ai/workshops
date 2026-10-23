// Tiny client for the running `mastra dev` server (default http://localhost:4111).
//   pnpm send <verb> "<text>" [--thread ID] [--agent ID] [--priority P] [--key K] [--ifIdle wake|persist]
// Verbs: message | queue | queue-skill | ci | cancel | cart | notify
const argv = process.argv.slice(2);
const flag = (n: string) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv.splice(i, 2)[1] : undefined;
};
const base = process.env.BASE ?? "http://localhost:4111";
const agentId = flag("agent") ?? "assistant";
const threadFlag = flag("thread") ?? process.env.THREAD;
const priority = flag("priority");
const key = flag("key");
const source = flag("source");
const ifIdle = flag("ifIdle");
const [verb, ...rest] = argv;
const text = rest.join(" ");
// Studio keys memory by agent id. With no --thread, use the agent's most recent thread:
// the one open in Studio.
const resourceId = agentId;
async function latestThread() {
  const r = await fetch(
    `${base}/api/memory/threads?agentId=${agentId}&resourceId=${resourceId}&orderBy=updatedAt&sortDirection=DESC&perPage=1`,
  );
  const j: any = await r.json();
  const id = j.threads?.[0]?.id;
  if (!id)
    throw new Error(
      `no ${agentId} thread yet: send ${agentId} a first message in Studio, or pass --thread ID`,
    );
  return id as string;
}
const threadId = threadFlag ?? (await latestThread());
console.log(`# ${agentId} thread ${threadId}`);

// Remember queued signal ids so `cancel` with no ids cancels what you just queued.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
const memo = new URL("../.queued-ids.json", import.meta.url);
const queued: string[] = existsSync(memo)
  ? JSON.parse(readFileSync(memo, "utf8"))
  : [];

async function post(path: string, body: unknown) {
  const r = await fetch(base + path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const t = await r.text();
  console.log(r.status, t);
  if (!r.ok) process.exit(1);
  return JSON.parse(t);
}
const target = { resourceId, threadId };
const a = `/api/agents/${agentId}`;

switch (verb) {
  case "message": // steer: delivered into the active run, or wakes an idle thread
    await post(`${a}/send-message`, { ...target, message: text });
    break;
  case "queue": // follow-up: never interrupts, runs after the current run
    {
      const j = await post(`${a}/queue-message`, { ...target, message: text });
      queued.push(j.signal.id);
      writeFileSync(memo, JSON.stringify(queued));
    }
    break;
  case "queue-skill":
    await post(`${a}/queue-signal`, {
      ...target,
      signal: {
        type: "notification",
        tagName: "skill",
        attributes: { name: "triage" },
        contents: text,
      },
    });
    break;
  case "ci": // system event: wakes by default, or persists with --ifIdle persist
    await post(`${a}/signals`, {
      ...target,
      signal: {
        type: "notification",
        tagName: "ci",
        attributes: { repo: "acme/app" },
        contents: text || "CI failed on main",
      },
      ifIdle: { behavior: ifIdle ?? "wake" },
    });
    break;
  case "cancel":
    await post(`${a}/threads/signals/cancel`, {
      ...target,
      signalIds: rest.length ? rest : queued.splice(0),
    });
    writeFileSync(memo, JSON.stringify(queued));
    break;
  case "cart": // same as clicking in the shop: `cart add|less|remove <sku>`; the agent hears on its next step
    await post(
      rest[0] === "remove" ? "/demo/cart/remove" : "/demo/cart/change",
      { threadId, sku: rest[1], by: rest[0] === "less" ? -1 : 1 },
    );
    break;
  case "notify":
    await post("/demo/notify", {
      agentId,
      source,
      threadId,
      text,
      priority,
      dedupeKey: key,
    });
    break;
  default:
    console.error(
      'usage: pnpm send message|queue|queue-skill|ci|cancel|cart|notify "<text>" [--thread ID] [--priority P] [--key K] [--ifIdle wake|persist]',
    );
    process.exit(2);
}
export {};
