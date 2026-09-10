# MCP is so back! Build Tools for the Agents Your Users Already Use

**Daniel Lew and Alex Booker** · 90 minutes, with an optional 30-minute extension.

## Run of show

| Section | Slides | Minutes |
| --- | --- | --- |
| Introduction and MCP concepts | 1–2 | 0–7 |
| Adoption and timeline | 3–4 | 7–14 |
| Embedded agent or MCP? | 5 | 14–22 |
| Short ChatGPT demo | 6 | 22–30 |
| Protocol changes and sessionless requests | 7–8 | 30–43 |
| Why now and best practices | 9–10 | 43–53 |
| Longer demo and questions | 11 | 53–90 |

Keep the diagrams on screen and explain the qualifications aloud. [Sources](docs/sources.md) provide further reading.

## Preparation

Follow the [README](README.md) setup, including its current package requirements. Stop interactive development servers before running the automated checks:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm demo:surfaces
pnpm demo:discover
pnpm demo:workflow
pnpm demo:inspector
pnpm demo:v2
pnpm demo:failures
```

Scripted demos use fresh fixtures and clean up their own listeners. For ChatGPT, configure [WorkOS OAuth and the restricted tunnel](docs/oauth.md). Rehearse sign-in and tool discovery in the presenting account. Keep the server and tunnel running throughout the demo; never tunnel the private Studio origin.

## Short demo: use the assistant you already know

Select Returns Desk in a new ChatGPT conversation:

> Use Returns Desk to look up order ORD-001 and check whether I can return it. Don't create a return yet.

Expected: a $49 order delivered five days ago, eligible under the 30-day policy. Inspect the actual tool calls, not just the conversational answer.

> Check return eligibility for ORD-003 and ORD-004. Don't change anything.

Expected: expired and already returned, respectively.

The customer stays in a familiar assistant; the product supplies facts and business rules. Connecting a custom ChatGPT app requires developer/workspace permissions. MCP compatibility alone does not put a product in an app directory.

**Fallback:** run `pnpm demo:discover` and `pnpm demo:inspector`. Explain that this proves independent-client access, not ChatGPT's tool selection. Resources, prompts and elicitation may have different support in each host.

## Longer demo: why Mastra?

### 1. Existing product → useful tool (7 minutes)

Show `src/domain/service.ts`, then `src/mastra/tools/reads.ts`. REST, CLI and MCP reuse the domain layer. Explain the tool's name, description, input/output schemas and authorization boundary.

Show registration in `src/mastra/mcp/index.ts` and `src/mastra/index.ts`: the same tool instances are available through MCP and Studio, not separate implementations.

### 2. One tool → a workflow (5 minutes)

Open `src/mastra/tools/process-return.ts` and `src/mastra/workflows/returns.ts`:

```text
eligibility → create return → shipping label → instructions
```

The external agent chooses the operation. The workflow controls its business sequence and shipping retries. The wrapper returns a concise completed, pending or rejected result instead of exposing internal workflow details.

### 3. Shipping failure → trace → recovery (10 minutes)

Start a fresh server with deliberate failure injection. For an OAuth-connected ChatGPT demo:

```bash
SHIPPING_FAILURES=3 pnpm serve:oauth
```

Keep the separately started tunnel running. For local Inspector instead, use `SHIPPING_FAILURES=3 pnpm serve` with fixture authentication.

Ask ChatGPT:

> Use processReturn for ORD-001, reason "damaged", and idempotency key "workshop-long-001". If the result is needs_retry, stop and explain what succeeded and what is pending. Don't retry automatically.

Expected: return created, label pending. The carrier failure is simulated. Open the launcher's private Studio address → Traces, select `processReturn`, and inspect the failed `shipping-label` step beneath the workflow. The root tool successfully returned a safe pending result even though the nested workflow failed.

Then ask:

> Retry processReturn with exactly the same order, reason and idempotency key.

Expected: completed return, label and instructions, with no duplicate return. Compare the successful trace. Explain that a lost response or partial failure does not mean nothing happened; retry safety belongs to the application.

For an automated version against a fixture-auth server, run:

```bash
source .runtime/server.env
pnpm demo:workflow
```

### 4. Sign-in → authorization (5 minutes)

Show `src/mastra/mcp/oauth.ts`, then the domain's tenant check. WorkOS authenticates the user; token verification checks signature, issuer, audience and expiry; the application decides which orders that user may access. The demo's user-to-tenant map is not a production membership system.

Ask ChatGPT to look up `ORD-005`. Expected: unavailable in this account, with no other tenant's order details returned.

### 5. Reuse and questions (remaining time)

Show `src/mastra/agents/support.ts`: the optional embedded agent reuses the same tools. No model call is required to explain the registration.

Takeaway: MCP exposes capabilities to external agents; Mastra provides reusable tools, orchestration and execution tracing behind those capabilities.

## Reset between rehearsals

- Restart the interactive server after creating returns. `pnpm reset` does not reset a running process.
- Restart with `SHIPPING_FAILURES=3` to repeat the carrier-failure demonstration.
- Leave the tunnel running if its target remains port 4180; the public MCP URL does not change.
- Start a new ChatGPT conversation to avoid cached conversational answers.
- Read `.runtime/server.env` for the new private Studio port. Each server launch uses a new trace database.
- Check `ORD-001` is delivered and eligible before presenting. A read-only rehearsal needs no state reset.

## Protocol notes and optional extension

- Modern MCP removes protocol-session affinity, not application storage, OAuth login sessions or conversation state. Older servers could already offer stateless modes.
- Servers implement `server/discover`; clients need not call it before every request.
- Elicitation remains the capability; MRTR carries the additional input across follow-up requests. Ordinary conversational confirmation is not proof of MCP elicitation.
- Modern HTTP still uses SSE framing for streaming; the legacy SSE transport is not the recommendation.
- Demonstrate `pnpm demo:v2` for modern HTTP, auto-negotiated stdio and explicit legacy comparison. Sanitized [transcripts](proof/README.md) are available as recorded fallbacks.
- Broadcast only public policy updates. Subscribing to an order URI does not establish authorization to read it.
- Write tools that fit the work. Discuss progressive discovery and sandboxed code mode as optional patterns; neither is implemented in this example.

Stop owned servers and tunnels after the event. Keep secrets, recordings containing credentials, and real customer data out of the repository.
