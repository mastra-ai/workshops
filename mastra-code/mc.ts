import { createMastraCode } from "mastracode";

const { harness, mcpManager } = createMastraCode();

harness.subscribe((event) => {
    switch (event.type) {
        case "agent_start":
            console.log("\n--- Agent started ---");
            break;
        case "tool_start":
            console.log(`  [tool] ${event.toolName} called`);
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
if (mcpManager) await mcpManager.init();
await harness.selectOrCreateThread();
harness.grantSessionTool("subagent");
harness.grantSessionCategory("read");

console.log("Modes:", harness.getModes().map((m) => m.id).join(", "));
console.log("Current mode:", harness.getCurrentModeId());
console.log("");

const prompt = "Read the package.json file in this project and summarize what dependencies we're using.";
console.log(`user: ${prompt}`);
await harness.sendMessage(prompt);

if (mcpManager) await mcpManager.disconnect();
