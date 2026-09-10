# Connect your existing host

The product exposes capabilities; your host owns the reasoning loop. No model key is needed for the automated clients.

## Start a fresh server

After installation and the development-only v2 overlay, run:

```bash
pnpm serve
```

Leave it running. In a second terminal in this example:

```bash
source .runtime/server.env
export RETURNS_DESK_TOKEN=workshop-north
```

The token is a **local fixture**, not a production credential. The launcher allocates a port and writes the actual URL. Restart the launcher to reset data; `pnpm reset` alone does not reset an already running process.

## Independent programmatic client

```bash
pnpm demo:discover
```

This starts its own isolated server, lists tools/resources/templates/prompts, calls `getOrder`, reads policy/order resources and disconnects. It uses the public Mastra MCP client, not Studio's execute endpoint.

## MCP Inspector

Checked with Inspector **2.5.0** on 2026-09-08. This is a separate implementation/client installation:

```bash
pnpm demo:inspector
```

The automated CLI gate starts a fresh server, proves discovery/invocation/resource reads, and closes it. To explore the server you left running:

```bash
pnpm dlx @modelcontextprotocol/inspector@2.5.0 --web
```

In Inspector choose HTTP, enter `$MASTRA_BASE_URL/api/mcp/returns-modern/mcp` with the actual printed URL, and add the `Authorization` header with `Bearer workshop-north`. Inspect tools, resources and prompts, then call `getOrder` with `{"orderId":"ORD-001"}`. Do not select legacy SSE for the modern server. Stop Inspector when finished.

CLI equivalent:

```bash
pnpm dlx @modelcontextprotocol/inspector@2.5.0 --cli \
  --server-url "$MASTRA_BASE_URL/api/mcp/returns-modern/mcp" \
  --transport http --method tools/call --tool-name getOrder \
  --tool-args-json '{"orderId":"ORD-001"}' \
  --header "Authorization: Bearer $RETURNS_DESK_TOKEN"
```

## Cursor

Copy `docs/clients/cursor-mcp.json` to `.cursor/mcp.json` in a **local project**, not into your global personal configuration. The template uses Cursor's environment interpolation. Launch Cursor from the terminal that has both environment variables, or set them through your supported host environment mechanism. An already running GUI process may not inherit newly exported variables; restart it if necessary.

Enable `returns-desk` in MCP settings. The endpoint uses raw tool names (`getOrder`, `createReturn`); a multi-server client may prefix its own names. With a signed-in host, ask:

> Use Returns Desk to read ORD-001 and check its return eligibility. Show me the order and reason codes. Then, with my approval, create a damaged return with idempotency key cursor-demo-001. Do not use a generic API tool or fabricate the result.

Approve only the bounded local mutation. Repeat the call with the same key: there should be one return, not two. Reset by restarting the launcher before another demonstration. High-value ORD-002 uses interactive elicitation; host support varies, so the raw harness is its authoritative proof.

**Human release gate remains open:** the JSON parses, but successful signed-in Cursor discovery and mutation must be visibly recorded before launch. Do not equate config validation with host compatibility.

## Other desktop/coding-agent hosts

`docs/clients/cursor-mcp.json` also illustrates the generic remote JSON shape (`mcpServers`, URL and headers). These keys and `${env:...}` interpolation are host-specific, not part of MCP. Adapt them to the installed host's documented format. Hosts without remote HTTP support may need a compatible bridge; do not silently switch to SSE.

The optional `docs/clients/stdio-mcp.json` starts the protocol-only stdio harness. Set `RETURNS_DESK_PROJECT` to this example directory in your host environment and adapt interpolation to the host. This harness permits discovery/public policy reads but injects no tenant identity, so tenant tools correctly reject calls. It is not a second production deployment path. `pnpm demo:v2` uses this same server through a byte-recording proxy to prove Mastra's omitted negotiation sends `server/discover`.

Remote multi-user deployments need HTTPS and proper OAuth; this local bearer-token exercise is not an OAuth server.
