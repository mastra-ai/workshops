import { Agent, MastraDBMessage } from '@mastra/core/agent';
import type { Processor, ProcessOutputResultArgs, ProcessorMessageResult } from '@mastra/core/processors';
import { z } from 'zod';

/**
 * Post-completion side effect: evaluates if the conversation
 * needs human escalation (unresolved issues, negative sentiment).
 *
 * Uses a cheap nano model for fast classification.
 */
export class EscalationDetector implements Processor<'escalation-detector'> {
  readonly id = 'escalation-detector' as const;
  readonly name = 'Escalation Detector';
  readonly description = 'Flags conversations that need human review';

  private evaluator = new Agent({
    id: 'escalation-evaluator',
    name: 'escalation-evaluator',
    model: 'openai/gpt-5-nano',
    instructions: `You evaluate customer support conversations.
Determine if the conversation needs human escalation based on:
- Unresolved customer issues
- Failed tool calls or errors
- Customer expressing frustration or dissatisfaction
- Requests the agent couldn't fulfill
- Refund or complaint scenarios`,
  });

  async processOutputResult({ messages }: ProcessOutputResultArgs) {
    // Build a summary of the conversation for evaluation
    const conversationSummary = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => {
        const text =
          typeof m.content === 'string'
            ? m.content
            : Array.isArray(m.content?.parts)
              ? m.content.parts
                  .filter((p) => p.type === 'text')
                  .map((p) => p.text)
                  .join(' ')
              : '';
        return `${m.role}: ${text}`;
      })
      .join('\n');

    if (!conversationSummary.trim()) return messages;

    const { object: evaluation } = await this.evaluator.generate(conversationSummary, {
      structuredOutput: {
        schema: z.object({
          needsEscalation: z.boolean(),
          reason: z.string(),
          priority: z.enum(['low', 'medium', 'high', 'critical']),
        }),
      },
    });

    if (evaluation.needsEscalation) {
      // In production: create ticket, notify team, update CRM
      console.log(`[EscalationDetector] 🚨 Escalation needed (${evaluation.priority}):`);
      console.log(`  Reason: ${evaluation.reason}`);
    }

    return messages;
  }
}
