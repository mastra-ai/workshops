import type { Processor, ProcessOutputStreamArgs } from '@mastra/core/processors';
import type { ChunkType } from '@mastra/core/stream';

const MAX_TOKENS = 4000;

export class CostTracker implements Processor<'cost-tracker'> {
  readonly id = 'cost-tracker' as const;
  readonly name = 'Cost Tracker';
  readonly description = 'Tracks token usage in real-time and emits cost updates via custom stream chunks';

  async processOutputStream({
    part,
    state,
    abort,
    writer,
  }: ProcessOutputStreamArgs): Promise<ChunkType | null | undefined> {
    if (part.type !== 'text-delta') return part;

    // Rough token estimate: 1 token ≈ 4 characters
    const chars = (part.payload?.text || '').length;
    const tokens = Math.ceil(chars / 4);

    state.totalTokens = ((state.totalTokens as number) || 0) + tokens;
    const total = state.totalTokens as number;
    const estimatedCost = total * 0.00001; // ~$10/M tokens

    // Emit a custom cost update every 50 tokens
    if (total % 50 < tokens && writer) {
      await writer.custom({
        type: 'data-cost-update' as const,
        data: { tokens: total, estimatedCost: `$${estimatedCost.toFixed(4)}` },
      });
    }

    // Hard stop if we exceed the budget
    if (total > MAX_TOKENS) {
      abort(`Response exceeded token budget (${MAX_TOKENS} tokens)`);
    }

    return part;
  }
}
