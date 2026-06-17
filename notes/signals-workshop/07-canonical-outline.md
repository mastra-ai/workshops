# 07 — Canonical Workshop Outline

Reconciled outline that resolves inconsistencies across `README.md`, `02-workshop-arc.md`, `03-signal-types.md`, and `06-cohesive-demo-plan.md`. This is the single source of truth for slide structure, section count, and demo sequencing. Treat earlier files as supporting notes.

## Title

**Watch, Steer, and Wake Running Agents with Mastra Signals**

Alternates if the room is more technical:

- Build Live Agents with Mastra Signals
- Communication for Long-Running Agents
- Make Agent Loops Addressable

## Thesis

> Signals let you watch, talk to, steer, update, and wake a running agent without restarting the loop.

## Strategic framing (one slide)

| Primitive | Direction | Purpose |
| --- | --- | --- |
| Tools | Agent → World | Affect external systems |
| Memory | Agent → Future self | Persist context over time |
| Signals | World → Live agent loop | Send context into running or idle agents |

## Workshop promise

By the end, attendees can build an agent loop that is:

1. Observable — another client can subscribe and watch it.
2. Addressable — users or systems can send/queue input after it starts.
3. Steerable — processors can guide it while it works.
4. State-aware — dynamic state can update without rewriting the prompt.
5. World-aware — external systems can wake or notify it.

## Section structure (locked)

Exactly six sections. Slide titles must be use-case-shaped, not signal-type-shaped. Signal type names appear in the body.

| # | Slide title | Underlying concept |
| --- | --- | --- |
| 1 | Why agents need an input layer | Why Signals exist |
| 2 | Watch and talk to a live loop | Messages + subscriptions |
| 3 | Steer the loop while it works | Reactive Signals |
| 4 | Keep state fresh without rewriting the prompt | State Signals |
| 5 | Wake an agent from the outside world | Notification Signals |
| 6 | What this unlocks | Recap + boundaries |

Tool Approval is a sidebar inside Section 2, not a separate section or signal type. Tool approval uses the subscription path; it is a control-plane pattern, not a fifth type.

## Section-by-section

### Section 1 — Why agents need an input layer

**Open with a problem, not a primitive.**

- The first generation of agents were chatbots: send a message, stream a response, finish the turn.
- The agents we are building now look different: they run for minutes or hours, use tools, browse, wait for approvals, watch GitHub/CI/Slack/email, maintain working memory, and may be observed by multiple clients.
- Core pain: once an agent loop starts, there is no first-class way to reach it.
- Not everything is a chat message: browser tab changed, working memory changed, CI failed, PR review requested, tool approved, another user joined.
- Signals decouple stream ownership from context delivery.

**Key sentence:**

> Before Signals, the agent loop owned both execution and context delivery. Signals decouple those.

**End the section with the strategic framing table.**

### Section 2 — Watch and talk to a live loop

**User problem.** Long-running agent is active; another client or user wants to watch or send input.

**Before Signals.** Restart the interaction, poll state, force traffic through the original stream owner, or append regular messages with no active-loop semantics.

**Signals pattern.**

- `subscribeToThread({ resourceId, threadId })` makes the loop observable.
- `sendMessage(message, { resourceId, threadId })` and `queueMessage(...)` make it addressable.
- Active vs idle delivery via `ifActive` / `ifIdle` options.

**Tool approval sidebar (small slide).** Tool approvals are control-plane input over the same subscription path. Mention; do not deep-dive.

**Demo.** Section of Demo A.

**Unlock.** Multiplayer agents, multi-screen agents, live steering without restart.

### Section 3 — Steer the loop while it works

**User problem.** The agent is already working; a processor notices relevant context or a risky condition.

**Before Signals.** Mutate the prompt, restart the run, hide logic inside tools, or hope the agent finds context on its own.

**Signals pattern.** Reactive Signals from processors guide the active agent without interrupting it.

**Important correction (verbal).** Reactive Signals are agent-facing input, not UI commands. They may be rendered in a UI, but their job is to guide the loop.

**Demo.** Mastra Code TUI example where the reactive signal renders visibly (AGENTS.md detection, `gh pr` workflow guidance, or recovery after a failed command).

**Unlock.** Agent-loop middleware that can add structured guidance in order while the loop keeps running.

### Section 4 — Keep state fresh without rewriting the prompt

**User problem.** The agent needs fresh changing context: working memory, browser state, project state, user/org state.

**Before Signals.** Rewrite system instructions every turn → break prompt cache, lose chronology, or stuff state into normal messages.

**Signals pattern.** State Signals deliver snapshots and deltas as append-only state updates.

**Teaching distinctions (use the workshop-friendly version):**

- Working Memory is one use case of State Signals. Browser state, project state, user/org state, and runtime state all use the same delivery mechanism.
- `contents` = model-facing rendered text.
- `value` = full structured backing state.
- `delta` = machine-readable change that produced the signal.
- `cacheKey` = stable identity used to skip unchanged state.
- Processor decides snapshot vs delta.

**Prompt-cache beat (one slide).**

> Signals are added to conversation history in order. Changing state stays append-only, so prompt cache is preserved.

**Demo.** Demo B (Playground state signal zoom). Working Memory snapshot/delta in Playground UI.

**Unlock.** Dynamic system guidance without rewriting the prompt or destroying prompt cache.

### Section 5 — Wake an agent from the outside world

**User problem.** External systems need to notify or wake an idle or active agent.

**Before Signals.** Poll manually, send noisy chat messages, build a custom side channel per integration, lose dedupe/coalescing semantics.

**Signals pattern.** Notification Signals represent external-world events with delivery policy, priority, dedupe, and coalescing.

**Key concepts:**

- `source`, `kind`, `priority`
- `summary` (model-facing)
- `dedupeKey` (exact event identity)
- `coalesceKey` (group related noisy events)
- `attributes` (routing/filtering)
- `metadata` (system-facing)

**Idle vs active delivery (one slide).**

> Signals don’t require the agent to be running. Idle delivery wakes the loop; active delivery joins it mid-flight.

**Demo.** Section of Demo A — GitHub Signals in Mastra Code surfacing PR activity.

**Unlock.** Agents become world-aware processes, not just chat responders.

### Section 6 — What this unlocks

**Recap arc.**

> watch it → talk to it → steer it → update its state → wake it from the world

**What Signals are not (boundary slide).**

- Not a pub/sub bus between arbitrary services.
- Not a replacement for tools, memory, or processors. They complement them.
- Currently require Mastra memory (resource/thread).
- Multi-process Pub/Sub is available but only matters once you’re past single-server.

**Where this is going.**

- Notification Signals + vendor integrations (GitHub, Agent Mail, Resend, Slack, calendars).
- State Signals as the substrate for working memory, browser, project, org, and runtime state.
- Subconscious / background agents delivering updates through Signals.

**Close.**

> Agents are becoming live processes. Signals are how you reach them.

## Sequencing decision

The arc above ends on Notification → recap. Notification has the broadest immediate appeal, which matches the launch retrospective.

If the room skews very technical (infra, framework, platform engineers), swap Sections 4 and 5 so the workshop ends on State Signals + prompt cache. State is the deepest technical payoff and leaves a sophisticated audience nodding.

Decide based on the room; do not change anything else.

## Demos (canonical)

Two demos only. Do not run a demo per signal type.

### Demo A — Live PR Agent in Mastra Code (carries Sections 2, 3, 5)

- Start a real PR task in Mastra Code.
- Send follow-up steering while the agent is active (Section 2).
- Trigger or point out reactive guidance (Section 3).
- Surface a GitHub notification signal mid-run (Section 5).

Do not include tool approval in this demo unless it happens naturally.

### Demo B — Working Memory State Signal in Playground (carries Section 4)

- Ask the agent to remember a small preference.
- Show the state signal rendering in Playground.
- Update the preference.
- Show snapshot vs delta (or explain with a small XML/diff if delta rendering is not visible).

### Transition line between demos

> In Mastra Code, Signals showed up as a product experience: the agent kept working while context arrived from us, from processors, and from GitHub.
>
> One of the most important parts of that system is easier to see in isolation: state.
>
> Let’s switch to Playground and look at how Working Memory is delivered as a State Signal.

## API quick reference (speaker notes)

Verified shapes from the worktree, use these in code on slides.

- `agent.subscribeToThread({ resourceId, threadId })` → subscription with `.stream`.
- `agent.sendMessage(message, { resourceId, threadId, ifActive?, ifIdle? })` where `message` is a string or `{ contents, attributes, metadata }`.
- `agent.queueMessage(...)` preserves turn order.
- `agent.sendSignal({ type, tagName?, contents, attributes?, metadata?, providerOptions? }, { resourceId, threadId })`.
- `agent.sendStateSignal({ id, mode, cacheKey, contents, value?, delta? }, { resourceId, threadId })` with `mode: 'snapshot' | 'delta'`.
- `agent.sendNotificationSignal({ source, kind, priority, summary, dedupeKey, coalesceKey?, attributes? }, { resourceId, threadId })`.
- Processor hook: `Processor.processInputStep({ messageList, sendSignal })`.
- State processor hook: `Processor.computeStateSignal({ lastSnapshot, deltasSinceSnapshot, activeStateSignals, contextWindow })`.

## Things to avoid (do not regress on these)

- Do not open with the signal taxonomy.
- Do not lead with “context engineering primitive” before the use case is felt.
- Do not present Reactive Signals as UI commands.
- Do not present State Signals as equivalent to Working Memory.
- Do not make Notification Signals hypothetical; use Mastra Code + GitHub Signals as the concrete example.
- Do not run a demo per signal type. Two cohesive demos only.
- Do not list Tool Approval as its own signal type.
- Do not use `content` in slide code; the field is `contents`.

## Open decisions for Tyler

1. End the workshop on Notification or State? (Default: Notification. Swap if room is highly technical.)
2. Reactive demo source: AGENTS.md detection, `gh pr` guidance, or error recovery?
3. PR target for Demo A — pick one safe live PR with review comments or CI status to demo against.
4. Whether to show idle delivery live (requires staging a paused agent) or describe it during the boundary slide.
