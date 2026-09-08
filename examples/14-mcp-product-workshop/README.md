# MCP is so back! Build Tools for the Agents Your Users Already Use

Presenters: **Daniel Lew** and **Alex Booker**.

Returns Desk wraps an existing local commerce service in bounded MCP tools, resources and a workflow-backed tool. REST, CLI and an optional embedded agent reuse the same business logic. The core path needs **no model key**.

**Release status:** development preview, not launch-ready. The committed manifest uses published `@mastra/mcp@^1.17.3`; the modern demonstrations require the guarded local v2 overlay below until stable `^2.0.0` is published. Do not mistake a successful baseline install for modern-feature verification.

## Setup

Requires Node 22.13+, pnpm, git and curl. Install from this directory (its own pnpm workspace prevents parent discovery):

```bash
pnpm install --frozen-lockfile
```

**Maintainers before release:** set `MASTRA_MCP_V2_PATH` to the v2 source checkout with its dependencies installed, then run:

```bash
pnpm setup:local-v2
```

The script builds MCP/dependencies, checks the core peer range, replaces only the generated MCP package symlink and invokes a Zod-backed tool across package instances. It prints the source commit and verifies unchanged manifest/lockfile hashes. Never commit that overlay. A fresh node_modules installation restores the published baseline. At release, use a registry-only `^2.0.0` install and remove this maintainer step from the participant path.

## Five-minute reviewer path (after setup)

```bash
pnpm reset
pnpm demo:surfaces
pnpm demo:discover
pnpm demo:workflow
pnpm demo:v2
pnpm demo:failures
```

Expected: shared REST/CLI order; six discoverable MCP tools (including generated workflow and live-event wrapper); workflow stages and returned order resource; green modern/legacy/stdio proof; zero unauthorized/cancelled writes and one write after retries. Each demo owns fresh server state and cleanup. Installation/build time is outside this five-minute path.

For independent Inspector verification: `pnpm demo:inspector`. For the full automated gate: `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Interactive clients

Run `pnpm serve`. It prints the actual allocated base URL and writes `.runtime/server.env`. In another terminal in this directory:

```bash
source .runtime/server.env
curl -fsS "$MASTRA_BASE_URL/api/mcp/v0/servers"
```

The URL is the origin, **without `/api` appended**. Client endpoints are `${MASTRA_BASE_URL}/api/mcp/returns-modern/mcp` and the explicit comparison `${MASTRA_BASE_URL}/api/mcp/returns-legacy/mcp`. The registry reports `2026-07-28` and `2025-11-25`, respectively.

[Client setup](docs/client-setup.md) includes Inspector, Cursor and generic HTTP/stdio templates. Use the local fixture authorization header described there; these are teaching credentials, not production secrets. Signed-in Cursor discovery/invocation remains a human release check.

REST: GET `/returns/orders/ORD-001`, POST `/returns`, with the same local authorization boundary. CLI: `RETURNS_TENANT=north pnpm exec tsx src/cli.ts get ORD-001`.

**State:** each CLI process/server uses independent in-memory fixtures. Shared domain code does not mean shared persistence. Stop and restart a running server to reset it; `pnpm reset` cannot reset another process. Automatic demos always allocate their own listeners and use the returned URL; they intentionally do not mutate an unrelated interactive server selected by an inherited environment variable.

## Slide-to-code map

The [deck](../../slides/mcp-product-workshop/index.tsx) has twelve setup slides, then one uninterrupted live demo, plus an optional closing slide. [FACILITATOR.md](FACILITATOR.md) contains timing, speaker notes, fallback commands and cleanup.

| Slides | Concept | Source / demo |
| --- | --- | --- |
| 1–4 | User preference, coworkers, MCP vs CLI, decision lab | README + facilitator decision questions |
| 5–6 | Ownership boundary; one domain/many surfaces | `src/domain/service.ts`, `src/cli.ts`, `src/mastra/api/returns.ts`; `demo:surfaces` |
| 7 | Tools/resources/prompts/workflow mental model | `src/mastra/mcp/index.ts`, `src/mastra/workflows/returns.ts`; `demo:discover`, `demo:workflow` |
| 8 | Narrow contracts vs broad callApi | `src/mastra/tools/`, `tests/mcp-contract.test.ts` |
| 9 | v2 defaults vs existing support | `scripts/protocol/`, `proof/expected/`; `demo:v2` |
| 10 | Production responsibilities | `src/domain/auth.ts`, `src/mastra/tools/mutations.ts`, `docs/production.md`; `demo:failures` |
| 11–12 | Returns Desk and transition to live demo | All demo scripts in the sequence above |
| 13 | Recap/questions | First bounded read + next production boundary |

## What is—and is not—new

| Newly defaulted in v2 | Supported before v2 | Not implemented in this workshop |
| --- | --- | --- |
| Omitted protocol config prefers 2026-07-28: stateless modern HTTP, MRTR elicitation, modern subscriptions | Tools, workflow tools, resources, prompts, Streamable HTTP; native 2026 support was previously opt-in | Tasks, sampling, completions, roots; a production OAuth authorization server |

The stdio auto leg shows `server/discover`. The pinned HTTP leg does not require that probe. The subscription authorization spike showed that subscribing to a URI does not prove permission to read it: **only public policy updates are broadcast**, never tenant order changes.

The optional `src/mastra/agents/support.ts` is not registered or required. It needs your own model credentials and server-established `RequestContext` identity. Do not let the model choose a tenant/user.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Port occupied / wrong server | Use `pnpm serve` and source its new env file. Do not assume port 4111 or manually add `/api` to the origin. |
| Stale process / unexpected returned order | Ctrl-C the workshop launcher and restart. Avoid killing unrelated processes. Build only after stopping interactive dev. |
| Old host catalogue | Disconnect/reconnect the host after restart; refresh cached discovery. Confirm the new allocated endpoint. |
| Cursor login/approval missing | Sign in and approve locally, or use the deterministic Inspector CLI/programmatic client. Do not share login/session files. |
| 401 / 403 | Check local authorization header and tenant. ORD-005 belongs to south; north cannot read it. Never “fix” this by weakening authorization. |
| Era mismatch / modern tests fail | Verify registry versions and the overlay's printed realpath/commit. Published 1.x baseline alone does not prove v2 defaults. |
| Build after local overlay | Keep `bundler.externals: ['@mastra/mcp']`; do not modify manifests to absolute file dependencies. |
| Offline Inspector | Pre-cache `demo:inspector` during setup; fall back to programmatic discovery and recorded sanitized proof. |

## Proof and release

[Proof index](proof/README.md) maps automated assertions and transcript fixtures. [Production guidance](docs/production.md) covers authorization, cancellation, error redaction, durable idempotency, ingress, OAuth/CIMD and limitations.

Before public launch: released `@mastra/mcp@^2.0.0`, clean frozen install and complete rerun; signed-in Cursor recording; second-person five-minute rehearsal; owner timing/recording approval; final review with no must-fix findings. No local overlay is a substitute for those release gates.
