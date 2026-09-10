# MCP is so back! Build Tools for the Agents Your Users Already Use

Presenters: **Daniel Lew** and **Alex Booker**.

Returns Desk wraps an existing local commerce service in bounded MCP tools, resources and a workflow-backed tool. REST, CLI and an optional embedded agent reuse the same business logic. The core path needs **no model key**.

**Package requirement:** this is a development preview. The committed manifest uses published `@mastra/mcp@^1.17.3`; the modern demonstrations require the guarded local v2 overlay below until stable `^2.0.0` is published. Do not mistake a successful baseline install for modern-feature verification.

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

## Try the demos (after setup)

```bash
pnpm reset
pnpm demo:surfaces
pnpm demo:discover
pnpm demo:workflow
pnpm demo:v2
pnpm demo:failures
```

Expected: shared REST/CLI order; five MCP tools; a failed shipping step, recovery without a duplicate return, and stored traces; green modern/legacy/stdio proof; auth and cancellation checks. Each script runs against synthetic data.

For independent Inspector verification: `pnpm demo:inspector`. For the full automated gate: `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Interactive clients

For real MCP OAuth, follow [WorkOS setup](docs/oauth.md) and run `pnpm serve:oauth`. It exposes only MCP and discovery through the development tunnel; Studio stays private. WorkOS login and the user-to-tenant mapping require a live rehearsal.

For the keyless fixture demo, run `pnpm serve`. It prints the actual allocated base URL and writes `.runtime/server.env`. In another terminal in this directory:

```bash
source .runtime/server.env
curl -fsS "$MASTRA_BASE_URL/api/mcp/v0/servers"
```

The URL is the origin, **without `/api` appended**. There is one MCP server: `${MASTRA_BASE_URL}/api/mcp/returns-modern/mcp`, using `2026-07-28`. The legacy server exists only inside `demo:v2` as a comparison fixture.

[Client setup](docs/client-setup.md) includes Inspector, Cursor and generic HTTP/stdio templates. Use the local fixture authorization header described there; these are teaching credentials, not production secrets. Rehearse discovery and invocation in your chosen host.

REST: GET `/returns/orders/ORD-001`, POST `/returns`, with the same local authorization boundary. CLI: `RETURNS_TENANT=north pnpm exec tsx src/cli.ts get ORD-001`.

**State:** orders and labels are process-local; restart to reset them. Traces persist in LibSQL under `.runtime/`; this is not durable business storage. Automated demos own their listeners. `demo:workflow` can explicitly use `MASTRA_BASE_URL` to leave traces visible in an interactive server.

## Why Mastra: the live demo

One typed tool calls a four-step workflow: **eligibility → create return → shipping label → instructions**. Mastra retries only the shipping step. A typed wrapper keeps workflow internals out of the MCP response and passes tracing context through to the workflow.

Terminal 1:

```bash
SHIPPING_FAILURES=3 pnpm serve
```

Terminal 2:

```bash
source .runtime/server.env
pnpm demo:workflow
```

The first call returns `needs_retry`; the next completes with the same return ID; a third replays the same result. Open the printed origin in Studio → Traces. Inspect the oldest `processReturn` trace: tool → workflow → failed `shipping-label` step. Compare the successful trace. The tool itself succeeded in returning a safe pending result; the nested workflow failed.

The current Studio shows the failed step in Attributes; the stored trace API also contains the carrier error. MCP log/progress notifications are not tracing. Restart before repeating the failure demo. The carrier is simulated; no real shipping occurs.

Studio and its trace APIs are local debugging surfaces, not tenant-scoped public APIs. Do not expose the entire dev server through a tunnel.

## Slide-to-code map

The [deck](../../slides/mcp-product-workshop/index.tsx) follows ten sections across 11 slides (one extra session diagram), with a short ChatGPT demo before the protocol discussion and a longer auth-focused demo at the end. [FACILITATOR.md](FACILITATOR.md) contains the 90-minute timing, speaker notes, fallback commands and cleanup.

For ChatGPT, use the OAuth setup and restricted public gateway, not local fixture tokens. Custom-app permissions and client features vary by account. Rehearse the connection before presenting; keep Studio private.

| Slides | Concept | Source / demo |
| --- | --- | --- |
| 1–4 | Intro, definition, supplied growth tweet, workshop/protocol timeline | `docs/sources.md`; `src/mastra/mcp/index.ts` |
| 5 | Your assistant versus your tools in their assistant | Use cases, adoption and maintenance explained aloud; optional `src/mastra/agents/support.ts` |
| 6 | Short ChatGPT tools demo | OAuth setup and facilitator guide; Inspector fallback |
| 7–8 | Previous → latest spec; before/now session diagram | Local spec research; `scripts/protocol/`; safety/deployment questions spoken |
| 9 | Why now? | Primary product/governance evidence in `docs/sources.md` |
| 10 | Five short best practices, including auth | Tool schemas, domain authorization, idempotency and real-host testing |
| 11 | Auth demo and questions; no separate closing slide | `demo:surfaces`, `demo:discover`, `demo:workflow`, `demo:failures`, `demo:v2` |

## What is—and is not—new

| Newly defaulted in v2 | Supported before v2 | Not implemented in this workshop |
| --- | --- | --- |
| Omitted protocol config prefers 2026-07-28: stateless modern HTTP, MRTR elicitation, modern subscriptions | Tools, workflow tools, resources, prompts, Streamable HTTP; native 2026 support was previously opt-in | Tasks, sampling, completions, roots; a production OAuth authorization server |

The stdio auto leg shows `server/discover`. The pinned HTTP leg does not require that probe. The subscription authorization spike showed that subscribing to a URI does not prove permission to read it: **only public policy updates are broadcast**, never tenant order changes.

`DEMO_AGENT=1 pnpm serve` registers the optional support agent with the same read tools and `processReturn`. Calling the model needs `OPENAI_API_KEY`; the core demo does not. Agent routes use the same bearer-token identity. Do not let the model choose a tenant/user.

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

## Further reading

- [Protocol transcript fixtures](proof/README.md)
- [Production guidance](docs/production.md)
- [MCP and tool-design sources](docs/sources.md)
- [OAuth setup](docs/oauth.md)

The local MCP overlay is a development setup, not a registry-only installation. Until the package requirement above is updated, the modern demos need that source build.
