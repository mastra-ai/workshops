import type { Processor, ProcessOutputResultArgs } from '@mastra/core/processors';
import type { MastraDBMessage } from '@mastra/core/agent';

export class ResponseEnricher implements Processor<'response-enricher'> {
  readonly id = 'response-enricher' as const;
  readonly name = 'Response Enricher';
  readonly description = 'Appends a disclaimer to the final response';

  async processOutputResult({ messages }: ProcessOutputResultArgs): Promise<MastraDBMessage[]> {
    const disclaimer = '\n\n---\n*This response is for informational purposes only. For warranty claims, please contact support@techmart.com.*';

    // Find the last assistant message and append the disclaimer
    const lastAssistantIdx = messages.map(m => m.role).lastIndexOf('assistant');
    if (lastAssistantIdx === -1) return messages;

    const updated = [...messages];
    const msg = { ...updated[lastAssistantIdx] };
    const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
    msg.content = content + disclaimer;
    updated[lastAssistantIdx] = msg;

    return updated;
  }
}
