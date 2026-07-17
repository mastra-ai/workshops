import { Agent } from "@mastra/core/agent";
import { Harness } from "@mastra/core/harness";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { MastraTUI } from "mastracode/tui";

const storage = new LibSQLStore({
    id: "workshop-store",
    url: "file:./mastra.db",
});

// A single backing agent forked by each mode. Build mode does the work; plan
// mode reasons before acting.
const agent = new Agent({
    id: "assistant",
    name: "Assistant",
    instructions: `You are a coding assistant. Delegate factual lookups to the
"researcher" subagent and creative writing to the "poet" subagent.`,
    model: "anthropic/claude-haiku-4-5",
});

const harness = new Harness({
    id: "workshop-harness",
    storage,
    agent,
    memory: new Memory({
        options: {
            observationalMemory: true,
        },
        storage,
    }),
    modes: [
        { id: "build", name: "Build", default: true },
        { id: "plan", name: "Plan" },
    ],
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

// Bring up shared resources and mint the single session the TUI drives.
await harness.init();
const session = await harness.createSession();

const tui = new MastraTUI({
    harness,
    session,
    appName: "MastraCode Workshop",
    verbose: true,
});

await tui.run();
