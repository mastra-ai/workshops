import type { Processor, ProcessOutputResultArgs, ProcessorMessageResult } from '@mastra/core/processors';

/**
 * Post-completion side effect: detects if an order was created
 * during the conversation and fires a confirmation webhook.
 *
 * Pure logic — no LLM needed.
 */
export class OrderConfirmation implements Processor<'order-confirmation'> {
  readonly id = 'order-confirmation' as const;
  readonly name = 'Order Confirmation';
  readonly description = 'Sends order confirmation when create_order tool was used';

  async processOutputResult({ messages }: ProcessOutputResultArgs) {
    // Scan for create_order tool results in the conversation
    const orderResults: Array<{ orderId: string; productId: string; quantity: number }> = [];

    for (const msg of messages) {
      if (msg.role !== 'assistant') continue;

      for (const part of msg.content.parts) {
        if (part.type === 'tool-invocation' && part.toolInvocation.toolName === 'create_order') {
          orderResults.push({
            orderId: part.toolInvocation.args.orderId,
            productId: part.toolInvocation.args.productId,
            quantity: part.toolInvocation.args.quantity,
          });
        }
      }
    }

    if (orderResults.length > 0) {
      // In production: fire webhook, send email, push to queue
      console.log(`[OrderConfirmation] ${orderResults.length} order(s) placed:`);
      for (const order of orderResults) {
        console.log(`  → Order ${order.orderId} (${order.quantity}x ${order.productId})`);
      }
    }

    return messages;
  }
}
