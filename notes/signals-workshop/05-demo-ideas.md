# 05 — Demo Ideas

These are rough demo candidates. Keep demos small and runnable.

Canonical decision: run two cohesive demos, not one demo per signal type. See [`06-cohesive-demo-plan.md`](./06-cohesive-demo-plan.md) and [`07-canonical-outline.md`](./07-canonical-outline.md). The individual demos below are ingredients, not the final run order.

## Demo 1 — Addressable loop

### Goal

Show that a running agent loop can be watched and reached from another client.

### Flow

1. Start a thread with a long-running task.
2. Subscribe to the thread from another client.
3. Show stream updates arriving.
4. Send a message while the agent is active.
5. Queue another message.
6. Show the agent receiving the input without restarting.

### Teaching point

`subscribeToThread()` makes the loop observable. `sendMessage()` / `queueMessage()` make it addressable.

## Demo 2 — Reactive guidance processor

### Goal

Show a processor steering the active loop.

### Flow option A: AGENTS.md

1. Agent runs a code task.
2. Processor detects that project instructions are relevant.
3. Processor sends a reactive signal with selected guidance.
4. Agent continues with the new guidance in context.

### Flow option B: GitHub PR command

1. Agent or user invokes a `gh pr`-related command.
2. Processor detects PR workflow context.
3. Processor injects review/process guidance.
4. Agent adapts behavior without restart.

### Teaching point

Reactive signals are agent-facing guidance from processors.

## Demo 3 — State signal snapshot/delta

### Goal

Show dynamic state updating without rewriting the prompt.

### Simple conceptual state

Working memory:

```xml
<working-memory-state format="markdown">
# User
Name: Tyler Barnes

# Preferences
- concise examples
</working-memory-state>
```

Later delta:

```xml
<working-memory-delta format="markdown" notation="unified-diff">
@@ User
-Name: Tyler Barnes
+Name: Caleb Barnes
</working-memory-delta>
```

### Flow

1. Emit initial snapshot.
2. Update backing state.
3. Emit delta.
4. Repeat unchanged update and show skip.
5. Explain snapshot fallback if old snapshot falls out of context.

### Teaching point

State Signals deliver changing guidance as append-only state, preserving chronology and prompt cache friendliness.

## Demo 4 — Browser state signal

### Goal

Make state signals visual.

### Flow

1. Agent starts with browser closed or blank.
2. Browser opens a page.
3. Browser processor emits state: open, URL, title, tab count.
4. Active URL changes.
5. Processor emits delta.
6. Agent can reason from current browser state.

### Teaching point

The browser is changing outside normal chat, but the agent still gets coherent state.

## Demo 5 — Notification signal from GitHub

### Goal

Show an external-world event waking or notifying an agent.

### Flow

1. Agent subscribes to a PR.
2. GitHub/CI activity changes.
3. GitHub Signals emits notification.
4. Notification is deduped/coalesced.
5. Agent wakes if idle or receives the update if active.
6. TUI/client shows pending notification or summary.

### Teaching point

Notification Signals make agents world-aware.

## Sidebar ingredient — Tool approval continuation

Tool approval is not part of the canonical demo path. Mention it briefly only if it comes up naturally.

### Goal

Show human control without breaking the run.

### Flow

1. Agent requests a risky tool call.
2. UI renders approval prompt.
3. User approves or declines.
4. Approval resumes the loop.
5. Agent continues in the same thread/run flow.

### Teaching point

Approvals are control-plane input to the live loop, not a separate chat turn or a separate workshop section.
