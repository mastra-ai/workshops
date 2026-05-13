export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'refunded';

export type Order = {
  orderId: string;
  customerId: string;
  customerEmail: string;
  item: string;
  amountCents: number;
  status: OrderStatus;
  deliveredDaysAgo: number;
  priorRefunds: number;
};

export type RefundDraft = {
  draftId: string;
  orderId: string;
  amountCents: number;
  reason: string;
  risk: 'low' | 'medium' | 'high';
  requiresApproval: boolean;
  policyNotes: string[];
};

export type RefundRecord = RefundDraft & {
  refundId: string;
  approvedBy: string;
  status: 'submitted';
};

export type Ticket = {
  ticketId: string;
  orderId: string;
  status: 'open' | 'waiting-on-approval' | 'resolved';
  note: string;
};

export type PolicyDocument = {
  id: string;
  title: string;
  tags: string[];
  content: string;
};

export const orders = new Map<string, Order>([
  [
    'ORD-1001',
    {
      orderId: 'ORD-1001',
      customerId: 'CUS-42',
      customerEmail: 'maya.chen@example.com',
      item: 'NoiseCancel Pro Headphones',
      amountCents: 12900,
      status: 'delivered',
      deliveredDaysAgo: 9,
      priorRefunds: 0,
    },
  ],
  [
    'ORD-2400',
    {
      orderId: 'ORD-2400',
      customerId: 'CUS-77',
      customerEmail: 'sam.rivera@example.com',
      item: 'Laptop Dock Ultra',
      amountCents: 24000,
      status: 'delivered',
      deliveredDaysAgo: 18,
      priorRefunds: 1,
    },
  ],
  [
    'ORD-9009',
    {
      orderId: 'ORD-9009',
      customerId: 'CUS-18',
      customerEmail: 'lee.patel@example.com',
      item: 'Tablet Air Keyboard',
      amountCents: 7900,
      status: 'shipped',
      deliveredDaysAgo: 0,
      priorRefunds: 0,
    },
  ],
]);

export const tickets = new Map<string, Ticket>();
export const refundDrafts = new Map<string, RefundDraft>();
export const refunds = new Map<string, RefundRecord>();

export const policyDocuments: PolicyDocument[] = [
  {
    id: 'POL-RETURNS-30',
    title: 'Standard return window',
    tags: ['returns', 'refunds', 'eligibility'],
    content:
      'Most delivered items are eligible for refund within 30 days. Items must be associated with a delivered order and a clear customer reason.',
  },
  {
    id: 'POL-REFUND-APPROVAL',
    title: 'Refund approval thresholds',
    tags: ['refunds', 'approval', 'risk'],
    content:
      'Refunds over $100, customers with prior refunds, and ambiguous policy cases require manager approval before submission.',
  },
  {
    id: 'POL-SHIPPING',
    title: 'Shipping status handling',
    tags: ['shipping', 'orders'],
    content:
      'Orders that have shipped but not been delivered should receive tracking support, not refunds, unless a supervisor approves an exception.',
  },
  {
    id: 'POL-TONE',
    title: 'Support tone and escalation',
    tags: ['support', 'tone', 'escalation'],
    content:
      'Support responses should be concise, empathetic, and concrete. Escalate when a requested action requires approval or falls outside policy.',
  },
];

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
