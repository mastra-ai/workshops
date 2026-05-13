# Mastra 101 Masterclass Example

This is the code follow-along for the `Mastra 101 Masterclass` slide deck.

The example uses the same support/refund scenario described in the presentation:

- One customer support agent
- Typed tools for orders, refund drafts, tickets, and policy search
- Mock RAG over policy documents
- Memory for conversation state and working memory
- Optional semantic recall when `OPENAI_API_KEY` is present
- A refund workflow where the model drafts and the workflow decides
- Runtime authority through `requesterRole`, `autoRefundLimitCents`, and `approvedBy`
- Processors for PII redaction and response audit metadata
- Scorers for support completeness and policy grounding
- Storage and observability for Studio traces
- A policy-reviewer specialist agent for the multi-agent discussion

## Run

```bash
pnpm install
pnpm dev
```

Open Mastra Studio at:

```text
http://localhost:4111
```

The server starts without an API key so you can inspect the app in Studio. Model calls require the provider credentials for
the selected models. If `OPENAI_API_KEY` is set, the example also enables semantic recall with a LibSQL vector store and
`openai/text-embedding-3-small`.

## Try These In Studio

### Agent: `supportAgent`

Ask:

```text
Customer asks: I want a refund for ORD-2400 because the dock disconnects every few minutes.
```

Expected behavior:

- The agent should look up the order.
- It should search the policy knowledge base.
- It may create a refund draft.
- It should not claim the refund was submitted.
- It should explain that approval is required because the amount is over $100 and the customer has a prior refund.

Ask:

```text
My email is person@example.com and my card is 4242 4242 4242 4242. Can you refund ORD-1001?
```

Expected behavior:

- The PII redactor masks the email and card before the model sees the message.
- The agent can still handle the order/refund request.

### Workflow: `refundWorkflow`

Low-risk refund:

```json
{
  "orderId": "ORD-1001",
  "requestedAmountCents": 7900,
  "reason": "Customer reports intermittent audio failure after delivery.",
  "ticketId": "TCK-2001",
  "requesterRole": "support-rep",
  "autoRefundLimitCents": 10000
}
```

Expected status: `submitted`.

High-risk refund without approval:

```json
{
  "orderId": "ORD-2400",
  "requestedAmountCents": 24000,
  "reason": "Customer reports the laptop dock disconnects from displays.",
  "ticketId": "TCK-2400",
  "requesterRole": "contractor",
  "autoRefundLimitCents": 10000
}
```

Expected status: `waiting-on-approval`.

High-risk refund with approval:

```json
{
  "orderId": "ORD-2400",
  "requestedAmountCents": 24000,
  "reason": "Customer reports the laptop dock disconnects from displays.",
  "ticketId": "TCK-2400",
  "requesterRole": "contractor",
  "autoRefundLimitCents": 10000,
  "approvedBy": "manager:jordan"
}
```

Expected status: `submitted`.

## Slide Mapping

| Slides | Code |
|---|---|
| Project anatomy | `src/mastra/index.ts` |
| Agents | `src/mastra/agents/support-agent.ts` |
| Tools | `src/mastra/tools/order-tools.ts` |
| RAG | `src/mastra/tools/policy-tools.ts`, `src/mastra/data.ts` |
| Memory | `supportAgent` memory configuration |
| Workflows | `src/mastra/workflows/refund-workflow.ts` |
| Runtime context / authority | `refundWorkflow` input fields |
| Processors | `src/mastra/processors/*` |
| Scorers / evals | `src/mastra/scorers/support-scorer.ts` |
| Multi-agent systems | `src/mastra/agents/policy-reviewer.ts` |
| Observability / storage | `src/mastra/index.ts` |

## MCP Extension Point

This example keeps all tools local so the workshop runs without external services. To demonstrate MCP, replace or augment
`searchPolicyKnowledgeBase` with an `MCPClient` tool list, then wrap high-risk tools in narrow Mastra tools before exposing
them to the agent.
