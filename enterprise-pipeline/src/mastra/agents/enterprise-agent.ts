import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { MAX_STEPS } from '../constants';
import { inputPipeline } from '../processors/input-pipeline';
import { outputPipeline } from '../processors/output-pipeline';
import { ModelRouter } from '../processors/model-router';
import { ToolDependencyEnforcer } from '../processors/tool-dependency-enforcer';
import { WrapUpEnforcer } from '../processors/wrap-up-enforcer';
import { OrderConfirmation } from '../processors/order-confirmation';
import { EscalationDetector } from '../processors/escalation-detector';

const searchProducts = createTool({
  id: 'search_products',
  description: 'Search the TechMart product catalog',
  inputSchema: z.object({ query: z.string() }),
  execute: async () => ({ results: [`Laptop Pro 15" - $1299`, `Tablet Air - $599`] }),
});

const checkInventory = createTool({
  id: 'check_inventory',
  description: 'Check if a product is in stock',
  inputSchema: z.object({ productId: z.string() }),
  execute: async () => ({ inStock: true, quantity: 42 }),
});

const createOrder = createTool({
  id: 'create_order',
  description: 'Create a new order',
  inputSchema: z.object({ productId: z.string(), quantity: z.number() }),
  execute: async () => ({ orderId: 'ORD-12345', status: 'confirmed' }),
});

const lookupOrder = createTool({
  id: 'lookup_order',
  description: 'Look up an existing order',
  inputSchema: z.object({ orderId: z.string() }),
  execute: async () => ({ orderId: 'ORD-12345', status: 'shipped' }),
});

const processRefund = createTool({
  id: 'process_refund',
  description: 'Process a refund for an order',
  inputSchema: z.object({ orderId: z.string(), reason: z.string() }),
  execute: async () => ({ refundId: 'REF-789', amount: '$599.00' }),
});

export const enterpriseAgent = new Agent({
  id: 'enterprise-agent',
  name: 'enterprise-agent',
  instructions: `You are a TechMart enterprise support agent. Help customers search products,
check inventory, place orders, look up orders, and process refunds.
Be thorough and follow company policy: always search and verify inventory before creating orders.`,
  model: 'openai/gpt-5.2',
  maxSteps: MAX_STEPS,
  tools: { searchProducts, checkInventory, createOrder, lookupOrder, processRefund },

  // Input: layered defense (regex → parallel LLM checks) + per-step intelligence
  inputProcessors: [inputPipeline, new ModelRouter(), new ToolDependencyEnforcer(), new WrapUpEnforcer()],

  // Output: conditional drift monitoring + post-completion side effects
  outputProcessors: [outputPipeline, new OrderConfirmation(), new EscalationDetector()],

  maxProcessorRetries: 3,
});
