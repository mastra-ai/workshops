# 03 — Signal Types as Teaching Notes

These are taxonomy notes for later in the workshop. Avoid opening with this taxonomy.

## Messages / thread signals

### Job

Human or client input into a running or idle thread.

### Teaching line

> Messages and subscriptions make the loop observable and addressable.

### APIs / concepts

- `subscribeToThread()`
- `sendMessage()`
- `queueMessage()`
- concurrent inbound message handling
- active vs idle delivery

### Concrete examples

- Another screen watches the same agent run.
- A user sends a correction while the agent is mid-task.
- A second user jumps into the same thread.
- A UI queues follow-up input while the current loop is still active.

## Reactive Signals

### Job

Structured, agent-facing guidance injected while the agent works.

### Teaching line

> Reactive Signals let processors guide an active agent without interrupting it.

### Important correction

Reactive signals are not UI commands. They may be rendered by a UI, but their purpose is to guide the agent loop.

### Concrete examples

- A processor detects `AGENTS.md` and injects project instructions.
- A processor sees `gh pr` usage and injects PR review guidance.
- A tool error triggers recovery guidance.
- A background process discovers relevant context and guides the active loop.

## State Signals

### Job

Deliver changing state to the agent as append-only context, usually via snapshots and deltas.

### Teaching line

> State Signals are not memory. They are the delivery mechanism that makes changing state visible to the agent without rewriting the whole prompt.

### Useful distinctions

- `contents`: model-facing rendered text
- `value`: full backing state
- `delta`: machine-readable change
- `cacheKey`: stable identity used to skip unchanged state
- processor: decides when to send snapshot vs delta

### Concrete examples

- Working memory
- Browser context
- project state
- user/org state
- runtime environment state

### Why it matters

Dynamic system guidance can update without cache murder or losing chronology.

## Notification Signals

### Job

External-world events that can wake, notify, or be consumed by an agent.

### Teaching line

> Notification Signals turn agents from chat responders into processes that can react to the world.

### Key concepts

- `dedupeKey`: exact event identity
- `coalesceKey`: group related noisy events
- `priority`: helps delivery policy
- `attributes`: routing/filtering context
- metadata: system-facing details
- `summary`: model-facing notification text

### Concrete examples

- GitHub PR review requested
- CI failed
- Slack mention
- customer email
- incident alert
- calendar event

## Tool approval sidebar

Tool approval should not be presented as its own signal type in the workshop arc.

### Job

Resolve a suspended tool call and let the loop continue over the same subscription/control-plane path.

### Teaching line

> Tool approvals are control-plane input that let humans resolve a suspended tool call without breaking the stream.

### Concrete examples

- Approve shell command execution.
- Decline a risky write.
- Continue a run after client-side tool execution.
