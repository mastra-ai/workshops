// One Mastra project for every workshop demo. `pnpm dev` starts Studio.
import path from "node:path";
import { Agent } from "@mastra/core/agent";
import { Mastra } from "@mastra/core/mastra";
import { registerApiRoute } from "@mastra/core/server";
import {
  createNotificationInboxTool,
  dispatchDueNotifications,
} from "@mastra/core/notifications";
import { TaskSignalProvider } from "@mastra/core/signals";
import { createTool } from "@mastra/core/tools";
import { LocalFilesystem, Workspace } from "@mastra/core/workspace";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { z } from "zod";
import {
  currentStatus,
  startWorkItem,
  setStatus,
  setSubmission,
  setReview,
  nextPr,
  workHistory,
  workLane,
  workThreads,
} from "./work-item";
import { shop, ORDER_ID, money } from "./shop";
import { shopPage, splitPage } from "./pages";
import { home, homeRoutes } from "./home";
import { homePage } from "./home-page";

// `mastra dev` runs from .mastra/output, so anchor files to the project root.
const root =
  process.env.DEMO_ROOT ??
  process
    .cwd()
    .replace(/[\\/](\.mastra[\\/]output|src[\\/]mastra[\\/]public)$/, "");
export const model = process.env.MODEL ?? "deepseek/deepseek-chat";
// Studio keys a chat's memory by the agent id, so every thread here uses resourceId = agent id.
// That is what makes threads created by `pnpm send` show up in Studio's thread list.

const storage = new LibSQLStore({
  id: "workshop",
  url: process.env.DB_URL ?? `file:${path.join(root, "workshop.db")}`,
});

// ---- Demos 1-3: send/queue/steer, state, notifications -----------------------------------
const SLOW_MS = Number(process.env.SLOW_MS ?? 20_000);
// Demo runners arm a hold before they send: the tool stays open until a release deadline
// (POST /demo/release-in, e.g. 5 s after the steer) or a 90 s safety cap. Unarmed (Studio typing,
// `pnpm send`) it just takes SLOW_MS.
const demoHold = { armed: false, armedAt: 0, releaseAt: 0 };
// A hold only counts if a runner armed it moments ago; one left armed by an aborted runner would hang the next Studio send for the full cap.
const HOLD_FRESH_MS = 30_000;
const HOLD_CAP_MS = 90_000;
const slowResearch = createTool({
  id: "slowResearch",
  description:
    "Research a topic. Takes a while. Use it for any research or comparison question.",
  inputSchema: z.object({ topic: z.string() }),
  execute: async ({ topic }) => {
    const start = Date.now();
    if (!(demoHold.armed && Date.now() - demoHold.armedAt < HOLD_FRESH_MS))
      await new Promise((r) => setTimeout(r, SLOW_MS));
    else {
      while (
        Date.now() - start < HOLD_CAP_MS &&
        !(demoHold.releaseAt && Date.now() >= demoHold.releaseAt)
      )
        await new Promise((r) => setTimeout(r, 100));
      demoHold.armed = false;
      demoHold.releaseAt = 0;
    }
    return {
      topic,
      findings: `Three vendors compared for "${topic}". Vendor A is cheapest, B is fastest, C has the best support.`,
    };
  },
});

const notificationsStore = await storage
  .init()
  .then(() => storage.getStore("notifications"));
if (!notificationsStore)
  throw new Error("libSQL storage has no notifications domain");

export const assistant = new Agent({
  id: "assistant",
  name: "Assistant",
  instructions: [
    "You are a concise research assistant. Answer in at most 4 short sentences.",
    "For research or comparison questions, call slowResearch once.",
    "Messages tagged <user> that arrive while you work are the user adding to their request: take them into account.",
    "Other tags (for example <ci>, <notification>) are system events, not the user. Mention them briefly when relevant.",
    "Use the notificationInbox tool only when the user asks about the inbox. A <notification-summary> just means updates are waiting: mention it in one short line.",
    "Only use the task tools when the user explicitly asks you to track tasks.",
  ].join("\n"),
  model,
  memory: new Memory(),
  tools: {
    slowResearch,
    notificationInbox: createNotificationInboxTool({
      storage: notificationsStore,
    }),
  },
  signals: [new TaskSignalProvider()],
});

// ---- Demo 4: minimal agent-to-agent ------------------------------------------------------
// Demo 2's agent: the shop lane processor keeps it up to date with the cart and the shopping status, and
// shop events arrive as notifications. Its memory window is short, so the first <shop> snapshot scrolls out
// during the demo and the processor sends a fresh one.
export const SHOP_LAST_MESSAGES = Number(process.env.SHOP_LAST_MESSAGES ?? 15);
export const shopper = new Agent({
  id: "shopper",
  name: "Shopper",
  instructions: [
    "You are a concise shopping assistant for Corner Market. Answer in at most 3 short sentences.",
    "<shop> is the user's cart (each line with its current price) and shopping status; each later <shop-update> lists what changed since. The newest one wins.",
    "Answer cart questions only from them, naming the items; never invent items. If asked for an opinion (is this a good breakfast?), give one honestly and mention the items that matter.",
    "<notification> messages are shop events. When one arrives, tell the user right away in one or two sentences what happened and what it means for them (for a sale on something in their cart, say the new price).",
    "If a <notification-summary> has arrived since your last reply, first call notificationInbox (action list, status pending) and tell the user in one line what is new, then answer. If the user asks about the inbox, list all notifications with priority and status.",
  ].join("\n"),
  model,
  memory: new Memory({ options: { lastMessages: SHOP_LAST_MESSAGES } }),
  tools: {
    notificationInbox: createNotificationInboxTool({
      storage: notificationsStore,
    }),
  },
  inputProcessors: [shop],
});

// A shop event: store the change, then notify the shopper's thread. On an idle thread a medium/high notification
// wakes a run; whoever gets `wake` owns its stream, so drain it here and let Studio follow it through the thread.
const shopNotify = async (
  threadId: string,
  n: {
    kind: string;
    priority: "low" | "medium" | "high" | "urgent";
    summary: string;
    dedupeKey?: string;
  },
) => {
  const res = await shopper.sendNotificationSignal(
    { source: "corner-market", ...n },
    { resourceId: "shopper", threadId },
  );
  void res.accepted
    ?.then((a) => {
      if (a.action === "wake") void a.output?.consumeStream?.();
    })
    .catch(() => {});
  return {
    recordId: res.record.id,
    status: res.record.status,
    decision: res.decision.action,
    reason: res.decision.reason,
    coalescedCount: res.record.coalescedCount,
    priority: n.priority,
  };
};
const PACKED_KEY = `order-${ORDER_ID}-packed`;
const DELAY_KEY = `order-${ORDER_ID}-delay`;

// ---- Demo 4: builder and reviewer, coordinated only by signals ----------------------------
// One prompt goes to the builder. The shared work item reaches both agents as a state signal, the builder's
// submitForReview and each agent's messagePeer reach the other as notification signals, and a notification
// wakes the idle agent, so nobody prompts the reviewer.
const workspaceRoot =
  process.env.PEER_WORKSPACE ?? path.join(root, "peer-workspace");
const builderWorkspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: workspaceRoot }),
});
const reviewerWorkspace = new Workspace({
  filesystem: new LocalFilesystem({ basePath: workspaceRoot, readOnly: true }),
});
await builderWorkspace.init();
await reviewerWorkspace.init();

// Notify a peer's thread. On an idle thread a medium/high notification wakes a run; whoever gets `wake` owns its stream, so drain it.
const notifyPeer = async (
  agent: Agent,
  threadId: string,
  n: { source: string; kind: string; summary: string; dedupeKey: string },
) => {
  const res = await agent.sendNotificationSignal(
    { ...n, priority: "high" },
    { resourceId: agent.id, threadId },
  );
  void res.accepted
    ?.then((a) => {
      if (a.action === "wake") void a.output?.consumeStream?.();
    })
    .catch(() => {});
  return res.decision.action;
};
let messageCount = 0;

const submitForReview = createTool({
  id: "submitForReview",
  description:
    "Submit your finished work for review. Records the submission and notifies the reviewer.",
  inputSchema: z.object({
    summary: z.string().describe("One sentence: what you built or changed."),
  }),
  execute: async ({ summary }) => {
    if (currentStatus() === "in review")
      return {
        error:
          "Already in review; wait for the reviewer's verdict instead of submitting again.",
      };
    const { reviewer: reviewerThread } = workThreads();
    if (!reviewerThread)
      throw new Error("no reviewer thread is paired with this work item");
    const pr = nextPr();
    setStatus("in review");
    setSubmission(`${pr}: ${summary}`);
    await notifyPeer(reviewer, reviewerThread, {
      source: "builder",
      kind: "review-request",
      summary: `${pr} is ready for review: ${summary} Read parse-duration.ts and countdown.html in your workspace, then give your verdict with messagePeer.`,
      dedupeKey: pr,
    });
    return { submitted: pr, status: "in review" };
  },
});
const builderMessagePeer = createTool({
  id: "messagePeer",
  description:
    "Send a short message to the reviewer. It arrives as a notification in their thread.",
  inputSchema: z.object({ text: z.string() }),
  execute: async ({ text }) => {
    const { reviewer: reviewerThread } = workThreads();
    await notifyPeer(reviewer, reviewerThread, {
      source: "builder",
      kind: "message",
      summary: text,
      dedupeKey: `b-msg-${++messageCount}`,
    });
    return { sent: true };
  },
});
const reviewerMessagePeer = createTool({
  id: "messagePeer",
  description:
    "Send your verdict and a short message to the builder. It arrives as a notification in their thread and updates the work item.",
  inputSchema: z.object({
    verdict: z.enum(["changes_requested", "approved"]),
    text: z
      .string()
      .describe(
        "One or two sentences: the one change you need, or why you approve.",
      ),
  }),
  execute: async ({ verdict, text }) => {
    if (currentStatus() !== "in review")
      throw new Error(
        "Nothing is submitted for review right now; do not send a verdict. Reply with one sentence instead.",
      );
    const { builder: builderThread } = workThreads();
    setStatus(verdict === "approved" ? "approved" : "changes requested");
    setReview(`${verdict.replace("_", " ")}: ${text}`);
    await notifyPeer(builder, builderThread, {
      source: "reviewer",
      kind: "review-verdict",
      summary: `${verdict.replace("_", " ")}: ${text}`,
      dedupeKey: `r-msg-${++messageCount}`,
    });
    return {
      sent: true,
      status: verdict === "approved" ? "approved" : "changes requested",
    };
  },
});

export const builder = new Agent({
  id: "builder",
  name: "Builder",
  model,
  instructions: [
    "You build small TypeScript and HTML pieces in your workspace. Write the files yourself; do not only describe them.",
    "A page must be a single self-contained HTML file with no imports: a browser cannot load .ts files, so inline any helper it needs.",
    "<work-item> is your assigned work item and its current status; each later <work-item-update> lists what changed. The newest one wins.",
    "Do not start work, write files or call tools until the user gives you a build instruction; to a greeting, reply with one short sentence only. The work item is context, not an instruction.",
    "When your work is finished, call submitForReview once. Never claim it is approved yourself.",
    'A <notification source="reviewer"> is the reviewer\'s verdict. If changes are requested, make exactly that change in your files, then call submitForReview again. If it is approved, reply with one sentence and stop.',
    "Do not add input validation unless the reviewer asks for it. Keep every reply to at most 2 short sentences.",
  ].join("\n"),
  memory: new Memory(),
  workspace: builderWorkspace,
  tools: { submitForReview, messagePeer: builderMessagePeer },
  inputProcessors: [workLane],
  defaultOptions: { maxSteps: 25 },
});

export const reviewer = new Agent({
  id: "reviewer",
  name: "Reviewer",
  model,
  instructions: [
    "You review work in your workspace. You are read-only: never claim to have changed a file.",
    "<work-item> is the shared work item and its status; each later <work-item-update> lists what changed. The newest one wins.",
    'A <notification source="builder"> saying a PR is ready is your cue: read parse-duration.ts and countdown.html, then call messagePeer exactly once with your verdict. Do not wait for anyone to prompt you. Until then, and for any other message, do not call messagePeer: just reply in one sentence.',
    'If the work item says "review: none yet", this is the first review: request exactly ONE change, that parseDuration must throw a clear Error on invalid input (an empty string or an unknown unit). Use verdict changes_requested.',
    "On a later review, read parse-duration.ts and countdown.html: if parseDuration throws on invalid input, use verdict approved with one sentence on what is good about the new work; otherwise request that change again.",
    "Keep every reply to at most 2 short sentences.",
  ].join("\n"),
  memory: new Memory(),
  workspace: reviewerWorkspace,
  tools: { messagePeer: reviewerMessagePeer },
  inputProcessors: [workLane],
  defaultOptions: { maxSteps: 12 },
});

// ---- Routes Studio cannot call itself -----------------------------------------------------
// `pnpm send cart|notify ...` posts here. The cart routes only change the app's store:
// the cart processor emits the state signal on the thread's next model step.
const demoRoute = (path: string, handle: (body: any) => Promise<unknown>) =>
  registerApiRoute(path, {
    method: "POST",
    handler: async (c) => {
      try {
        return c.json((await handle(await c.req.json())) as object);
      } catch (e) {
        return c.json({ error: String((e as Error)?.message ?? e) }, 500);
      }
    },
  });

export const mastra = new Mastra({
  agents: { assistant, shopper, home, builder, reviewer },
  storage,
  server: {
    apiRoutes: [
      // Demo 2: the shop page (and --auto) post here. Cart edits and the status only change the store: the shop lane
      // processor tells the agent on its next model step. Shop events also send a notification.
      demoRoute("/demo/cart/state", async (body) => shop.view(body.threadId)),
      demoRoute(
        "/demo/cart/change",
        async (body) => (
          shop.change(body.threadId, body.sku, Number(body.by ?? 1)),
          shop.view(body.threadId)
        ),
      ),
      demoRoute(
        "/demo/cart/remove",
        async (body) => (
          shop.remove(body.threadId, body.sku),
          shop.view(body.threadId)
        ),
      ),
      demoRoute(
        "/demo/shop/checkout",
        async (body) => (
          shop.setStatus(body.threadId, "checking out"),
          shop.view(body.threadId)
        ),
      ),
      demoRoute("/demo/shop/order", async (body) => {
        const t = body.threadId;
        shop.setStatus(t, "ordered");
        const v = shop.view(t);
        const n = await shopNotify(t, {
          kind: "order",
          priority: "medium",
          summary: `Order #${ORDER_ID} placed: ${v.lines.reduce((q, l) => q + l.qty, 0)} items, ${money(v.subtotal)}.`,
        });
        return { ...shop.view(t), notification: n };
      }),
      demoRoute("/demo/shop/sale", async (body) => {
        const t = body.threadId,
          sku = body.sku ?? "oat-milk";
        const was = shop.price(t, sku);
        shop.putOnSale(t, sku, Number(body.pct ?? 30));
        const item = shop.view(t).products.find((p) => p.sku === sku)!;
        const n = await shopNotify(t, {
          kind: "price-drop",
          priority: shop.has(t, sku) ? "high" : "low",
          summary: `${item.name} is on sale: ${money(item.price)} (was ${money(was)})${shop.has(t, sku) ? ". It is in your cart." : "."}`,
          dedupeKey: `sale-${sku}`,
        });
        return { ...shop.view(t), notification: n };
      }),
      // Packed is low priority: core holds it as a pending inbox record and does not wake the agent. Its quiet
      // <notification-summary> marker would otherwise land on the dispatcher's once-a-minute tick (0-60 s later);
      // dispatching here puts it in the thread now, still without a run, so the agent's next turn picks it up.
      demoRoute("/demo/shop/pack", async (body) => {
        shop.setStage(body.threadId, "packed");
        const n = await shopNotify(body.threadId, {
          kind: "packed",
          priority: "low",
          summary: `Order #${ORDER_ID} packed.`,
          dedupeKey: PACKED_KEY,
        });
        const d = await dispatchDueNotifications({
          mastra,
          storage: notificationsStore,
          resourceId: "shopper",
        });
        return {
          ...shop.view(body.threadId),
          notification: n,
          dispatched: d.signals.length,
          log: `→ low: held in the inbox, won't interrupt. The agent picks it up on its next turn.`,
        };
      }),
      // Shipped is medium: on an idle thread it is delivered at once and wakes the agent.
      demoRoute("/demo/shop/ship", async (body) => {
        shop.setStage(body.threadId, "shipped");
        const n = await shopNotify(body.threadId, {
          kind: "shipped",
          priority: "medium",
          summary: `Order #${ORDER_ID} shipped.`,
        });
        return { ...shop.view(body.threadId), notification: n };
      }),
      demoRoute("/demo/shop/delay", async (body) => {
        shop.setStage(body.threadId, "delayed");
        const n = await shopNotify(body.threadId, {
          kind: "shipping-delay",
          priority: "high",
          summary: `Order #${ORDER_ID}: delivery delayed by a day (carrier backlog). New ETA tomorrow.`,
          dedupeKey: DELAY_KEY,
        });
        return { ...shop.view(body.threadId), notification: n };
      }),
      // The thread's notification records, for the runner's checks (the agent reads them with notificationInbox).
      demoRoute("/demo/shop/records", async (body) =>
        (
          await notificationsStore.listNotifications({
            threadId: body.threadId,
          })
        ).map((r) => ({
          id: r.id,
          kind: r.kind,
          priority: r.priority,
          status: r.status,
          coalescedCount: r.coalescedCount,
          summary: r.summary,
          dedupeKey: r.dedupeKey,
        })),
      ),
      // Demo 3: the home dashboard posts here; device events notify the home agent.
      ...homeRoutes,
      registerApiRoute("/demo/home", {
        method: "GET",
        handler: async (c) => c.html(homePage(c.req.query("thread") ?? "")),
      }),
      registerApiRoute("/demo/house", {
        method: "GET",
        handler: async (c) => {
          const thread = c.req.query("thread") ?? "";
          return c.html(
            splitPage({
              title: "Demo 3: Home",
              left: `/demo/home?thread=${encodeURIComponent(thread)}`,
              right: `/agents/home/threads/${encodeURIComponent(thread)}`,
            }),
          );
        },
      }),
      registerApiRoute("/demo/shop", {
        method: "GET",
        handler: async (c) => c.html(shopPage(c.req.query("thread") ?? "")),
      }),
      registerApiRoute("/demo/split", {
        method: "GET",
        handler: async (c) => {
          const b = encodeURIComponent(c.req.query("builder") ?? "");
          const r = encodeURIComponent(c.req.query("reviewer") ?? "");
          return c.html(
            splitPage({
              title: "Demo 4: builder and reviewer",
              left: `/agents/builder/threads/${b}`,
              right: `/agents/reviewer/threads/${r}`,
              columns: "1fr 1fr",
            }),
          );
        },
      }),
      registerApiRoute("/demo/cart", {
        method: "GET",
        handler: async (c) => {
          const thread = c.req.query("thread") ?? "";
          return c.html(
            splitPage({
              title: "Demo 2: Corner Market",
              left: `/demo/shop?thread=${encodeURIComponent(thread)}`,
              right: `/agents/shopper/threads/${encodeURIComponent(thread)}`,
            }),
          );
        },
      }),
      demoRoute("/demo/hold", async () => {
        demoHold.armed = true;
        demoHold.armedAt = Date.now();
        demoHold.releaseAt = 0;
        return demoHold;
      }),
      demoRoute("/demo/release-in", async (body) => {
        demoHold.releaseAt = Date.now() + Number(body.ms ?? 5000);
        return demoHold;
      }),
      demoRoute(
        "/demo/pair",
        async (body) => (
          startWorkItem(body.builderThread, body.reviewerThread),
          { threads: workThreads(), history: workHistory() }
        ),
      ),
      demoRoute("/demo/work", async () => ({
        threads: workThreads(),
        history: workHistory(),
      })),
      demoRoute("/demo/notify", async (body) => {
        const target = {
          resourceId: body.agentId ?? "assistant",
          threadId: body.threadId,
        };
        const priority = body.priority ?? "medium";
        const res = await (
          (body.agentId === "builder" ? builder : assistant) as typeof assistant
        ).sendNotificationSignal(
          {
            source: body.source ?? "github",
            kind:
              body.kind ??
              (body.source === "reviewer" ? "review" : "ci-status"),
            priority,
            summary: body.text || `${priority} notification`,
            dedupeKey: body.dedupeKey,
          },
          target,
        );
        // An idle-thread delivery wakes a run, and whoever gets `wake` owns its stream: drain it so the run finishes.
        void res.accepted
          ?.then((a) => {
            if (a.action === "wake") void a.output?.consumeStream?.();
          })
          .catch(() => {});
        return {
          recordId: res.record.id,
          status: res.record.status,
          decision: res.decision.action,
          reason: res.decision.reason,
          runId: res.runId,
          coalescedCount: res.record.coalescedCount,
        };
      }),
      // Runs the notification dispatcher now instead of waiting for its once-a-minute schedule.
      // On an idle thread only the low-priority summary needs it: medium/high deliver on send.
      demoRoute("/demo/dispatch", async (body) => {
        const r = await dispatchDueNotifications({
          mastra,
          storage: notificationsStore,
          ...(body.resourceId ? { resourceId: body.resourceId } : {}),
        });
        return {
          delivered: r.delivered.length,
          failed: r.failed.length,
          signals: r.signals.length,
        };
      }),
    ],
  },
});
