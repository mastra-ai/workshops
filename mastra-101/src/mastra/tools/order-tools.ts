import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { formatUsd, orders, refundDrafts, refunds, tickets, type RefundDraft } from '../data';

const riskSchema = z.enum(['low', 'medium', 'high']);

export const lookupOrder = createTool({
  id: 'lookup_order',
  description: 'Look up an order by ID. Use this before discussing refunds, shipping status, or ticket updates.',
  inputSchema: z.object({
    orderId: z.string().describe('Order ID, for example ORD-2400'),
  }),
  outputSchema: z.object({
    orderId: z.string(),
    customerId: z.string(),
    customerEmail: z.string(),
    item: z.string(),
    amountCents: z.number(),
    amount: z.string(),
    status: z.string(),
    deliveredDaysAgo: z.number(),
    priorRefunds: z.number(),
  }),
  execute: async ({ orderId }) => {
    const order = orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} was not found`);
    }

    return {
      ...order,
      amount: formatUsd(order.amountCents),
    };
  },
});

export const draftRefund = createTool({
  id: 'draft_refund',
  description:
    'Create a refund draft for review. This does not submit money movement. Use after lookup_order and policy search.',
  inputSchema: z.object({
    orderId: z.string(),
    amountCents: z.number().int().positive(),
    reason: z.string().min(10),
    policyNotes: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({
    draftId: z.string(),
    orderId: z.string(),
    amountCents: z.number(),
    amount: z.string(),
    reason: z.string(),
    risk: riskSchema,
    requiresApproval: z.boolean(),
    policyNotes: z.array(z.string()),
  }),
  execute: async ({ orderId, amountCents, reason, policyNotes }) => {
    const draft = createRefundDraft({ orderId, amountCents, reason, policyNotes });
    refundDrafts.set(draft.draftId, draft);

    return {
      ...draft,
      amount: formatUsd(draft.amountCents),
    };
  },
});

export const updateTicketStatus = createTool({
  id: 'update_ticket_status',
  description: 'Create or update the support ticket status and customer-facing note.',
  inputSchema: z.object({
    ticketId: z.string().default('TCK-1001'),
    orderId: z.string(),
    status: z.enum(['open', 'waiting-on-approval', 'resolved']),
    note: z.string(),
  }),
  outputSchema: z.object({
    ticketId: z.string(),
    orderId: z.string(),
    status: z.string(),
    note: z.string(),
  }),
  execute: async ({ ticketId, orderId, status, note }) => {
    const id = ticketId ?? 'TCK-1001';
    const ticket = { ticketId: id, orderId, status, note };
    tickets.set(id, ticket);
    return ticket;
  },
});

export const submitRefund = createTool({
  id: 'submit_refund',
  description:
    'Submit an already drafted and approved refund. This is intentionally not exposed to the support agent; the workflow owns commit.',
  inputSchema: z.object({
    draftId: z.string(),
    approvedBy: z.string(),
  }),
  outputSchema: z.object({
    refundId: z.string(),
    draftId: z.string(),
    orderId: z.string(),
    amount: z.string(),
    approvedBy: z.string(),
    status: z.literal('submitted'),
  }),
  execute: async ({ draftId, approvedBy }) => {
    const draft = refundDrafts.get(draftId);
    if (!draft) {
      throw new Error(`Refund draft ${draftId} was not found`);
    }

    const refundId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
    refunds.set(refundId, {
      ...draft,
      refundId,
      approvedBy,
      status: 'submitted',
    });

    const order = orders.get(draft.orderId);
    if (order) {
      orders.set(draft.orderId, { ...order, status: 'refunded' });
    }

    return {
      refundId,
      draftId,
      orderId: draft.orderId,
      amount: formatUsd(draft.amountCents),
      approvedBy,
      status: 'submitted' as const,
    };
  },
});

export function createRefundDraft(input: {
  orderId: string;
  amountCents: number;
  reason: string;
  policyNotes?: string[];
}): RefundDraft {
  const order = orders.get(input.orderId);
  if (!order) {
    throw new Error(`Order ${input.orderId} was not found`);
  }

  const risk = classifyRefundRisk({
    amountCents: input.amountCents,
    priorRefunds: order.priorRefunds,
    deliveredDaysAgo: order.deliveredDaysAgo,
    status: order.status,
  });

  return {
    draftId: `DRF-${Math.floor(100000 + Math.random() * 900000)}`,
    orderId: input.orderId,
    amountCents: input.amountCents,
    reason: input.reason,
    risk,
    requiresApproval: risk !== 'low',
    policyNotes: input.policyNotes ?? [],
  };
}

export function classifyRefundRisk(input: {
  amountCents: number;
  priorRefunds: number;
  deliveredDaysAgo: number;
  status: string;
}): 'low' | 'medium' | 'high' {
  if (input.status !== 'delivered') return 'high';
  if (input.amountCents > 10000 && input.priorRefunds > 0) return 'high';
  if (input.amountCents > 10000 || input.priorRefunds > 0 || input.deliveredDaysAgo > 30) return 'medium';
  return 'low';
}
