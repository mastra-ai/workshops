import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { formatUsd, orders, policyDocuments, refundDrafts, refunds, tickets } from '../data';
import { createRefundDraft } from '../tools/order-tools';

const roleSchema = z.enum(['support-rep', 'contractor', 'manager']);
const riskSchema = z.enum(['low', 'medium', 'high']);

const refundWorkflowInputSchema = z.object({
  orderId: z.string().describe('Order ID to evaluate'),
  requestedAmountCents: z.number().int().positive(),
  reason: z.string().min(10),
  ticketId: z.string().default('TCK-1001'),
  requesterRole: roleSchema.default('support-rep'),
  autoRefundLimitCents: z.number().int().positive().default(10000),
  approvedBy: z.string().optional(),
});

const contextSchema = refundWorkflowInputSchema.extend({
  order: z.object({
    orderId: z.string(),
    item: z.string(),
    amountCents: z.number(),
    status: z.string(),
    deliveredDaysAgo: z.number(),
    priorRefunds: z.number(),
  }),
  policyNotes: z.array(z.string()),
});

const draftContextSchema = contextSchema.extend({
  draft: z.object({
    draftId: z.string(),
    orderId: z.string(),
    amountCents: z.number(),
    reason: z.string(),
    risk: riskSchema,
    requiresApproval: z.boolean(),
    policyNotes: z.array(z.string()),
  }),
});

const refundWorkflowOutputSchema = z.object({
  status: z.enum(['submitted', 'waiting-on-approval', 'rejected']),
  orderId: z.string(),
  ticketId: z.string(),
  draftId: z.string().optional(),
  refundId: z.string().optional(),
  amount: z.string(),
  risk: riskSchema.optional(),
  requiresApproval: z.boolean(),
  approvedBy: z.string().optional(),
  customerMessage: z.string(),
  policyNotes: z.array(z.string()),
});

const gatherContext = createStep({
  id: 'gather-refund-context',
  description: 'Loads order state and retrieves refund policy notes',
  inputSchema: refundWorkflowInputSchema,
  outputSchema: contextSchema,
  execute: async ({ inputData }) => {
    const order = orders.get(inputData.orderId);
    if (!order) {
      throw new Error(`Order ${inputData.orderId} was not found`);
    }

    const policyNotes = policyDocuments
      .filter((doc) => doc.tags.includes('refunds') || doc.tags.includes('approval'))
      .map((doc) => `${doc.id}: ${doc.content}`);

    return {
      ...inputData,
      order: {
        orderId: order.orderId,
        item: order.item,
        amountCents: order.amountCents,
        status: order.status,
        deliveredDaysAgo: order.deliveredDaysAgo,
        priorRefunds: order.priorRefunds,
      },
      policyNotes,
    };
  },
});

const draftRefundDecision = createStep({
  id: 'draft-refund-decision',
  description: 'Creates a refund draft and records whether approval is required',
  inputSchema: contextSchema,
  outputSchema: draftContextSchema,
  execute: async ({ inputData }) => {
    if (inputData.requestedAmountCents > inputData.order.amountCents) {
      throw new Error('Requested refund cannot exceed the original order amount');
    }

    const draft = createRefundDraft({
      orderId: inputData.orderId,
      amountCents: inputData.requestedAmountCents,
      reason: inputData.reason,
      policyNotes: inputData.policyNotes,
    });

    const requiresApproval =
      draft.requiresApproval ||
      inputData.requestedAmountCents > inputData.autoRefundLimitCents ||
      inputData.requesterRole === 'contractor';

    const finalDraft = { ...draft, requiresApproval };
    refundDrafts.set(finalDraft.draftId, finalDraft);

    return {
      ...inputData,
      draft: finalDraft,
    };
  },
});

const approvalGateAndCommit = createStep({
  id: 'approval-gate-and-commit',
  description: 'Submits low-risk or approved refunds; otherwise leaves the ticket waiting on approval',
  inputSchema: draftContextSchema,
  outputSchema: refundWorkflowOutputSchema,
  execute: async ({ inputData }) => {
    const amount = formatUsd(inputData.draft.amountCents);
    const approvedBy =
      inputData.approvedBy ||
      (inputData.draft.requiresApproval ? undefined : `${inputData.requesterRole}:auto-policy`);

    if (inputData.draft.requiresApproval && !approvedBy) {
      tickets.set(inputData.ticketId, {
        ticketId: inputData.ticketId,
        orderId: inputData.orderId,
        status: 'waiting-on-approval',
        note: `Refund draft ${inputData.draft.draftId} for ${amount} requires manager approval.`,
      });

      return {
        status: 'waiting-on-approval' as const,
        orderId: inputData.orderId,
        ticketId: inputData.ticketId,
        draftId: inputData.draft.draftId,
        amount,
        risk: inputData.draft.risk,
        requiresApproval: true,
        customerMessage:
          `I drafted a ${amount} refund for ${inputData.order.item}. ` +
          'This request needs manager approval before it can be submitted.',
        policyNotes: inputData.policyNotes,
      };
    }

    const refundId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
    refunds.set(refundId, {
      ...inputData.draft,
      refundId,
      approvedBy: approvedBy ?? 'manager',
      status: 'submitted',
    });

    orders.set(inputData.orderId, {
      ...orders.get(inputData.orderId)!,
      status: 'refunded',
    });

    tickets.set(inputData.ticketId, {
      ticketId: inputData.ticketId,
      orderId: inputData.orderId,
      status: 'resolved',
      note: `Refund ${refundId} submitted for ${amount}.`,
    });

    return {
      status: 'submitted' as const,
      orderId: inputData.orderId,
      ticketId: inputData.ticketId,
      draftId: inputData.draft.draftId,
      refundId,
      amount,
      risk: inputData.draft.risk,
      requiresApproval: inputData.draft.requiresApproval,
      approvedBy,
      customerMessage: `Your ${amount} refund for ${inputData.order.item} has been submitted as ${refundId}.`,
      policyNotes: inputData.policyNotes,
    };
  },
});

export const refundWorkflow = createWorkflow({
  id: 'refund-workflow',
  inputSchema: refundWorkflowInputSchema,
  outputSchema: refundWorkflowOutputSchema,
})
  .then(gatherContext)
  .then(draftRefundDecision)
  .then(approvalGateAndCommit);

refundWorkflow.commit();
