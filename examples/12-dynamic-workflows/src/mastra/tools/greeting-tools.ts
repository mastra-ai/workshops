import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const greetingTool = createTool({
  id: 'create-greeting',
  description: 'Create a greeting for a name',
  inputSchema: z.object({ name: z.string() }),
  outputSchema: z.object({ message: z.string() }),
  execute: async ({ name }) => ({ message: `Hello, ${name}!` }),
});

export const shoutTool = createTool({
  id: 'shout',
  description: 'Uppercase a message',
  inputSchema: z.object({ message: z.string() }),
  outputSchema: z.object({ message: z.string() }),
  execute: async ({ message }) => ({ message: `${message.toUpperCase()}!!!` }),
});
