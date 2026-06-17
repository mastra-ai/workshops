# 02 — Workshop Arc

## Framing

Do not teach the taxonomy first. Make people feel the problem first, then reveal Signals as the clean primitive.

Workshop thesis:

> Build an agent that can be watched, talked to, steered, updated, and woken up without restarting the agent loop.

## Section 1 — Watch and talk to the loop

### User problem

A long-running agent is active, but another client or user wants to watch or send input.

### Before Signals workaround

- Restart the interaction.
- Poll state manually.
- Force all traffic through the original stream owner.
- Append regular messages without active-loop semantics.

### Signals pattern

- `subscribeToThread()` makes the loop observable.
- `sendMessage()` / `queueMessage()` make it addressable.

### Demo shape

1. Start an agent thread.
2. Subscribe from another client.
3. Send a message into the same thread.
4. Queue a message while the agent is active.
5. Show stream updates arriving through the subscription.

### Unlock

Multiplayer agents, multi-screen agents, and live steering without restart.

## Section 2 — Steer the loop

### User problem

The agent is already working, but a processor notices relevant context or a risky condition.

### Before Signals workaround

- Mutate the prompt manually.
- Restart the run.
- Hide logic inside tools.
- Hope the agent discovers the context itself.

### Signals pattern

Reactive Signals let processors guide an active agent without interrupting it.

### Demo options

- Detect `AGENTS.md` and inject project instructions.
- Detect `gh pr` usage and inject PR-review workflow guidance.
- Detect a tool error and inject recovery guidance.

### Unlock

Agent-loop middleware can add structured guidance in order, while the loop keeps running.

## Section 3 — Update the loop state

### User problem

The agent needs fresh changing context: working memory, browser state, project state, user/org state.

### Before Signals workaround

- Rewrite system instructions every turn.
- Break prompt caching.
- Lose chronology of how state changed.
- Stuff state into normal messages.

### Signals pattern

State Signals deliver snapshots and deltas as append-only state updates.

### Demo shape

1. Emit a state snapshot.
2. Change the backing state.
3. Emit a delta.
4. Show cache-aware skip for unchanged state.
5. Show snapshot recovery when needed.

### Unlock

Dynamic system guidance without rewriting the whole prompt.

## Section 4 — Wake the loop from the world

### User problem

External systems need to notify or wake an idle or active agent.

### Before Signals workaround

- Poll manually.
- Send noisy chat messages.
- Build custom side channels per integration.
- Lose dedupe/coalescing semantics.

### Signals pattern

Notification Signals represent external-world events with delivery policy, priority, dedupe, and coalescing.

### Demo options

- GitHub PR review requested.
- CI failed.
- Slack mention.
- Customer email.
- Incident alert.

### Unlock

Agents become world-aware processes, not just chat responders.

## Final progression

```text
watch it → talk to it → steer it → update its state → wake it from the world
```
