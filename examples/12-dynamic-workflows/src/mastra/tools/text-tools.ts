import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// All text tools share the same `{ text }` shape so dynamic workflows can
// chain, branch, and parallelize them without extra mapping steps.

export const wordStatsTool = createTool({
  id: 'word-stats',
  description: 'Count words and characters in a text, passing the text through',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ text: z.string(), words: z.number(), chars: z.number() }),
  execute: async ({ text }) => ({
    text,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    chars: text.length,
  }),
});

export const shoutTextTool = createTool({
  id: 'shout-text',
  description: 'Uppercase a text and add emphasis',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ text: z.string() }),
  execute: async ({ text }) => ({ text: `${text.toUpperCase()}!!!` }),
});

export const whisperTextTool = createTool({
  id: 'whisper-text',
  description: 'Lowercase a text and wrap it in a whisper',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ text: z.string() }),
  execute: async ({ text }) => ({ text: `(whispers) ${text.toLowerCase()}` }),
});

export const reverseTextTool = createTool({
  id: 'reverse-text',
  description: 'Reverse a text',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ text: z.string() }),
  execute: async ({ text }) => ({ text: [...text].reverse().join('') }),
});
