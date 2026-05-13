import type { MastraDBMessage } from '@mastra/core/agent';
import type { Processor, ProcessOutputResultArgs } from '@mastra/core/processors';

export class SupportResponseFooter implements Processor<'support-response-footer'> {
  readonly id = 'support-response-footer' as const;
  readonly name = 'Support Response Footer';
  readonly description = 'Adds a consistent audit footer to final support responses';

  async processOutputResult({ messages }: ProcessOutputResultArgs): Promise<MastraDBMessage[]> {
    const lastAssistantIdx = messages.map((message) => message.role).lastIndexOf('assistant');
    if (lastAssistantIdx === -1) return messages;

    const updated = [...messages];
    const message = { ...updated[lastAssistantIdx] };
    const content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);

    (message as any).content = `${content}\n\n---\nSupport audit: policy checked, risky side effects require workflow approval.`;
    updated[lastAssistantIdx] = message;

    return updated;
  }
}
