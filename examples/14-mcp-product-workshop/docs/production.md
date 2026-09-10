# From workshop boundary to production

The local tokens and process-local repository are teaching fixtures, not a production authentication or persistence design.

## Failure drill

```bash
pnpm demo:failures
pnpm demo:v2
```

The first script starts a real Mastra app and proves missing-token 401, wrong-tenant 403, malformed-input 400, idempotent retry convergence and conflicting-key 409. It also checks the modern endpoint, legacy SSE endpoint and MCP REST execute path reject missing authentication. The public registry remains readable for Studio; public metadata is not permission to execute a tool.

The injected leg mounts the exact MCP server on a loopback Node listener. Its fixture adapter maps a known identity without authentication; it is intentionally **not** a deployable server. It substitutes a failing external-preflight stand-in and verifies the private error never reaches client output. It then waits until preflight actually begins, aborts the client request, verifies the server cancels the pending work, and asserts zero writes. Twelve concurrent retries subsequently converge on one return. No fault-injection switch is exposed in product input schemas or HTTP routes.

`prepareReturn()` simulates a slow, side-effect-free dependency with a cancellable 50ms timer. Real integrations should pass the same signal to their HTTP/database calls. There is a final cancellation check before the synchronous commit. Cancellation after a durable commit cannot undo it: return/reconcile the idempotent outcome instead.

The second script covers elicitation decline/cancel and accepted replay. Do not swallow the SDK's replay interrupt in a generic error translator; sanitize failures around domain/dependency calls, not around `elicitation.sendRequest()`.

## Ownership

- Authenticate at every transport boundary, including retained SSE and direct execute routes. Authenticate identity; never take tenant/user/confirmation from tool arguments.
- Authorize again in the domain. Resource listing is tenant-scoped, reads recheck the tenant, and returned data omits internal tenant fields.
- Tools and the workflow are registered with Mastra for private Studio use. Native execution routes require local fixture authentication. The public OAuth gateway exposes only the MCP endpoint and discovery metadata, not Studio, REST or native workflow execution.
- Validate shape/ranges/enums with schemas. Runtime authorization, existence and conflicts remain domain checks.
- Idempotency is keyed by tenant and a stable client key, bound to the request fingerprint. Different payloads with the same key fail. Production needs transactional uniqueness plus durable results; this in-memory Map is single-process only.
- Replayed reads and preflight must be safe to repeat. Keep writes after accepted confirmation and after the final cancellation check.
- Sensitive subscriptions require an authorization-capable design at subscription time and during credential revocation. URI membership is not authorization. This workshop emits **only public policy** updates and never order-update events.
- Only the validated trace ID is returned for correlation. Never echo authorization headers, baggage, tracestate, internal stack traces or provider error details.

## Deployment checklist

- HTTPS and a reverse proxy with strict host/origin policy, bounded request sizes, timeouts and per-identity rate limits. The local custom routes are not a comprehensive ingress protection layer.
- OAuth for public/multi-user remote hosts: validate audience/resource, expiry and scopes. CIMD supplies client metadata without dynamic registration where supported; DCR remains a compatibility option. Neither replaces token validation or business authorization. This project does not implement an OAuth server.
- Store production credentials outside the repository and logs. Never reuse the fixture tokens outside loopback development.
- Durable transactional storage, per-tenant idempotency constraints, audit records and retention policy.
- Trace/correlation IDs with access-controlled logs, redacted errors and non-sensitive metrics. Application audit events and protocol traces serve different purposes.
- Graceful shutdown: stop accepting new work, cancel/drain pending operations, close MCP transports and backing connections. A reverse proxy should stop routing before termination.
- Modern stateless HTTP simplifies transport/session routing, not business persistence. Order state, idempotency records and authorization still need deliberate ownership.
- Verify current host support for elicitation, resources and prompts. Keep the independent wire harness as the deterministic fallback.

For local reset, stop the launcher and start it again. `pnpm reset` describes this process-local fixture boundary; it cannot reset another running process. Each automated demo owns fresh server state and cleanup.
