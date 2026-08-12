import { Mastra } from '@mastra/core/mastra';
import { createTool } from '@mastra/core/tools';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import { z } from 'zod';

// The only code-defined component in this project. Everything else —
// the workflows — is created at runtime over HTTP as JSON.
const greetingTool = createTool({
  id: 'create-greeting',
  description: 'Create a greeting for a name',
  inputSchema: z.object({ name: z.string() }),
  outputSchema: z.object({ message: z.string() }),
  execute: async ({ name }) => ({ message: `Hello, ${name}!` }),
});

const shoutTool = createTool({
  id: 'shout',
  description: 'Uppercase a message',
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({ message: z.string() }),
  execute: async ({ message }) => ({ message: `${message.toUpperCase()}!!!` }),
});

export const mastra = new Mastra({
  tools: { 'create-greeting': greetingTool, shout: shoutTool },
  storage: new LibSQLStore({
    id: 'mastra-storage',
    // Dynamic workflow definitions persist here (workflowDefinitions domain),
    // which is why they survive a server restart.
    url: 'file:./mastra.db',
  }),
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});
