import { Agent } from "@mastra/core/agent";
import { Harness } from "@mastra/core/harness";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import { logEvent } from "./log-events.js";

const storage = new LibSQLStore({
    id: "mc-store",
    url: "file:./mastra.db",
});

// A filesystem MCP server scoped to this project gives the agent read access
// to the working directory through MCP-provided tools.
const mcp = new MCPClient({
    servers: {
        filesystem: {
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-filesystem", process.cwd()],
        },
    },
});

// Flatten the connected MCP tools into a single tools object the Harness can
// hand to every mode agent.
const mcpTools = await mcp.listTools();

const agent = new Agent({
    id: "assistant",
    name: "Assistant",
    instructions: `You are a helpful assistant with filesystem access via MCP tools.
Use the available tools to read files and answer questions about this project.`,
    model: "anthropic/claude-haiku-4-5",
});

const harness = new Harness({
    id: "mc-harness",
    agent,
    modes: [{ id: "chat", name: "Chat", default: true }],
    storage,
    memory: new Memory({ storage }),
    tools: mcpTools,
});

await harness.init();
const session = await harness.createSession();

session.subscribe(logEvent);

// MCP-provided tools fall in the "read" category; grant it for the session so
// the agent can call them without prompting.
session.grantCategory("read");

console.log("Modes:", harness.listModes().map((m) => m.id).join(", "));
console.log("Current mode:", session.mode.get());
console.log("");

const prompt = "Read the package.json file in this project and summarize what dependencies we're using.";
console.log(`user: ${prompt}`);
await session.sendMessage({ content: prompt });

await mcp.disconnect();
