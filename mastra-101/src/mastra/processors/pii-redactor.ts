import type { Processor, ProcessInputArgs, ProcessInputResult } from '@mastra/core/processors';

type PIIRedactorMetadata = {
  redactedTypes: string[];
};

const patterns: Record<string, RegExp> = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
};

export class PIIRedactor implements Processor<'pii-redactor', PIIRedactorMetadata> {
  readonly id = 'pii-redactor' as const;
  readonly name = 'PII Redactor';
  readonly description = 'Redacts common PII before user messages enter the model loop';

  async processInput({ messages }: ProcessInputArgs<PIIRedactorMetadata>): Promise<ProcessInputResult> {
    const redactedTypes = new Set<string>();

    return messages.map((message) => {
      const contentValue = (message as any).content;
      if (message.role !== 'user' || typeof contentValue !== 'string') {
        return message;
      }

      let content = contentValue;
      for (const [type, pattern] of Object.entries(patterns)) {
        pattern.lastIndex = 0;
        if (pattern.test(content)) {
          redactedTypes.add(type);
          pattern.lastIndex = 0;
          content = content.replace(pattern, `[REDACTED_${type.toUpperCase()}]`);
        }
      }

      return { ...message, content } as unknown as typeof message;
    });
  }
}
