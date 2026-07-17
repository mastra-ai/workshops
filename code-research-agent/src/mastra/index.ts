import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { createExecuteCommandTool } from '../tools/execute-command';
import { createViewTool } from '../tools/file-view';

const storage = new LibSQLStore({
  id: "libsql",
  url: 'file:memory.db',
});

const memory = new Memory({
  storage,
  options: {
    observationalMemory: true,
  },
});

const codeResearchAgent = new Agent({
  id: "code",
  name: 'code-research-agent',
  instructions: `You are a code research agent. You explore codebases, read files, run commands, and help users understand how code works.

You have two tools:
- "view": Read file contents (with line numbers) or list directory contents. Use this to explore code.
- "execute_command": Run shell commands like grep, find, git log, etc.

When researching code:
1. Start by listing the directory structure
2. Read key files to understand the architecture
3. Use grep to find specific patterns
4. Summarize your findings clearly

Do NOT call "read" — always use "view".`,
  model: 'cerebras/zai-glm-4.7',
  memory,
  tools: {
    execute_command: createExecuteCommandTool(),
    view: createViewTool(),
  },
  defaultOptions: {
    maxSteps: 50,
  },
});

export const mastra = new Mastra({
  agents: { 'code-research-agent': codeResearchAgent },
});
