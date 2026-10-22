# Presenter cues

Abhi explains the deck; Tyler operates the demos. Use section names, not the private kit's old 18-slide numbering. The repository's current [Signals deck](../../slides/signals-workshop/index.tsx) has 19 pages.

| Deck cue                                                     | Demo           | Say and show                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Observe / Send / Queue, then “See it in action”              | `pnpm demo1`   | One active research run, two queued turns, cancel the summary, steer with pricing, then a distinct French run. Acknowledgement is not completion. On published pins the terminal confirms acceptance before Studio necessarily shows the steer.                                 |
| State Signals / Prompt Cache                                 | `pnpm demo2`   | Add oat milk and coffee; ask about breakfast. Edit quantities/remove an item; ask again. Show initial snapshot, changed-only delta and fresh snapshot after the old snapshot leaves context. State is computed by the processor before a model step, not pushed by every click. |
| Notification Signals                                         | Continue demo2 | Sale: high when the cart contains the item. Place order. Pack is low (held without waking); Ship is medium (wakes idle). Explain why an inbox marker and a full delivered notification are different.                                                                           |
| State + Notification Signals, optional extended illustration | `pnpm demo3`   | Use the printed cues: house state, tool-driven changes, Doorbell, then Smoke alarm. Everything is simulated. It is not connected to real devices or emergency services. Allow model-dependent timing.                                                                           |
| Recap / optional agent-to-agent finale                       | `pnpm demo4`   | Two Studio panes, one user build instruction. State tracks todo → in review → changes requested → in review → approved. Notifications wake the other role; the reviewer is read-only. These “PR” numbers are fictional labels, not GitHub PRs.                                  |

The deck's Reactive Signals example is Mastra Code nested-instructions loading, not this project's cart/home processor. This project does not implement GitHub subscriptions, external integrations, cross-process ownership or restart durability. Do not substitute the finale for a demonstration of those features.

## Offline walkthrough

If the model/server fails, switch to the deck and source rather than debug indefinitely. Label this as a **source walkthrough**, not a recording or a successful live run:

1. **Send/queue/steer:** read `scripts/demo.ts`'s `demo1`: send starts a run; queued turns wait; one is cancelled; the steer is accepted into the same run; French runs afterward. Show the expected checks, not fabricated output.
2. **Shop:** run `pnpm test` locally (after installation). Its shop test calls the same cart processor: first snapshot, sale-price delta, removal delta, then re-snapshot when context lacks a snapshot. No model or notification delivery is exercised.
3. **Home:** read `src/mastra/home.ts`: the in-memory house feeds `StateLane`; tools edit it; device events call `sendNotificationSignal`. The notification and camera timeline is scripted simulation, not real hardware.
4. **Builder/reviewer:** the work-item unit test publishes the state cycle to two threads. Read `submitForReview` and `reviewerMessagePeer` in `src/mastra/index.ts` to explain how notification wake connects the roles. Unit tests do not prove autonomous agent behavior.

There are no recorded replay assets in this contribution. Plan separate recordings of the portable published-package setup before promising full offline replay.
