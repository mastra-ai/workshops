import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { policyDocuments } from '../data';

const resultSchema = z.object({
  id: z.string(),
  title: z.string(),
  score: z.number(),
  content: z.string(),
});

export const searchPolicyKnowledgeBase = createTool({
  id: 'search_policy_knowledge_base',
  description:
    'Search the support policy knowledge base. Use this before answering policy, return, shipping, or refund questions.',
  inputSchema: z.object({
    query: z.string(),
    tags: z.array(z.string()).default([]),
    topK: z.number().int().min(1).max(5).default(3),
  }),
  outputSchema: z.object({
    query: z.string(),
    results: z.array(resultSchema),
  }),
  execute: async ({ query, tags, topK }) => {
    const terms = tokenize(query);
    const requestedTags = new Set((tags ?? []).map((tag) => tag.toLowerCase()));

    const results = policyDocuments
      .map((doc) => {
        const haystack = tokenize(`${doc.title} ${doc.tags.join(' ')} ${doc.content}`);
        const termScore = terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
        const tagScore = doc.tags.reduce((score, tag) => score + (requestedTags.has(tag.toLowerCase()) ? 2 : 0), 0);
        return {
          id: doc.id,
          title: doc.title,
          score: termScore + tagScore,
          content: doc.content,
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK ?? 3);

    return { query, results };
  },
});

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}
