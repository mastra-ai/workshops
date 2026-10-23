// One command per workshop demo. Usage (from this example directory):
//   pnpm demo1 | demo2 | demo3 | demo4   [--auto] [--no-open]
// It needs Studio running (pnpm dev), makes a fresh thread, opens it in Studio, then walks the cues.
// Each step waits for Enter (Tyler's pacing) unless --auto; timing inside a step follows the thread's real run state.
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import {
  api,
  args,
  AUTO,
  base,
  check,
  checks,
  armHold,
  ensureServer,
  leave,
  releaseIn,
  newThread,
  onCleanup,
  openStudio,
  say,
  sleep,
  step,
  Watcher,
  c,
} from "./demo-lib";

const demo = process.argv[2];
const send = (agent: string, thread: string, message: string) =>
  api(`/api/agents/${agent}/send-message`, {
    resourceId: agent,
    threadId: thread,
    message,
  });
const queue = (agent: string, thread: string, message: string) =>
  api(`/api/agents/${agent}/queue-message`, {
    resourceId: agent,
    threadId: thread,
    message,
  });
const notify = (
  agent: string,
  thread: string,
  text: string,
  priority: string,
  key?: string,
  source?: string,
  kind?: string,
) =>
  api("/demo/notify", {
    agentId: agent,
    threadId: thread,
    text,
    priority,
    dedupeKey: key,
    source,
    kind,
  });
const lastRun = (w: Watcher) => w.real[w.real.length - 1];
const researchTool = (w: Watcher) =>
  w.real.find((r) => r.tools.includes("slowResearch") && !r.finished);

async function begin(
  agent: string,
  title: string,
  {
    seed = true,
    url,
    setupOnly = false,
  }: {
    seed?: boolean;
    url?: (thread: string) => string;
    setupOnly?: boolean;
  } = {},
) {
  console.log(
    c.bold(`\n${title}`) +
      c.dim(
        AUTO
          ? "  (auto: no pauses)"
          : setupOnly
            ? "  (sets up the thread; you click and type)"
            : "  (press Enter at each cue)",
      ),
  );
  // Per-phase setup timing, printed dimly so a slow start is visible.
  const t0 = Date.now();
  let last = t0;
  const phases: string[] = [];
  const lap = (name: string) => {
    const now = Date.now();
    phases.push(`${name} ${((now - last) / 1000).toFixed(2)}s`);
    last = now;
  };
  await ensureServer();
  lap("server");
  const thread = await newThread(agent, title);
  lap("thread");
  const w = new Watcher(agent, thread);
  await w.start();
  lap("subscribe");
  onCleanup(() => w.stop());
  openStudio(agent, thread, url?.(thread));
  lap("open");
  if (seed) {
    await send(agent, thread, "Hi. Reply in one sentence.");
    lap("seed send");
    await w.idle("seed reply", 500);
    lap("seed reply"); // 500 ms quiet is enough after a one-sentence seed (was 2.5 s)
    say("seeded: the thread now has a first exchange");
  }
  console.log(
    c.dim(
      `   setup ${((Date.now() - t0) / 1000).toFixed(2)}s: ${phases.join(" · ")}`,
    ),
  );
  return { thread, w };
}

async function demo1() {
  const { thread, w } = await begin(
    "assistant",
    "Demo 1: send, queue, steer, cancel",
  );
  onCleanup(() => releaseIn(0));
  let r1: string | undefined;
  await step(
    "send to an idle thread: it wakes a run",
    "message: 'Compare SQLite and DuckDB for embedded analytics.'",
    async () => {
      await armHold(); // slowResearch stays open until 5 s after the steer (90 s safety cap)
      const res = await send(
        "assistant",
        thread,
        "Compare SQLite and DuckDB for embedded analytics.",
      );
      r1 = res.runId;
      check(
        res.accepted === true && !!r1,
        `accepted, run ${r1?.slice(0, 8)} woke (thread was idle)`,
      );
      await w.waitFor(
        "slowResearch tool call to start",
        () => !!researchTool(w),
      );
      say(
        "slowResearch is running and stays open until 5 s after the steer: take your time on queue and cancel.",
      );
    },
  );
  const ids: string[] = [];
  await step(
    "queueing two follow-ups while the run is busy",
    "'then translate to French', 'then summarise in one line': they wait, never interrupt",
    async () => {
      for (const m of [
        "then translate to French",
        "then summarise in one line",
      ]) {
        const res = await queue("assistant", thread, m);
        ids.push(res.signal.id);
      }
      check(
        ids.length === 2 && w.active.some((r) => r.id === r1),
        "both queued while run 1 is still busy",
      );
    },
  );
  await step(
    "cancelling the second queued follow-up before it starts",
    "cancel 'summarise in one line'; the French one stays queued",
    async () => {
      const res = await api("/api/agents/assistant/threads/signals/cancel", {
        resourceId: "assistant",
        threadId: thread,
        signalIds: [ids[1]],
      });
      say(`cancel → ${JSON.stringify(res).slice(0, 120)}`);
      check(
        !!res.cancelledSignalIds?.includes(ids[1]) &&
          w.active.some((r) => r.id === r1),
        "the summary was cancelled while run 1 was still busy, so it never started",
      );
    },
  );
  await step(
    "steering: 'also include pricing' (joins the same run)",
    "accepted now; the agent reads it when the tool returns, and you'll see it in Studio then",
    async () => {
      const res = await send("assistant", thread, "also include pricing");
      await releaseIn(5000);
      check(
        res.runId === r1,
        `steer accepted into the same run (${res.runId?.slice(0, 8)} = ${r1?.slice(0, 8)})`,
      );
      say(
        "slowResearch returns in 5 s; watch Studio: the steer appears, then the answer, then the French run",
      );
      await w.waitFor("first run to finish", () => !!w.runs.get(r1!)?.finished);
      await w.waitFor("queued French run to start", () => w.real.length >= 3);
      await w.idle("queued runs done", 6000);
    },
  );
  const real = w.real;
  check(
    real.length === 3,
    `exactly 3 runs: seed, research, French follow-up (got ${real.length}); the cancelled summary never ran`,
  );
  check(
    real[2]?.id !== r1 &&
      (real[2]?.started ?? 0) >= (w.runs.get(r1!)?.finished ?? Infinity) - 50,
    "the queued follow-up ran as a different, later run",
  );
  check(
    /pric|cost/i.test(w.runs.get(r1!)?.text ?? ""),
    "run 1 answer reflects the steer (mentions pricing/cost)",
  );
}

async function demo2() {
  // One shop demo (Tyler's merged demo 2 + 3). Split screen: Corner Market on the left (Tyler clicks, including the
  // store-events panel), the shopper's Studio thread on the right (Tyler asks).
  // State: the shop lane processor (cart lines with current prices + shopping status). Notifications: shop events.
  const { thread, w } = await begin(
    "shopper",
    "Demo 2: the shop (state + notification signals)",
    { url: (t) => `${base}/demo/cart?thread=${t}`, setupOnly: true },
  );
  // Live: set up only. Tyler clicks in the shop (left) and types in Studio (right); nothing here drives either.
  if (!AUTO) {
    console.log(`\n${c.bold("Ready.")} ${base}/demo/cart?thread=${thread}\n`);
    [
      'Add Oat milk, Coffee beans, Candy → ask "Is this a good breakfast?"         <shop> snapshot; the agent calls out the candy',
      '✕ Candy, add Bananas → ask "How about now?"                                one <shop-update> delta; the agent says it is better',
      'Store events: "Put oat milk on sale"                                      high: the agent speaks up + price delta',
      'Checkout → Place order                                                    medium "Order #1042 placed" + status delta',
      "Store events: Pack                                                        low: held in the inbox, no run (quiet summary marker)",
      'Store events: Ship                                                        medium: wakes the agent; it checks the inbox and mentions "packed"',
      'Store events: "Delay delivery"                                            high: the agent speaks up',
      'Ask "What did I order?"                                                   fresh <shop> snapshot (old one scrolled out)',
    ].forEach((l, i) => console.log(c.cyan(`  ${i + 1}. `) + l));
    return;
  }
  const post = (path: string, body: object = {}) =>
    api(path, { threadId: thread, ...body });
  const msgs = async () =>
    (
      await api(
        `/api/memory/threads/${thread}/messages?agentId=shopper&resourceId=shopper&perPage=300`,
      )
    ).messages ?? [];
  const sigOf = (m: any) => m.content?.metadata?.signal;
  // The shop-lane state signals on this thread, oldest first.
  const lane = async () =>
    (await msgs())
      .filter(
        (m: any) =>
          sigOf(m)?.type === "state" && sigOf(m).metadata?.state?.id === "shop",
      )
      .map((m: any) => ({
        mode: sigOf(m).metadata.state.mode as string,
        text: (m.content.parts ?? []).map((p: any) => p.text ?? "").join(""),
        value: sigOf(m).metadata.value as {
          status: string;
          items: Record<string, { qty: number; price: number }>;
        },
      }));
  const signalsOfType = async (type: string) =>
    (await msgs()).filter((m: any) => sigOf(m)?.type === type);
  const records = () =>
    post("/demo/shop/records") as Promise<
      Array<{
        kind: string;
        priority: string;
        status: string;
        coalescedCount?: number;
        summary: string;
      }>
    >;
  const cartNow = async () => {
    const v = await post("/demo/cart/state");
    return Object.fromEntries(
      v.lines.map((l: any) => [l.sku, { qty: l.qty, price: l.price }]),
    );
  };
  const showLane = (l: Awaited<ReturnType<typeof lane>>) =>
    l.length &&
    say(
      `<${l[l.length - 1].mode === "snapshot" ? "shop" : "shop-update"}> ${l[l.length - 1].text.replace(/\n/g, " | ")}`,
    );
  const mentions = (answer: string, skus: string[]) =>
    skus.every((sku) =>
      new RegExp(sku.split("-")[0].replace(/s$/, ""), "i").test(answer),
    );
  let runsSeen = w.real.length;
  // Wait for the next run (an ask, or a notification that woke the agent) to finish, and return its text.
  const answer = async (what = "the answer") => {
    await w.waitFor(what, () => w.real.length > runsSeen, 60_000);
    await w.idle("answer finished");
    runsSeen = w.real.length;
    const text = lastRun(w)?.text ?? "";
    say(`shopper: ${text.replace(/\n/g, " ").slice(0, 240)}`);
    return text;
  };
  const ask = async (q: string) => {
    if (AUTO) await send("shopper", thread, q);
    return answer();
  };
  const live = "Enter once the answer is in";

  // 1. Add items, ask → snapshot.
  await step(
    'add Oat milk, Coffee beans and Candy, then ask: "is this a good breakfast?"',
    "nothing in the context window yet, so the shop lane sends a <shop> snapshot: lines with prices, status browsing. The agent reads it and calls out the candy",
    async () => {
      if (AUTO)
        for (const sku of ["oat-milk", "coffee", "candy"])
          await post("/demo/cart/change", { sku, by: 1 });
      const before = await cartNow();
      const a = await ask("Is this a good breakfast?");
      const l = await lane();
      showLane(l);
      check(l.length === 1 && l[0].mode === "snapshot", "one <shop> snapshot");
      check(
        JSON.stringify(l[0]?.value.items) === JSON.stringify(before) &&
          l[0]?.value.status === "browsing",
        "the snapshot is the cart on the left, status browsing",
      );
      check(/cand/i.test(a), "the agent comments on the candy");
    },
    live,
  );

  // 2. Add more, remove one, ask → one delta.
  await step(
    'remove Candy (✕), add Bananas, then ask: "how about now?"',
    "a snapshot is in the window, so the lane sends one <shop-update> delta: candy out, bananas in",
    async () => {
      if (AUTO) {
        await post("/demo/cart/remove", { sku: "candy" });
        await post("/demo/cart/change", { sku: "bananas", by: 1 });
      }
      const a = await ask("How about now?");
      const l = await lane();
      showLane(l);
      const d = l[1];
      check(
        l.length === 2 && d?.mode === "delta",
        "exactly one <shop-update> delta",
      );
      check(
        !!d && /^− Candy/m.test(d.text) && /^\+ 1× Bananas/m.test(d.text),
        "the delta: − Candy, + Bananas",
      );
      check(
        /banana/i.test(a) && /better|good|improv|healthier|solid|yes/i.test(a),
        "the agent says it is better (mentions bananas)",
      );
    },
    live,
  );

  // 3. Sale on an item in the cart → high notification wakes the agent; the price change rides along as a delta.
  await step(
    'store events: click "Put oat milk on sale"',
    "a high-priority notification wakes the agent right away; the new price also arrives as a <shop-update> delta in the same step",
    async () => {
      if (AUTO) await post("/demo/shop/sale", { sku: "oat-milk" });
      const a = await answer("the agent to react");
      const l = await lane();
      showLane(l);
      const sale = (await records()).find((r) => r.kind === "price-drop");
      say(
        `notification: ${sale?.priority} · ${sale?.status} · ${sale?.summary}`,
      );
      check(
        sale?.priority === "high" && sale.status === "delivered",
        "high-priority sale notification, delivered (it woke the agent)",
      );
      check(
        l.length === 3 &&
          l[2].mode === "delta" &&
          /Oat milk now \$3\.15/.test(l[2].text),
        "the same step carries a delta: Oat milk now $3.15",
      );
      check(
        /oat milk/i.test(a) && /3\.15/.test(a),
        "the agent tells you oat milk is on sale at $3.15",
      );
    },
    "Enter once the agent has said it",
  );

  // 4. Check out → status delta + order-placed notification (medium).
  await step(
    "click Checkout, then Place order",
    "status goes browsing → checking out → ordered; the order notification (medium) wakes the agent and the status arrives as a delta",
    async () => {
      if (AUTO) {
        await post("/demo/shop/checkout");
        await sleep(800);
        await post("/demo/shop/order");
      }
      const a = await answer("the agent to react");
      const l = await lane();
      showLane(l);
      const order = (await records()).find((r) => r.kind === "order");
      say(
        `notification: ${order?.priority} · ${order?.status} · ${order?.summary}`,
      );
      check(
        order?.priority === "medium" &&
          order.status === "delivered" &&
          /#1042/.test(order.summary),
        'medium "Order #1042 placed" notification, delivered',
      );
      check(
        l[l.length - 1]?.mode === "delta" &&
          /status: ordered/.test(l[l.length - 1].text),
        "a delta: status ordered",
      );
      check(/1042/.test(a), "the agent confirms order #1042");
    },
    "Enter once the agent has said it",
  );

  // 5. Pack → low: held as a pending inbox record, no run. Its quiet <notification-summary> lands in the thread now.
  await step(
    "store events: click Pack",
    "low priority: held in the inbox, it won't interrupt. Nothing wakes the agent; a quiet summary marker waits for its next turn",
    async () => {
      if (AUTO) await post("/demo/shop/pack");
      await sleep(2500);
      const packed = (await records()).find((r) => r.kind === "packed");
      const summaries = (await signalsOfType("notification")).filter(
        (m: any) => sigOf(m).tagName === "notification-summary",
      );
      say(
        `notification: ${packed?.priority} · ${packed?.status} · ${packed?.summary}; summary markers: ${summaries.length}`,
      );
      check(
        packed?.priority === "low" && packed.status === "pending",
        'low "packed" notification, held (pending in the inbox)',
      );
      check(
        summaries.length === 1,
        "one <notification-summary> marker on the thread",
      );
      check(
        w.real.length === runsSeen,
        "no run: low priority does not wake the agent",
      );
    },
    "Enter when clicked",
  );

  // 6. Ship → medium wakes the agent; on that turn it sees the summary, checks the inbox and mentions "packed" too.
  await step(
    "store events: click Ship",
    "medium: delivered at once and wakes the agent. On this turn it sees the waiting summary, checks notificationInbox itself and mentions the packing too",
    async () => {
      if (AUTO) await post("/demo/shop/ship");
      const a = await answer("the agent to react");
      const ship = (await records()).find((r) => r.kind === "shipped");
      const packed = (await records()).find((r) => r.kind === "packed");
      say(
        `notification: ${ship?.priority} · ${ship?.status} · ${ship?.summary}; packed is now ${packed?.status}`,
      );
      check(
        ship?.priority === "medium" && ship.status !== "pending",
        'medium "shipped" notification, delivered (it woke the agent)',
      );
      check(
        lastRun(w)?.tools.includes("notificationInbox") ?? false,
        "the agent checked notificationInbox without being asked",
      );
      check(
        /ship/i.test(a) && /pack/i.test(a),
        'the agent says it shipped and mentions the held "packed" update',
      );
    },
    "Enter once the agent has said it",
  );

  // 7. Delay → high, wakes.
  await step(
    'store events: click "Delay delivery"',
    "high priority: the agent wakes and tells you",
    async () => {
      if (AUTO) await post("/demo/shop/delay");
      const a = await answer("the agent to react");
      const delay = (await records()).find((r) => r.kind === "shipping-delay");
      say(
        `notification: ${delay?.priority} · ${delay?.status} · ${delay?.summary}`,
      );
      check(
        delay?.priority === "high" && delay.status !== "pending",
        'high "delivery delayed" notification, delivered',
      );
      check(/delay/i.test(a), "the agent tells you the delivery is delayed");
    },
    "Enter once the agent has said it",
  );

  // 8. The first snapshot has scrolled out of the shopper's 15-message window → a fresh snapshot.
  await step(
    'ask: "What did I order?"',
    "the shopper loads only its last 15 messages; the first <shop> snapshot is now outside them, so a full snapshot comes back",
    async () => {
      const a = await ask("What did I order?");
      const l = await lane();
      showLane(l);
      const s = l[l.length - 1];
      const deltasBefore = l
        .slice(0, -1)
        .filter((x: { mode: string }) => x.mode === "delta").length;
      check(
        s?.mode === "snapshot" &&
          l.filter((x: { mode: string }) => x.mode === "snapshot").length ===
            2 &&
          deltasBefore === 3,
        "a fresh <shop> snapshot (after 1 snapshot and 3 deltas)",
      );
      check(
        JSON.stringify(s?.value.items) === JSON.stringify(await cartNow()) &&
          s?.value.status === "ordered",
        "it is the whole current cart (sale price) and status ordered",
      );
      check(
        mentions(a, Object.keys(await cartNow())),
        "the agent lists the order",
      );
    },
    live,
  );
}

async function demo3() {
  // Home assistant. Split screen: the home dashboard on the left (Tyler clicks lights, mode and device events),
  // the home agent's Studio thread on the right. State: a StateLane processor (<home> snapshot, then <home-update>
  // deltas). Notifications: devices. Tools: the agent changes the house itself and the dashboard shows it live.
  const { thread, w } = await begin(
    "home",
    "Demo 3: the home assistant (state + notifications + tools)",
    { url: (t) => `${base}/demo/house?thread=${t}`, setupOnly: true },
  );
  const post = (path: string, body: object = {}) =>
    api(path, { threadId: thread, ...body });
  // Arm the house lane after the greeting, so the first <home> snapshot comes with the first real question.
  await post("/demo/home/arm");
  if (!AUTO) {
    console.log(`\n${c.bold("Ready.")} ${base}/demo/house?thread=${thread}\n`);
    [
      'Ask "What\'s the house like?"                                       <home> snapshot',
      'Click Bedroom light on, Kitchen light off → ask "What changed?"     one <home-update> delta',
      'Ask "Make it cozy for a movie."                                     tool calls; the dashboard changes; a delta confirms',
      "Device events: Doorbell (then hands off, ~1 min)                   medium: cameras → porch light → camera → lock back door → alarm",
      "                                                                   → Brightguard calls (urgent) → agent answers on the phone → police dispatched",
      "                                                                   → officer at the door (high) → camera → intercom briefing → alarm silenced",
      "Device events: Smoke alarm                                         urgent: all lights on, front door unlocked, unprompted",
    ].forEach((l, i) => console.log(c.cyan(`  ${i + 1}. `) + l));
    return;
  }
  const msgs = async () =>
    (
      await api(
        `/api/memory/threads/${thread}/messages?agentId=home&resourceId=home&perPage=300`,
      )
    ).messages ?? [];
  const sigOf = (m: any) => m.content?.metadata?.signal;
  const lane = async () =>
    (await msgs())
      .filter(
        (m: any) =>
          sigOf(m)?.type === "state" && sigOf(m).metadata?.state?.id === "home",
      )
      .map((m: any) => ({
        mode: sigOf(m).metadata.state.mode as string,
        text: (m.content.parts ?? []).map((p: any) => p.text ?? "").join(""),
      }));
  const showLane = (l: Awaited<ReturnType<typeof lane>>) =>
    l.length &&
    say(
      `<${l[l.length - 1].mode === "snapshot" ? "home" : "home-update"}> ${l[l.length - 1].text.replace(/\n/g, " | ")}`,
    );
  const houseNow = async () =>
    (await post("/demo/home/view")).house as {
      lights: Record<string, number>;
      thermostat: number;
      locks: Record<string, boolean>;
      mode: string;
      views: any[];
      intercom: any[];
      alarm: boolean;
      scene: string;
      phone: { ringing: boolean; lines: any[] };
    };
  let runsSeen = w.real.length;
  const answer = async (what = "the answer") => {
    await w.waitFor(what, () => w.real.length > runsSeen, 60_000);
    await w.idle("answer finished");
    runsSeen = w.real.length;
    const r = lastRun(w);
    say(
      `home: ${(r?.text ?? "").replace(/\n/g, " ").slice(0, 240)}${r?.tools.length ? c.dim(`  [tools: ${r.tools.join(", ")}]`) : ""}`,
    );
    return { text: r?.text ?? "", tools: r?.tools ?? [] };
  };
  const ask = async (q: string) => {
    await send("home", thread, q);
    return answer();
  };
  const live = "Enter once the answer is in";

  await step(
    'ask: "What\'s the house like?"',
    "the house lane has nothing in the window yet, so it sends a <home> snapshot",
    async () => {
      const a = await ask("What's the house like?");
      const l = await lane();
      showLane(l);
      check(l.length === 1 && l[0].mode === "snapshot", "one <home> snapshot");
      check(
        /back door/i.test(a.text) || /living/i.test(a.text),
        "the agent describes the house from it",
      );
    },
    live,
  );

  await step(
    'click Bedroom light (on) and Kitchen light (off), then ask: "What changed?"',
    "one <home-update> delta with both lights",
    async () => {
      if (AUTO) {
        await post("/demo/home/light", { room: "Bedroom" });
        await post("/demo/home/light", { room: "Kitchen" });
      }
      const a = await ask("What changed?");
      const l = await lane();
      showLane(l);
      const d = l[l.length - 1];
      check(
        l.length === 2 &&
          d.mode === "delta" &&
          /Bedroom light: off → on 100%/.test(d.text) &&
          /Kitchen light: on 100% → off/.test(d.text),
        "one delta: Bedroom on, Kitchen off",
      );
      check(
        /bedroom/i.test(a.text) && /kitchen/i.test(a.text),
        "the agent names both changes",
      );
    },
    live,
  );

  await step(
    'ask: "Make it cozy for a movie."',
    "the agent calls its tools; the dashboard changes live; the next step gets a <home-update> delta confirming it",
    async () => {
      const before = await houseNow();
      const n = (await lane()).length;
      const a = await ask("Make it cozy for a movie.");
      const after = await houseNow();
      const l = await lane();
      showLane(l);
      check(
        a.tools.some((t) => t === "setLights" || t === "setThermostat"),
        "the agent used setLights/setThermostat",
      );
      check(
        JSON.stringify(after.lights) !== JSON.stringify(before.lights) ||
          after.thermostat !== before.thermostat,
        "the house changed (the dashboard shows it)",
      );
      check(
        l.length > n && l[l.length - 1].mode === "delta",
        "a <home-update> delta confirms the change",
      );
    },
    live,
  );

  await step(
    "device events: click Doorbell, then hands off",
    "one click starts it: front camera (too dark) → porch light → front camera (masked person heading round the back) → locks the back door → alarm. Brightguard calls (urgent), the agent answers with phone, police are dispatched, and the officer arrives (high): front camera → intercom → alarm silenced",
    async () => {
      const t0 = Date.now();
      if (AUTO) await post("/demo/home/doorbell");
      await answer("the agent to investigate");
      let h: any;
      const until = Date.now() + 110_000;
      while (Date.now() < until) {
        h = await houseNow();
        if (h.scene === "police" && h.alarm === false) break;
        await sleep(1000);
      }
      await w.idle("scene settled", 1500);
      runsSeen = w.real.length;
      h = await houseNow();
      const secs = Math.round((Date.now() - t0) / 1000);
      say(
        `phone: ${h.phone.lines.map((x: any) => `${x.who}: ${x.text.slice(0, 60)}`).join(" | ")}`,
      );
      say(
        `intercom: ${h.intercom.map((x: any) => `${x.camera}: "${x.message.slice(0, 70)}"`).join(" | ")}`,
      );
      say(`whole scene: ${secs}s`);
      const views = [...h.views].reverse();
      say(
        `cameras: ${views.map((v: any) => `${v.camera}: ${v.text.split(":").slice(1).join(":").trim().slice(0, 40)}`).join(" → ")}`,
      );
      const dark = views.findIndex((v: any) => /too dark/.test(v.text)),
        lit = views.findIndex((v: any) => /porch lit/.test(v.text));
      check(
        views[0]?.camera === "front-door" &&
          dark === 0 &&
          lit > dark &&
          h.lights.Porch > 0,
        "front camera too dark → porch light on → front camera again (masked person)",
      );
      check(
        h.locks["Back door"] === true &&
          views.some((v: any) => v.camera === "back-door"),
        "it locked the back door and checked the back camera",
      );
      check(
        h.phone.lines.length > 0,
        "it sounded the alarm (Brightguard called)",
      );
      const agentLine =
        h.phone.lines.find((x: any) => x.who === "agent")?.text ?? "";
      check(
        /mask|hood/i.test(agentLine) && /lock/i.test(agentLine),
        "it answered Brightguard with phone: masked person, back door now locked",
      );
      check(
        h.phone.lines.some((x: any) => /dispatched/.test(x.text)) &&
          h.phone.lines.findIndex((x: any) => x.who === "agent") <
            h.phone.lines.findIndex((x: any) => /dispatched/.test(x.text)),
        "Brightguard replied after the agent spoke: police dispatched",
      );
      check(
        /officer/.test(h.views[0]?.text ?? ""),
        "it confirmed the officer on the front camera",
      );
      check(
        h.intercom.some(
          (x: any) => x.camera === "front-door" && /mask|back/i.test(x.message),
        ),
        "it briefed the officer on the front-door intercom",
      );
      check(
        h.alarm === false && h.locks["Front door"] === true,
        "alarm silenced; front door still locked",
      );
      check(secs <= 130, `the whole scene took ${secs}s (about 2 min or less)`);
    },
    "Enter once the officer has been briefed",
  );

  await step(
    "device events: click Smoke alarm",
    "urgent: the agent turns every light on, unlocks the front door and tells you, unprompted",
    async () => {
      if (AUTO) await post("/demo/home/smoke");
      const a = await answer("the agent to react");
      const h = await houseNow();
      check(
        Object.values(h.lights).every((p) => p === 100),
        "every light is on at 100%",
      );
      check(h.locks["Front door"] === false, "the front door is unlocked");
      check(
        /smoke|fire|leave|get out/i.test(a.text),
        "the agent tells you to get out",
      );
    },
    "Enter once the agent has acted",
  );
}

async function demo4() {
  console.log(
    c.bold("\nDemo 4: builder and reviewer, coordinated by signals") +
      c.dim(AUTO ? "  (auto: no pauses)" : "  (press Enter at each cue)"),
  );
  await ensureServer();
  const dir = path.join(process.cwd(), "peer-workspace");
  mkdirSync(dir, { recursive: true });
  for (const f of ["parse-duration.ts", "countdown.html"])
    rmSync(path.join(dir, f), { force: true });
  const bt = await newThread("builder", "Demo 4: builder");
  const rt = await newThread("reviewer", "Demo 4: reviewer");
  const bw = new Watcher("builder", bt);
  const rw = new Watcher("reviewer", rt);
  await bw.start();
  await rw.start();
  onCleanup(() => bw.stop());
  onCleanup(() => rw.stop());
  // The work item both agents see as a state signal, keyed to these two threads.
  await api("/demo/pair", { builderThread: bt, reviewerThread: rt });
  // One page, two Studio iframes (same origin as Studio): builder thread left, reviewer thread right.
  openStudio(
    "builder",
    bt,
    `${base}/demo/split?builder=${encodeURIComponent(bt)}&reviewer=${encodeURIComponent(rt)}`,
  );

  await step(
    "'hi, builder' and 'hi, reviewer': create both threads",
    "each pane shows a reply and the <work-item> snapshot",
    async () => {
      await Promise.all([
        send("builder", bt, "hi, builder"),
        send("reviewer", rt, "hi, reviewer"),
      ]);
      await Promise.all([bw.idle("builder reply"), rw.idle("reviewer reply")]);
      check(
        bw.sawText(/work-item/) && rw.sawText(/work-item/),
        "both agents got the <work-item> snapshot (status: todo)",
      );
    },
  );

  await step(
    "one prompt to the builder",
    "parseDuration + a countdown page; everything after this is signals",
    async () => {
      await send(
        "builder",
        bt,
        "Build parseDuration('1h30m') in parse-duration.ts: returns seconds. Then build countdown.html, a single self-contained page that counts down from 1h30m (inline the function). Keep it minimal, then submit it for review.",
      );
      const started = Date.now();
      let last = "";
      const deadline = started + 8 * 60_000; // safety timeout
      for (;;) {
        const w = await api("/demo/work", {});
        const status = w.history[w.history.length - 1];
        if (status !== last) {
          last = status;
          say(
            `${((Date.now() - started) / 1000).toFixed(0).padStart(3)}s  work item: ${status}   (builder runs ${bw.real.length}, reviewer runs ${rw.real.length})`,
          );
        }
        if (status === "approved") break;
        if (Date.now() > deadline)
          throw new Error(
            `timed out after 8 min with the work item at: ${status}`,
          );
        await sleep(1500);
      }
      await Promise.all([
        bw.idle("builder idle", 4000, 120_000),
        rw.idle("reviewer idle", 4000, 120_000),
      ]);
      const w = await api("/demo/work", {});
      const h: string[] = w.history;
      check(
        JSON.stringify(h) ===
          JSON.stringify([
            "todo",
            "in review",
            "changes requested",
            "in review",
            "approved",
          ]),
        `status path: ${h.join(" → ")}`,
      );
      check(
        rw.real.length >= 3,
        `the reviewer ran ${rw.real.length} times: its hi, then ${rw.real.length - 1} reviews it was woken for by notifications, never prompted`,
      );
      check(
        bw.real.length >= 3,
        `the builder ran ${bw.real.length} times: build, fix after the change request, and the approval`,
      );
      const files = existsSync(dir) ? readdirSync(dir) : [];
      check(
        files.includes("parse-duration.ts") && files.includes("countdown.html"),
        `workspace: ${files.join(", ")}`,
      );
    },
  );
}

const demos: Record<string, () => Promise<void>> = {
  demo1,
  demo2,
  demo3,
  demo4,
};
if (!demos[demo]) {
  console.error(
    "usage: tsx scripts/demo.ts demo1|demo2|demo3|demo4 [--auto] [--no-open]",
  );
  process.exit(2);
}
void args;
try {
  await demos[demo]!();
  const bad = checks.filter(([ok]) => !ok);
  if (checks.length)
    console.log(
      `\n${bad.length ? c.red(`✗ ${bad.length} check(s) failed`) : c.green(`✓ ${checks.length} checks passed`)}. Server left running; Studio shows the thread.`,
    );
  await leave(bad.length ? 1 : 0);
} catch (e) {
  console.error(c.red(`\n✗ ${(e as Error).message}`));
  await leave(1);
}
