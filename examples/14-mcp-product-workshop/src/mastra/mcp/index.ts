import { MCPServer } from '@mastra/mcp';
import { identitySchema, orderIdSchema, DomainError } from '../../domain/schemas.js';
import { readPublicPolicy } from '../../domain/public-policy.js';
import { returnsService } from '../../domain/service.js';
import { getOrder, checkReturnEligibility } from '../tools/reads.js';
import { createReturn, returnRiskScore } from '../tools/mutations.js';
import { processReturn } from '../tools/process-return.js';

export const capabilities = {
  version: '1.0.0',
  tools: { getOrder, checkReturnEligibility, createReturn, processReturn, returnRiskScore },
  resources: {
    listResources: async ({ extra }: Parameters<NonNullable<ConstructorParameters<typeof MCPServer>[0]['resources']>['listResources']>[0]) => {
      const identity = identitySchema.safeParse(extra.authInfo?.extra?.user);
      const orders = identity.success ? returnsService.listOrders(identity.data) : [];
      return [
        { uri: 'returns://policies/current', name: 'Current returns policy', mimeType: 'application/json' },
        ...orders.map(order => ({ uri: `returns://orders/${order.id}`, name: `Order ${order.id}`, mimeType: 'application/json' })),
      ];
    },
    resourceTemplates: async () => [{ uriTemplate: 'returns://orders/{orderId}', name: 'Authorized order state', mimeType: 'application/json' }],
    getResourceContent: async ({ uri, extra }: Parameters<NonNullable<ConstructorParameters<typeof MCPServer>[0]['resources']>['getResourceContent']>[0]) => {
      if (uri === 'returns://policies/current') return { text: JSON.stringify(readPublicPolicy()) };
      const match = /^returns:\/\/orders\/(ORD-\d{3})$/.exec(uri);
      if (!match) throw new DomainError('INVALID_INPUT', 'Unknown resource.');
      const identity = identitySchema.safeParse(extra.authInfo?.extra?.user);
      if (!identity.success) throw new DomainError('UNAUTHORIZED', 'Authentication required.');
      return { text: JSON.stringify(returnsService.getOrder(identity.data, orderIdSchema.parse(match[1]))) };
    },
  },
  prompts: {
    listPrompts: async () => [{ name: 'draft-customer-reply', description: 'Draft a reply from an authorized order lookup. Does not send messages or create returns.' }],
    getPromptMessages: async () => [{ role: 'user' as const, content: { type: 'text' as const, text: 'Look up the authorized order and eligibility first, then draft a concise customer reply. Never claim a refund was created unless createReturn succeeded.' } }],
  },
  // Resource reads keep the conservative zero TTL because orders are mutable.
  cacheHints: { 'resources/templates/list': { ttlMs: 60_000, cacheScope: 'public' as const } },
};
export const returnsModern = new MCPServer({ ...capabilities, id: 'returns-modern', name: 'Returns Desk' });
