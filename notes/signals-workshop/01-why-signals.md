# 01 — Why We Built Signals

## Opening idea

The first generation of agents looked like request/response chatbots:

1. user sends a message
2. agent streams a response
3. turn ends

That model breaks down when agents become long-running processes.

## The agent shape changed

The agents Mastra was building started to look different:

- They run for minutes or hours.
- They use tools.
- They browse.
- They wait for human approvals.
- They watch GitHub, CI, Slack, email, and other systems.
- They maintain working memory and runtime state.
- Multiple clients or users may care about the same thread.
- Background/subconscious processes may discover useful context later.

The core product pain:

> Agents can run for hours now. But once one is running, there was no clean way to reach into it — to steer it, watch it from another screen, or let someone else jump in.

## The missing input layer

Before Signals, the client that started the stream effectively owned the interaction.

If another UI, user, processor, or background system wanted to reach the same agent loop, it had no clean path.

Signals decouple stream ownership from context delivery:

- one client can start the loop
- another client can subscribe
- another can send or queue input
- processors can inject guidance
- state can update append-only
- external systems can wake or notify the agent

## Not everything is a chat message

Examples of things an agent may need that are not really chat messages:

- The browser tab changed.
- Working memory changed.
- CI failed.
- A PR review was requested.
- A tool call was approved.
- Another user joined the thread.
- A processor found relevant project instructions.
- A background agent discovered something useful.

Signals make these inputs first-class.

## Strong intro draft

> Agents are changing shape.
>
> The first generation of agents looked a lot like chatbots: send a message, stream a response, finish the turn.
>
> But the agents we were building in Mastra didn’t look like that anymore. They ran for minutes or hours. They used tools. They waited for approvals. They browsed the web. They watched GitHub. They maintained working memory. Multiple clients or users might care about the same thread.
>
> And we kept running into the same problem: after an agent loop started, there was no first-class way to reach it.
>
> Tools let agents affect the world. Memory lets agents persist context over time. But agents also need an input layer — a way for users, processors, state, and external systems to send context into a live or idle loop.
>
> That’s why we built Signals.
>
> Signals let you watch, steer, update, and wake a running agent without restarting it, rewriting the prompt, or forcing every event to pretend it’s a chat message.

## Key sentence

> Before Signals, the agent loop owned both execution and context delivery. Signals decouple those.
