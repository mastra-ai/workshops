// Demo 3: a home assistant. The dashboard (left) and the `home` agent (right) share one per-thread house.
// - State: the house goes to the agent through a StateLane processor (<home> snapshot, then <home-update> deltas).
// - Notifications: devices notify the agent (doorbell medium, smoke urgent).
// - Cameras: viewCamera describes what a camera sees, from the house state and the doorbell scene.
// - Tools: the agent changes the house itself (setLights, setThermostat, lockDoor, unlockDoor); the dashboard polls and shows it.
import { Agent } from "@mastra/core/agent";
import { registerApiRoute } from "@mastra/core/server";
import { createTool } from "@mastra/core/tools";
import { Memory } from "@mastra/memory";
import { z } from "zod";
import { StateLane } from "./state-lane";

// ---- pacing: every timing in demo3, by beat. HOME_PACE scales them all (1 = stage pace, 0.2 = fast rehearsal). ----
const PACE = Number(process.env.HOME_PACE ?? 1);
const ms = (n: number) => Math.round(n * PACE);
const TIMING = {
  toolDefault: ms(1000), // every home tool waits this before it acts and returns, unless listed below
  toolPhone: ms(3000), // the agent speaking to Brightguard
  toolIntercom: ms(2500), // the agent speaking on an intercom
  handleTriedAfterLock: ms(3000), // back door locked → its smart lock reports the handle being tried
  callAfterAlarm: ms(4500), // soundAlarm → Brightguard calls
  dispatchAfterPhone: ms(5000), // the agent answers → "police dispatched"
  officerAfterDispatch: ms(7000), // "police dispatched" → the officer is at the front door
};

export const rooms = [
  "Living room",
  "Kitchen",
  "Bedroom",
  "Porch",
  "Back yard",
] as const;
export const cameras = ["front-door", "back-door"] as const;
export const doors = ["Front door", "Back door"] as const;
type Room = (typeof rooms)[number];
type Door = (typeof doors)[number];
export type House = {
  lights: Record<Room, number>; // 0 = off, else brightness %
  thermostat: number;
  locks: Record<Door, boolean>;
  mode: "home" | "away";
  activity: { at: number; by: "you" | "agent" | "device"; text: string }[];
  views: { at: number; camera: (typeof cameras)[number]; text: string }[];
  scene: "none" | "doorbell" | "police";
  lockTried?: boolean;
  backTried?: boolean;
  alarm: boolean;
  phone: {
    ringing: boolean;
    lines: { who: "Brightguard" | "agent"; text: string }[];
  };
  monitoring?: string;
  intercom: { at: number; camera: (typeof cameras)[number]; message: string }[];
};

const fresh = (): House => ({
  lights: {
    "Living room": 60,
    Kitchen: 100,
    Bedroom: 0,
    Porch: 0,
    "Back yard": 0,
  },
  thermostat: 20,
  locks: { "Front door": true, "Back door": false },
  mode: "home",
  activity: [],
  views: [],
  scene: "none",
  alarm: false,
  phone: { ringing: false, lines: [] },
  intercom: [],
});

// The lane only knows a thread once the demo arms it (after the seed "hi"), so the first <home> snapshot
// arrives with the first real question, not with the greeting.
const lane = new StateLane("home", { snapshot: "home", delta: "home-update" });
const houses = new Map<string, House>();
const light = (pct: number) => (pct ? `on ${pct}%` : "off");

function sync(threadId: string) {
  const h = houses.get(threadId)!;
  for (const r of rooms) lane.set(threadId, `${r} light`, light(h.lights[r]));
  lane.set(threadId, "Thermostat", `${h.thermostat}°C`);
  for (const d of doors)
    lane.set(threadId, d, h.locks[d] ? "locked" : "unlocked");
  lane.set(threadId, "Mode", h.mode);
}
export const house = {
  get: (threadId: string) => houses.get(threadId) ?? fresh(),
  arm(threadId: string) {
    if (!houses.has(threadId)) houses.set(threadId, fresh());
    sync(threadId);
    return houses.get(threadId)!;
  },
  edit(
    threadId: string,
    by: House["activity"][number]["by"],
    text: string,
    fn: (h: House) => void,
  ) {
    const h = house.arm(threadId);
    fn(h);
    h.activity.unshift({ at: Date.now(), by, text });
    h.activity.length = Math.min(h.activity.length, 8);
    sync(threadId);
    return h;
  },
};

// One timeline per thread for the scripted scene: each step is scheduled by the one before, so they arrive in order.
const timers = new Map<string, ReturnType<typeof setTimeout>[]>();
function later(
  threadId: string,
  ms: number,
  _what: string,
  fn: () => Promise<void>,
) {
  const t = setTimeout(() => void fn().catch(() => {}), ms);
  timers.set(threadId, [...(timers.get(threadId) ?? []), t]);
}
function cancelLater(threadId: string) {
  for (const t of timers.get(threadId) ?? []) clearTimeout(t);
  timers.delete(threadId);
}

const threadOf = (context: any) => {
  const t = context?.agent?.threadId;
  if (!t) throw new Error("no thread");
  return t as string;
};
const setLights = createTool({
  id: "setLights",
  description: "Set a room light (or all rooms). brightness 0 turns it off.",
  inputSchema: z.object({
    room: z.enum([...rooms, "all"]),
    brightness: z.number().min(0).max(100),
  }),
  execute: async ({ room, brightness }, context) => {
    const targets = room === "all" ? [...rooms] : [room];
    house.edit(
      threadOf(context),
      "agent",
      `${room === "all" ? "All lights" : `${room} light`} → ${light(brightness)}`,
      (h) => {
        for (const r of targets) h.lights[r] = brightness;
      },
    );
    return { ok: true, room, brightness };
  },
});
const setThermostat = createTool({
  id: "setThermostat",
  description: "Set the thermostat in °C.",
  inputSchema: z.object({ celsius: z.number().min(10).max(30) }),
  execute: async ({ celsius }, context) => {
    house.edit(threadOf(context), "agent", `Thermostat → ${celsius}°C`, (h) => {
      h.thermostat = celsius;
    });
    return { ok: true, celsius };
  },
});
const doorTool = (locked: boolean) =>
  createTool({
    id: locked ? "lockDoor" : "unlockDoor",
    description: `${locked ? "Lock" : "Unlock"} a door.`,
    inputSchema: z.object({ door: z.enum(doors) }),
    execute: async ({ door }, context) => {
      const t = threadOf(context);
      house.edit(
        t,
        "agent",
        `${door} → ${locked ? "locked" : "unlocked"}`,
        (h) => {
          h.locks[door] = locked;
        },
      );
      // Doorbell scene: the person reaches the back door just after it is locked; the smart lock reports the attempt.
      const h = house.get(t);
      if (
        locked &&
        door === "Back door" &&
        h.scene === "doorbell" &&
        !h.lockTried
      ) {
        h.lockTried = true;
        later(t, TIMING.handleTriedAfterLock, "handle", async () => {
          house.edit(t, "device", "Back door lock: handle tried", (hh) => {
            hh.backTried = true;
          });
          await deviceNotify(t, {
            kind: "lock",
            priority: "urgent",
            summary:
              "Back door smart lock: someone just tried the handle (the door is locked).",
          });
        });
      }
      return { ok: true, door, locked };
    },
  });

// What a camera sees. Outside the doorbell scene the cameras show an empty porch/yard. In the scene the porch is
// dark until the Porch light is on; once lit, the person is walking round to the back, where they try the handle.
function look(h: House, camera: (typeof cameras)[number]) {
  if (h.scene === "police")
    return camera === "front-door"
      ? "front-door camera: a uniformed police officer is standing at the front door."
      : "back-door camera: the yard is empty.";
  if (h.scene !== "doorbell")
    return camera === "front-door"
      ? "front-door camera: the porch is empty."
      : "back-door camera: the yard is empty.";
  if (camera === "front-door")
    return h.lights.Porch
      ? "front-door camera, porch lit: a person in a hoodie wearing a mask, walking away along the side of the house toward the back."
      : "front-door camera: dark porch; a silhouette of a person by the door, too dark to make out.";
  return h.locks["Back door"] && h.backTried
    ? "back-door camera: the masked person tries the back door handle, finds it locked, and is still in the yard looking at the windows."
    : h.locks["Back door"]
      ? "back-door camera: the masked person is coming round the side of the house toward the back door."
      : "back-door camera: the masked person is coming round the side of the house toward the back door, which is unlocked.";
}
const viewCamera = createTool({
  id: "viewCamera",
  description:
    "Look through a camera and get a description of what it sees right now.",
  inputSchema: z.object({ camera: z.enum(cameras) }),
  execute: async ({ camera }, context) => {
    const t = threadOf(context);
    const text = look(house.get(t), camera);
    house.edit(t, "agent", `viewed ${camera} camera`, (h) => {
      h.views.unshift({ at: Date.now(), camera, text });
    });
    return { camera, sees: text };
  },
});

const soundAlarm = createTool({
  id: "soundAlarm",
  description: "Sound the house alarm (siren and flashing lights).",
  inputSchema: z.object({}),
  execute: async (_i, context) => {
    const t = threadOf(context);
    house.edit(t, "agent", "🚨 alarm sounding", (h) => {
      h.alarm = true;
      h.monitoring = "Brightguard Security: alarm received, calling the house…";
    });
    // The monitoring company calls back a few seconds later.
    later(t, TIMING.callAfterAlarm, "call", async () => {
      house.edit(t, "device", "📞 Brightguard Security calling", (h) => {
        h.phone.ringing = true;
        h.phone.lines.push({
          who: "Brightguard",
          text: "Alarm triggered at 14 Elm St. Is this a real emergency?",
        });
      });
      await deviceNotify(t, {
        kind: "call",
        priority: "urgent",
        summary:
          "Incoming call: Brightguard Security: 'Alarm triggered at 14 Elm St. Is this a real emergency?' Answer with the phone tool.",
      });
    });
    return { ok: true, alarm: "on" };
  },
});
const phone = createTool({
  id: "phone",
  description: "Speak on the current phone call.",
  inputSchema: z.object({ message: z.string() }),
  execute: async ({ message }, context) => {
    const t = threadOf(context);
    const firstAnswer = !house
      .get(t)
      .phone.lines.some((l) => l.who === "agent");
    house.edit(t, "agent", `📞 on the phone: "${message}"`, (h) => {
      h.phone.ringing = false;
      h.phone.lines.push({ who: "agent", text: message });
    });
    if (!firstAnswer)
      return {
        ok: true,
        note: "Brightguard has already dispatched the police.",
      };
    // Brightguard replies, then (after a short wait) the officer is at the front door.
    later(t, TIMING.dispatchAfterPhone, "dispatch", async () => {
      house.edit(t, "device", "📞 Brightguard: police dispatched", (h) => {
        h.phone.lines.push({
          who: "Brightguard",
          text: "Police dispatched, ETA 2 minutes. Stay inside.",
        });
        h.monitoring = "Brightguard: police dispatched, ETA 2 min";
      });
      await deviceNotify(t, {
        kind: "call",
        priority: "urgent",
        summary:
          "Brightguard: 'Police dispatched, ETA 2 minutes. Stay inside.'",
      });
      later(t, TIMING.officerAfterDispatch, "officer", async () => {
        house.edit(t, "device", "🚓 someone at the front door", (h) => {
          h.scene = "police";
          h.monitoring = "Brightguard: officer on site";
        });
        await deviceNotify(t, {
          kind: "front-door",
          priority: "high",
          summary: "Front-door camera: a uniformed officer at the front door.",
        });
      });
    });
    return { ok: true };
  },
});
const silenceAlarm = createTool({
  id: "silenceAlarm",
  description: "Silence the house alarm.",
  inputSchema: z.object({}),
  execute: async (_i, context) => (
    house.edit(threadOf(context), "agent", "alarm silenced", (h) => {
      h.alarm = false;
    }),
    { ok: true, alarm: "off" }
  ),
});
const speakIntercom = createTool({
  id: "speakIntercom",
  description: "Speak through the intercom speaker at a camera.",
  inputSchema: z.object({ camera: z.enum(cameras), message: z.string() }),
  execute: async ({ camera, message }, context) => (
    house.edit(
      threadOf(context),
      "agent",
      `🔊 ${camera} intercom: "${message}"`,
      (h) => {
        h.intercom.unshift({ at: Date.now(), camera, message });
      },
    ),
    { ok: true }
  ),
});

// Every home tool waits before it acts and returns (TIMING above), so the audience can follow each step.
const toolDelay: Record<string, number> = {
  phone: TIMING.toolPhone,
  speakIntercom: TIMING.toolIntercom,
};
function paced<T extends Record<string, any>>(tools: T): T {
  for (const [name, t] of Object.entries(tools)) {
    const run = t.execute;
    const wait = toolDelay[name] ?? TIMING.toolDefault;
    t.execute = async (...args: any[]) => (
      await new Promise((r) => setTimeout(r, wait)),
      run(...args)
    );
  }
  return tools;
}

export const home = new Agent({
  id: "home",
  name: "Home",
  instructions: [
    "You are a concise home assistant. Answer in at most 3 short sentences.",
    "<home> is the current state of the house; each later <home-update> lists what changed since. The newest wins. Answer only from them.",
    "Change the house only with your tools (setLights, setThermostat, lockDoor, unlockDoor). After using them, say briefly what you changed.",
    "<notification> messages come from devices. Act on them without waiting to be asked:",
    "Be proactive: when a device notifies you, investigate with your cameras (viewCamera) before reporting. If a camera image is too dark, you may turn on nearby lights and look again. Secure the house (lock doors) if someone suspicious is around, then tell the user what you saw and did.",
    "If someone suspicious tries a door or a window, sound the alarm (soundAlarm); you may also warn them on the intercom. Answer calls from the security company with the phone tool: a short factual account of what you saw and did. When someone comes to the door, confirm with the front-door camera first; if it is the police, tell the officer on the front-door intercom what you saw, then silence the alarm. Never unlock a door for anyone, police included, unless the user asks.",
    "- Doorbell: never unlock anything.",
    "- Smoke alarm: at once turn all lights on to 100%, unlock the Front door so people can get out, and tell the user to leave and call emergency services.",
  ].join("\n"),
  model: process.env.MODEL ?? "deepseek/deepseek-chat",
  memory: new Memory(),
  tools: paced({
    viewCamera,
    soundAlarm,
    silenceAlarm,
    phone,
    speakIntercom,
    setLights,
    setThermostat,
    lockDoor: doorTool(true),
    unlockDoor: doorTool(false),
  }),
  inputProcessors: [lane],
  defaultOptions: { maxSteps: 20 }, // the doorbell scene is ~8 tool calls in one run
});

// A device event: record it on the dashboard, then notify the agent's thread. Medium/high/urgent on an idle
// thread wake a run; whoever gets `wake` owns its stream, so drain it here and let Studio follow the thread.
async function deviceNotify(
  threadId: string,
  n: {
    kind: string;
    priority: "low" | "medium" | "high" | "urgent";
    summary: string;
  },
) {
  house.edit(threadId, "device", `${n.summary} (${n.priority})`, () => {});
  const res = await home.sendNotificationSignal(
    { source: "home", ...n },
    { resourceId: "home", threadId },
  );
  void res.accepted
    ?.then((a) => {
      if (a.action === "wake") void a.output?.consumeStream?.();
    })
    .catch(() => {});
  const what =
    res.decision.action === "deliver"
      ? "delivered now, wakes the agent"
      : res.decision.action;
  return {
    priority: n.priority,
    decision: res.decision.action,
    status: res.record.status,
    log: `→ ${n.priority}: ${what}`,
  };
}

const post = (path: string, handle: (body: any) => Promise<unknown>) =>
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

const view = (t: string) => ({ house: house.get(t), armed: houses.has(t) });
export const homeRoutes = [
  post("/demo/home/view", async (b) => view(b.threadId)),
  post(
    "/demo/home/arm",
    async (b) => (house.arm(b.threadId), view(b.threadId)),
  ),
  post("/demo/home/light", async (b) => {
    const room = b.room as Room;
    house.edit(
      b.threadId,
      "you",
      `${room} light → ${light(house.get(b.threadId).lights[room] ? 0 : 100)}`,
      (h) => {
        h.lights[room] = h.lights[room] ? 0 : 100;
      },
    );
    return view(b.threadId);
  }),
  post("/demo/home/thermostat", async (b) => {
    house.edit(
      b.threadId,
      "you",
      `Thermostat → ${house.get(b.threadId).thermostat + Number(b.by)}°C`,
      (h) => {
        h.thermostat += Number(b.by);
      },
    );
    return view(b.threadId);
  }),
  post("/demo/home/lock", async (b) => {
    const door = b.door as Door;
    house.edit(
      b.threadId,
      "you",
      `${door} → ${house.get(b.threadId).locks[door] ? "unlocked" : "locked"}`,
      (h) => {
        h.locks[door] = !h.locks[door];
      },
    );
    return view(b.threadId);
  }),
  post("/demo/home/mode", async (b) => {
    const mode = b.mode === "away" ? "away" : "home";
    house.edit(b.threadId, "you", `Mode → ${mode}`, (h) => {
      h.mode = mode;
    });
    return view(b.threadId);
  }),
  // The doorbell starts the scene: someone at a dark front door who then heads for the (unlocked) back door.
  post("/demo/home/doorbell", async (b) => {
    const h = house.arm(b.threadId);
    h.scene = "doorbell";
    h.lockTried = false;
    h.backTried = false;
    h.alarm = false;
    h.monitoring = undefined;
    h.phone = { ringing: false, lines: [] };
    h.intercom = [];
    cancelLater(b.threadId);
    h.lights.Porch = 0;
    h.lights["Back yard"] = 0;
    h.locks["Back door"] = false;
    return {
      ...view(b.threadId),
      notification: await deviceNotify(b.threadId, {
        kind: "doorbell",
        priority: "medium",
        summary: "Doorbell: someone rang at the front door.",
      }),
    };
  }),
  post(
    "/demo/home/smoke",
    async (b) => (
      cancelLater(b.threadId),
      (house.arm(b.threadId).scene = "none"),
      {
        ...view(b.threadId),
        notification: await deviceNotify(b.threadId, {
          kind: "smoke",
          priority: "urgent",
          summary: "Smoke alarm: smoke detected in the kitchen.",
        }),
      }
    ),
  ),
];
