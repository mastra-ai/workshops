import { Agent } from "@mastra/core/agent";
import { Harness } from "@mastra/core/harness";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { logEvent } from "./log-events.js";

const storage = new LibSQLStore({
    id: "basic-store",
    url: "file:./mastra.db",
});

const agent = new Agent({
    id: "orchestrator",
    name: "Orchestrator",
    instructions: `You are an orchestrator agent. You have access to specialized subagents.
Use the "researcher" subagent to look up factual information.
Use the "poet" subagent to create creative writing.

Rules:
- Delegate each part of the task to the appropriate subagent exactly once.
- A subagent's result is final. Never call the same subagent twice for the same piece of work, and never call it again to "improve" or "retry" a result you already have.
- As soon as you have the results you need, write the final answer directly to the user and stop. Do not delegate again after that.`,
    model: "anthropic/claude-sonnet-4-5",
    // Hard guardrail: cap the orchestrator loop so a runaway delegation loop
    // can't spin forever. A normal task is research -> poet -> answer.
    defaultOptions: { maxSteps: 6 },
});

const harness = new Harness({
    id: "basic-harness",
    agent,
    modes: [{ id: "chat", name: "Chat", default: true }],
    storage,
    memory: new Memory({
        options: {
            observationalMemory: true,
        },
    }),
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

// Bring up shared storage/workspace once, then mint a session. All thread
// I/O, mode/model selection, event subscription, and messaging now live on
// the Session — the Harness only manufactures sessions.
await harness.init();
const session = await harness.createSession();

// Start a fresh thread each run so the demo always works from scratch
// instead of resuming the persisted conversation (and answering from memory).
await session.thread.create();

session.subscribe(logEvent);

// Permission grants are session-scoped now — let the orchestrator spawn subagents.
session.grantTool("subagent");

const prompt = "First, research what a pangolin is. Then write a short haiku about pangolins.";
console.log(`user: ${prompt}`);
await session.sendMessage({ content: prompt });
