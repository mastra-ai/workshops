import type { Processor, ProcessInputArgs, ProcessInputResult } from '@mastra/core/processors';

type PreFilterMetadata = {
  matched: string[];
  filterType: 'pii' | 'profanity';
};

/**
 * First line of defense — regex only, no LLM call.
 * Catches obvious PII and profanity in microseconds.
 */
export class RegexPreFilter implements Processor<'regex-pre-filter', PreFilterMetadata> {
  readonly id = 'regex-pre-filter' as const;
  readonly name = 'Regex Pre-Filter';
  readonly description = 'Fast regex-based PII and profanity detection — no LLM needed';

  private piiPatterns: Record<string, RegExp> = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/,
    creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/,
  };

  private profanityPattern = /\b(damn|hell|shit|fuck|ass)\b/i;

  async processInput({ messages, abort }: ProcessInputArgs<PreFilterMetadata>): Promise<ProcessInputResult> {
    for (const message of messages) {
      if (message.role !== 'user') continue;
      const text = JSON.stringify(message.content);

      // Check PII
      const piiMatches: string[] = [];
      for (const [type, pattern] of Object.entries(this.piiPatterns)) {
        if (pattern.test(text)) piiMatches.push(type);
      }
      if (piiMatches.length > 0) {
        abort('Please remove personal information before sending your message.', {
          metadata: { matched: piiMatches, filterType: 'pii' },
        });
      }

      // Check profanity
      if (this.profanityPattern.test(text)) {
        abort('Please keep messages professional.', {
          metadata: { matched: ['profanity'], filterType: 'profanity' },
        });
      }
    }

    return messages;
  }
}
