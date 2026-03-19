import { Agent } from "@mastra/core/agent";
import { Mastra } from "@mastra/core/mastra";
import { Harness } from "@mastra/core/harness";
import { ModelRouterLanguageModel } from "@mastra/core/llm";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { MastraTUI } from "mastracode/tui";

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
  memory: new Memory({ storage }),
  resolveModel: (modelId) => new ModelRouterLanguageModel(modelId as any),
  omConfig: {
    defaultObservationThreshold: 40_000,
    defaultReflectionThreshold: 40_000,
  },
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

const tui = new MastraTUI({
  harness,
  appName: "Basic Harness TUI",
  verbose: true,
});

await tui.run();
