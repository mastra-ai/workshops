import { Agent } from '@mastra/core/agent';
import type { Processor, ProcessInputArgs, ProcessInputResult } from '@mastra/core/processors';
import { z } from 'zod';

type TopicGuardMetadata = {
  category: string;
  confidence: number;
};

const ALLOWED_TOPICS = [
  'electronics',
  'returns & refunds',
  'shipping',
  'warranties',
  'product recommendations',
  'order status',
  'account management',
];

const classifierAgent = new Agent({
  id: 'topic-classifier',
  name: 'Topic Classifier',
  model: 'openrouter/openai/gpt-oss-safeguard-20b',
  instructions: `Classify whether a user message is on-topic for a TechMart electronics store.
Allowed topics: ${ALLOWED_TOPICS.join(', ')}.
If the message is a greeting or general politeness, consider it on-topic.`,
});

export class TopicGuard implements Processor<'topic-guard', TopicGuardMetadata> {
  readonly id = 'topic-guard' as const;
  readonly name = 'Topic Guard';
  readonly description = 'Blocks off-topic messages using a fast safeguard model';

  async processInput({ messages, abort }: ProcessInputArgs<TopicGuardMetadata>): Promise<ProcessInputResult> {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return messages;

    const result = await classifierAgent.generate(JSON.stringify(lastUserMessage.content), {
      structuredOutput: {
        schema: z.object({
          onTopic: z.boolean(),
          category: z.string(),
          confidence: z.number(),
        }),
      },
    });

    if (!result.object?.onTopic) {
      abort(`This question is outside our support scope. We help with: ${ALLOWED_TOPICS.join(', ')}.`, {
        metadata: {
          category: result.object?.category ?? 'unknown',
          confidence: result.object?.confidence ?? 0,
        },
      });
    }

    return messages;
  }
}
