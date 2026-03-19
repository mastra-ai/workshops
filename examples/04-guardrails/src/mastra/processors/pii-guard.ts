import type { Processor, ProcessInputArgs, ProcessInputResult } from '@mastra/core/processors';

type PIIGuardMetadata = {
  detectedTypes: string[];
  severity: 'high' | 'critical';
};

export class PIIGuard implements Processor<'pii-guard', PIIGuardMetadata> {
  readonly id = 'pii-guard' as const;
  readonly name = 'PII Guard';
  readonly description = 'Detects PII using regex patterns — zero latency, no LLM needed';

  private patterns: Record<string, RegExp> = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/,
    creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/,
  };

  async processInput({ messages, abort }: ProcessInputArgs<PIIGuardMetadata>): Promise<ProcessInputResult> {
    const detectedTypes: string[] = [];

    for (const message of messages) {
      if (message.role !== 'user') continue;
      const text = JSON.stringify(message.content);

      for (const [type, pattern] of Object.entries(this.patterns)) {
        if (pattern.test(text)) {
          detectedTypes.push(type);
        }
      }
    }

    if (detectedTypes.length > 0) {
      const severity = detectedTypes.includes('ssn') || detectedTypes.includes('creditCard') ? 'critical' : 'high';

      abort('Please remove personal information before sending your message.', {
        metadata: { detectedTypes, severity },
      });
    }

    return messages;
  }
}
