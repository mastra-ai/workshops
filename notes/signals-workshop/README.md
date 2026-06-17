# Signals Workshop Notes

Working notes for a Mastra Signals workshop. These are intentionally structured notes, not final slides.

## Working title

**Watch, Steer, and Wake Running Agents with Mastra Signals**

Alternates:

- Build Live Agents with Mastra Signals
- From Chatbot to Live Agent Loop
- Make Agents Addressable with Signals
- Communication for Long-Running Agents

## Core thesis

Agents are becoming live processes. Signals are the input layer for communicating with them while they are alive.

More action-oriented:

> Signals let you watch, talk to, steer, update, and wake a running agent without restarting the loop.

## Strategic framing

The missing third pillar:

| Primitive | Direction | Purpose |
| --- | --- | --- |
| Tools | Agent → World | Let agents affect external systems |
| Memory | Agent → Future self | Persist context over time |
| Signals | World → Live agent loop | Send context into running or idle agents |

## Workshop promise

By the end, attendees should understand how to build an agent loop that is:

1. **Observable** — another client can subscribe and watch it.
2. **Addressable** — users or systems can send/queue input after it starts.
3. **Steerable** — processors can guide it while it works.
4. **State-aware** — dynamic state can update without rewriting the whole prompt.
5. **World-aware** — external systems can wake or notify it.

## Canonical outline

Use [`07-canonical-outline.md`](./07-canonical-outline.md) as the single source of truth for slide structure, section count, and demo sequencing. Earlier files are supporting notes.

## Recommended arc

> watch it → talk to it → steer it → update its state → wake it from the world

Locked sections:

1. Why agents need an input layer
2. Watch and talk to a live loop
3. Steer the loop while it works
4. Keep state fresh without rewriting the prompt
5. Wake an agent from the outside world
6. What this unlocks

## Demos

Run two cohesive demos, not one demo per signal type:

1. **Live PR Agent in MastraCode** — carries messages/subscriptions, reactive signals, and GitHub notification signals.
2. **Working Memory State Signal in Playground** — zooms into state signals with visible rendering.

## Avoid

- Do not open with signal taxonomy.
- Do not lead with “context engineering primitive” before the use case is felt.
- Do not teach State Signals as equivalent to Working Memory.
- Do not describe Reactive Signals as UI commands; they guide the agent.
- Do not make Notification Signals hypothetical; use GitHub/MastraCode-style examples.
- Do not list Tool Approval as its own signal type; mention it only as a sidebar if needed.
- Do not use `content` in slide code; the field is `contents`.
