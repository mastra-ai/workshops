import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({
  baseUrl: "http://localhost:4111",
});

const a2aClient = client.getA2A("mastra-release-supervisor-agent");

const x = await a2aClient.getAgentCard();
console.log(x);

const id = "task-1";
const task = await a2aClient.sendMessageStream({
  message: {
    kind: "message",
    role: "user",
    messageId: crypto.randomUUID(),
    parts: [
      {
        kind: "text",
        text: "Please get me the latest mastra release changelog",
      },
    ],
  },
});

let taskId: string | undefined;
let timeoutRef;
function getTaskInfo() {
  timeoutRef = setTimeout(async () => {
    if (!taskId) {
      return getTaskInfo();
    }

    const task = await a2aClient.getTask({
      id: taskId,
    });
    console.log("task info:");
    console.log(task);
  }, 1000);
}

// getTaskInfo();
console.log("start streaming");
for await (const chunk of task) {
  if (chunk.kind === "task") {
    taskId = chunk.id;
  }
  console.log(chunk);
}
console.log("done");
clearTimeout(timeoutRef);
