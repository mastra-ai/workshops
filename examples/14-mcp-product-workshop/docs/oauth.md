# MCP OAuth with WorkOS

This is separate from Studio authentication. `pnpm serve` uses local fixture tokens. `pnpm serve:oauth` uses WorkOS JWTs and rejects those fixture tokens.

## Configure

In a WorkOS development environment:

1. Enable CIMD under **Connect → Configuration**. Leave DCR off unless a client requires it.
2. Add the exact public MCP endpoint as a **Resource Indicator**.
3. Enable an AuthKit sign-in method and create the presenter’s test user.
4. Copy that user's ID from WorkOS. Assign it to `north` in the local configuration below. Other authenticated users receive 403.

Create `.env.oauth` (gitignored) with these values:

| Variable | Value |
| --- | --- |
| `MCP_AUTH_MODE` | `workos` |
| `WORKOS_ISSUER` | Exact issuer from WorkOS discovery |
| `WORKOS_JWKS_URL` | Signing-key URL from the same discovery document |
| `MCP_RESOURCE_URL` | Public HTTPS origin plus `/api/mcp/returns-modern/mcp` |
| `MCP_USER_TENANTS` | JSON map of WorkOS user IDs to `north` or `south`; `{}` denies all users |

No WorkOS API key is needed for public-key verification. Do not put access tokens in this file.

## Run

```bash
ngrok http http://127.0.0.1:4180 --inspect=false
```

Use the assigned HTTPS origin in `MCP_RESOURCE_URL` and WorkOS's Resource Indicator. Then:

```bash
pnpm serve:oauth
```

The launcher prints the private Studio origin. The tunnel targets a separate, loopback-bound gateway, not Studio. Only MCP POST requests and GET `/.well-known/oauth-protected-resource` are forwarded. Other paths return 404. The gateway checks the upstream resource metadata before forwarding and fails closed if the configured OAuth resource is unavailable.

Restart the launcher after changing `.env.oauth`. Stop both commands to close public access. If the tunnel URL changes, update both WorkOS and the local resource URL before reconnecting clients.

## Verify

- Anonymous MCP call: 401 with `WWW-Authenticate` pointing to resource metadata.
- Metadata: exact public resource URL and WorkOS issuer.
- Client: discover issuer, sign in, approve access, then call `getOrder` for `ORD-001`.
- Invalid/expired/wrong-audience token: 401. Authenticated but unmapped user: 403.
- Public `/traces`, `/api/tools`, and `/returns/orders/ORD-001`: 404.

`tests/oauth.test.ts` exercises the real Mastra HTTP endpoint through the restricted gateway using signed test JWTs and a local JWKS server. It does not prove a WorkOS browser login or a host's CIMD support; those require a separate live rehearsal.

## Independent login check

Before configuring ChatGPT, restart the launcher with `pnpm serve:oauth --oauth-check`. In another terminal:

```bash
node --env-file=.env.oauth --import tsx scripts/demo-oauth.ts
```

The flag publishes a public CIMD document at `/oauth-client.json` for this test client only. The script uses Mastra's OAuth provider, opens sign-in on macOS, and waits up to two hours for approval. Keep the client, server and tunnel running throughout sign-in; after a timeout, start a fresh authorization request rather than reopening an old callback URL. Keep loopback port 8090 free. After login it discovers five tools and reads an authorized order and resource. Tokens stay in memory; no DCR or WorkOS API key is needed. Restart without the flag to remove the test client's metadata endpoint. This verifies our client, not ChatGPT compatibility.

## Implementation

`src/mastra/mcp/oauth.ts` uses public `@mastra/mcp` discovery/challenge helpers and `jose` for signature, issuer, audience, expiration and subject validation. Verified identity reaches tools and resources through Mastra's request context. Tenant authorization remains in the domain service. An explicit user-to-tenant map is a workshop allowlist, not a production membership system.

Mastra's `createOAuthMiddleware` serves the same purpose for Node HTTP servers. It is not directly compatible with the managed Hono route; this example does not impersonate a Node request or response to call it. No server-wide `SimpleAuth` is configured.

This is a development tunnel over simulated data, not a production deployment. Private REST and execution routes retain fixture authentication; never expose the Studio origin directly. Business storage, rate limits, production authorization policy and operational controls remain deployment work.

Sources: [WorkOS MCP integration](https://workos.com/docs/authkit/mcp); MCP 2026-07-28 authorization and client-registration chapters in the spec repository.
