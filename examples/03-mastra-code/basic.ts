import { Agent } from "@mastra/core/agent";
import { Mastra } from "@mastra/core/mastra";
import { Harness } from "@mastra/core/harness";
import { ModelRouterLanguageModel } from "@mastra/core/llm";
import { Memory } from '@mastra/memory';
import { LibSQLStore } from "@mastra/libsql";

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
Always delegate to the appropriate subagent rather than answering directly.`,
    model: "openai/gpt-4o-mini",
});

const mastra = new Mastra({
    agents: { orchestrator: agent },
    storage,
});

const harness = new Harness({
    id: "basic-harness",
    modes: [{ id: "chat", name: "Chat", default: true, agent: mastra.getAgent("orchestrator") }],
    storage,
    memory: new Memory({
        options: {
            observationalMemory: true,
        },
        storage,
    }),
    resolveModel: (modelId) => new ModelRouterLanguageModel(modelId as any),
    subagents: [
        {
            id: "researcher",
            name: "Researcher",
            description: "Looks up factual information and provides well-sourced answers.",
            instructions:
                "You are a research assistant. Provide accurate, factual information with clear explanations. Be concise but thorough.",
            defaultModelId: "openai/gpt-4o-mini",
        },
        {
            id: "poet",
            name: "Poet",
            description: "Creates creative writing like poems, haikus, and short stories.",
            instructions:
                "You are a creative poet. Write vivid, evocative poetry and creative prose. Match the requested style.",
            defaultModelId: "openai/gpt-4o-mini",
        },
    ],
});

harness.subscribe((event) => {
    switch (event.type) {
        case "agent_start":
            console.log("\n--- Agent started ---");
            break;
        case "tool_start":
            console.log(`\n  [tool] ${event.toolName} called`);
            break;
        case "tool_end":
            console.log(`  [tool] finished ${event.isError ? "(error)" : "(ok)"}`);
            break;
        case "subagent_start":
            console.log(`\n  >> Subagent [${event.agentType}] spawned`);
            console.log(`     task: "${event.task}"`);
            console.log(`     model: ${event.modelId}`);
            break;
        case "subagent_end":
            console.log(`  << Subagent [${event.agentType}] done (${event.durationMs}ms)`);
            console.log(`     result: ${event.result.slice(0, 120)}${event.result.length > 120 ? "…" : ""}`);
            break;
        case "message_end": {
            const text = event.message.content
                .filter((c): c is Extract<typeof c, { type: "text" }> => c.type === "text")
                .map((c) => c.text)
                .join("");
            if (text) {
                console.log(`\nassistant: ${text}`);
            }
            break;
        }
        case "usage_update":
            if (event.usage.totalTokens > 0) {
                console.log(
                    `\n--- Tokens: ${event.usage.promptTokens} in + ${event.usage.completionTokens} out = ${event.usage.totalTokens} total ---`,
                );
            }
            break;
        case "error":
            console.error(`\n[ERROR] ${event.error.message}`);
            break;
        case "agent_end":
            console.log(`\n--- Agent finished (${event.reason ?? "complete"}) ---`);
            break;
    }
});

await harness.init();
await harness.selectOrCreateThread();
harness.grantSessionTool("subagent");

const prompt = "First, research what a pangolin is. Then write a short haiku about pangolins.";
console.log(`user: ${prompt}`);
await harness.sendMessage(prompt);
