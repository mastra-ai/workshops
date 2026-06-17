# 06 — Cohesive Demo Plan

## Demo thesis

Use one cohesive story for the main demo:

> A live PR agent can be watched, steered, updated, and notified while it works on a real pull request.

Then use Playground UI separately to zoom into Working Memory state signals, because Playground renders them clearly.

This avoids treating demos as a taxonomy tour. MastraCode shows Signals as a real product workflow; Playground shows the mechanics of state delivery in isolation.

## Demo A — Live PR Agent in MastraCode

### Goal

Show Signals in a realistic long-running coding workflow.

The agent is working on a PR. While it runs, it can receive guidance from the user, from processors/providers, from task state, and from GitHub notifications without restarting the loop.

### What this demo proves

- The agent loop is alive and addressable.
- A user can steer it mid-run.
- Reactive signals can guide the active loop.
- Task/state signals can preserve working context.
- GitHub notification signals can bring external PR activity into the loop.

### Signal concepts covered

- Messages / active-loop input
- Reactive signals
- State signals via task state
- Notification signals via GitHub Signals

Do **not** include tool approval continuation in this demo unless it happens naturally. It is not part of the planned workshop path.

### Setup notes

Need a PR that can produce a believable coding-agent workflow:

- has review comments, CI status, or discussion activity
- is safe to modify during demo
- has project instructions available if possible
- gives the agent something small and concrete to do

Useful PR task shapes:

- “Review this PR and address the latest feedback.”
- “Investigate the failing CI on this PR and propose/fix the smallest change.”
- “Summarize review feedback, make the minimal code change, and run focused checks.”

### Script outline

#### 1. Start the live PR task

Prompt idea:

```text
Review this PR and address the latest feedback. Keep changes minimal and run only focused checks.
```

Teaching line:

> We are not starting a one-shot chatbot turn. We are starting a live agent loop that can keep receiving context.

#### 2. Show that the loop is addressable

While the agent is active, send a follow-up instruction.

Prompt idea:

```text
Prioritize the smallest safe change. Do not run repo-wide checks; use the narrowest relevant package checks.
```

Teaching line:

> The running loop can receive new human guidance without restarting.

#### 3. Show reactive guidance

Trigger or point out reactive guidance from the system/provider/processor.

Possible sources:

- PR-related guidance when the agent is working with GitHub context
- project instruction guidance, e.g. AGENTS.md-style workflow expectations
- recovery guidance after an error or failed command
- GitHub subscription hint or subscribe/unsubscribe behavior

Teaching line:

> Reactive signals are structured guidance for the agent. They are not UI commands; they are agent-facing input into the loop.

#### 4. Show task/state continuity

Point out the task list / task state behavior if visible.

Teaching line:

> The task list is not just local UI decoration. In MastraCode, task state is delivered through the signal system so the agent can keep track of work across turns and context pressure.

#### 5. Show GitHub notification signal

Surface a PR-related notification if possible:

- new review comment
- CI failure
- PR updated
- review state changed
- merge state changed

Teaching line:

> GitHub is now an input source into the agent loop. The agent can be notified by the world, not only prompted by a user.

#### 6. Close the demo with the thesis

> This is the live-agent shape: the agent keeps working while context arrives from humans, processors, state, and external systems.

## Demo B — Working Memory State Signals in Playground UI

### Goal

Zoom into State Signals in a clean, visual environment.

Playground UI is useful because it renders state signals, making the state-delivery mechanism easier to inspect than inside the MastraCode product workflow.

### What this demo proves

- State Signals deliver changing context as model-visible input.
- Working Memory is one feature that uses State Signals; State Signals themselves are the delivery mechanism.
- Dynamic guidance can update without rewriting the whole system prompt.
- Snapshot/delta behavior is easier to reason about when rendered.

### Signal concepts covered

- State signals
- Working Memory state delivery
- model-facing content vs backing state
- snapshot vs delta
- cache-aware unchanged-state behavior, if visible

### Script outline

#### 1. Start with simple working memory

Ask the agent to remember or use a small preference.

Prompt idea:

```text
Remember that I prefer concise examples and narrow, focused test commands.
```

Teaching line:

> The memory lives in storage. The State Signal is how the current memory value or change is delivered into the agent context.

#### 2. Show the rendered state signal

Point to the state signal rendering in Playground UI.

Explain:

- model-facing content is what the agent reads
- metadata/value are system-facing backing details
- state is delivered append-only into the conversation timeline

#### 3. Update the memory

Prompt idea:

```text
Update that preference: I still want concise examples, but include a short explanation before code.
```

Teaching line:

> This is dynamic system guidance changing over time, but it does not require rewriting the whole prompt every turn.

#### 4. Explain snapshot vs delta

If delta rendering is visible, show it directly.

If not, explain conceptually:

- snapshot: the full current state
- delta: the change from the previous visible state
- fallback snapshot: emitted when the prior snapshot is no longer in context
- cache key: lets processors skip unchanged state

#### 5. Close with the generalization

> Working Memory is only one use case. The same delivery pattern works for browser state, project state, user/org state, and runtime environment state.

## How the two demos fit together

### MastraCode demo

Shows Signals as product experience:

- live coding agent
- PR workflow
- user steering
- reactive guidance
- task/state continuity
- GitHub notifications

### Playground demo

Shows Signals as mechanism:

- rendered state signal
- working memory update
- snapshot/delta concept
- dynamic guidance without prompt rewriting

## Suggested transition between demos

> In MastraCode, Signals showed up as a product experience: the agent kept working while context arrived from us, from processors, from task state, and from GitHub.
>
> But one of the most important parts of that system is easier to see in isolation: state.
>
> So let’s switch to Playground and look at how Working Memory is delivered as a State Signal.

## Fallback paths

### If GitHub notification is hard to trigger live

Use an already-captured notification or notification inbox state.

Teaching line:

> The important thing is not the GitHub event itself; it is that external systems can deliver first-class input into the agent loop.

### If reactive guidance is not visually obvious

Use a simpler processor/demo condition or explain from the event/rendered signal history.

Good fallback examples:

- project instruction guidance
- PR workflow guidance
- tool error recovery guidance

### If Playground does not show deltas clearly

Still show the state signal render and explain snapshot/delta using a small XML/diff snippet.

Example:

```xml
<working-memory-state format="markdown">
# Preferences
- concise examples
</working-memory-state>
```

```diff
@@ Preferences
-- concise examples
+- concise examples with a short explanation before code
```

## Final demo takeaway

> MastraCode shows why Signals matter: live agents need to be reachable while they work.
>
> Playground shows how one of the most important mechanisms works: changing state is delivered append-only as agent-readable context.
