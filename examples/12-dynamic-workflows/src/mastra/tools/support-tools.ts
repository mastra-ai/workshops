import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Stub "support desk" tools — pure functions, no API keys. They exist so
// dynamic workflows can demo realistic routing without any external service.

const URGENT_KEYWORDS = ['crash', 'data loss', 'down', 'outage', 'urgent', 'broken'];

export const classifyPriorityTool = createTool({
  id: 'classify-priority',
  description: 'Classify a support message as urgent or normal based on keywords',
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ text: z.string(), priority: z.enum(['urgent', 'normal']) }),
  execute: async ({ text }) => ({
    text,
    priority: URGENT_KEYWORDS.some((k) => text.toLowerCase().includes(k))
      ? ('urgent' as const)
      : ('normal' as const),
  }),
});

export const urgentReplyTool = createTool({
  id: 'urgent-reply',
  description: 'Draft an urgent escalation reply for a support message',
  inputSchema: z.object({ text: z.string(), priority: z.string() }),
  outputSchema: z.object({ reply: z.string() }),
  execute: async ({ text }) => ({
    reply: `🚨 ESCALATED: "${text}" — an engineer has been paged and will respond within 15 minutes.`,
  }),
});

export const normalReplyTool = createTool({
  id: 'normal-reply',
  description: 'Draft a standard support reply for a support message',
  inputSchema: z.object({ text: z.string(), priority: z.string() }),
  outputSchema: z.object({ reply: z.string() }),
  execute: async ({ text }) => ({
    reply: `Thanks for reaching out about "${text}". We'll get back to you within one business day.`,
  }),
});

export const countDownTool = createTool({
  id: 'count-down',
  description: 'Decrement a counter by one (loop demo — output shape feeds back into input shape)',
  inputSchema: z.object({ count: z.number() }),
  outputSchema: z.object({ count: z.number() }),
  execute: async ({ count }) => ({ count: count - 1 }),
});
