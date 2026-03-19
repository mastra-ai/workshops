import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { ModelRouter } from '../processors/model-router';
import { ToolDependencyEnforcer } from '../processors/tool-dependency-enforcer';
import { TaskDriftMonitor } from '../processors/task-drift-monitor';
import { CostTracker } from '../processors/cost-tracker';
import { ResponseEnricher } from '../processors/response-enricher';

// Mock tools for TechMart support
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
  description: 'Create a new order (requires search_products and check_inventory first)',
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
  description: 'Process a refund for an order (requires lookup_order first)',
  inputSchema: z.object({ orderId: z.string(), reason: z.string() }),
  execute: async () => ({ refundId: 'REF-789', amount: '$599.00' }),
});

export const smartAgent = new Agent({
  id: 'smart-agent',
  name: 'smart-agent',
  instructions: `You are a TechMart customer support agent. Help customers search products,
check inventory, place orders, look up orders, and process refunds.
Be thorough — always search and check inventory before creating orders.`,
  model: 'openai/gpt-5.2',
  tools: { searchProducts, checkInventory, createOrder, lookupOrder, processRefund },

  inputProcessors: [new ModelRouter(), new ToolDependencyEnforcer()],
  outputProcessors: [new TaskDriftMonitor(), new CostTracker(), new ResponseEnricher()],

  maxProcessorRetries: 2,
});
