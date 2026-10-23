# Presenter cues

Use these cues with the [Signals deck](../../slides/signals-workshop/index.tsx). Each demo highlights a different way to update an agent's context while it works.

| Deck cue                                        | Demo           | Say and show                                                                                                                                                                                                                                             |
| ----------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Observe / Send / Queue, then “See it in action” | `pnpm demo1`   | Start one research run, queue two turns, cancel the summary, steer with pricing, then watch the French follow-up run separately. Distinguish message acceptance from run completion.                                                                     |
| State Signals / Prompt Cache                    | `pnpm demo2`   | Add oat milk and coffee; ask about breakfast. Edit quantities or remove an item; ask again. Show the initial snapshot, changed-only delta and fresh snapshot after the old snapshot leaves context. The processor computes state before each model step. |
| Notification Signals                            | Continue demo2 | Trigger a sale for an item in the cart, then place an order. Pack is low priority and held without waking the agent; Ship is medium priority and wakes an idle agent. Compare the inbox marker with a delivered notification.                            |
| State + Notification Signals                    | `pnpm demo3`   | Follow the printed house-state, tool, Doorbell and Smoke alarm cues. The dashboard simulates devices and events; it is not connected to real hardware or emergency services.                                                                             |
| Recap / agent-to-agent finale                   | `pnpm demo4`   | Open the builder and reviewer panes and send one build instruction. Follow todo → in review → changes requested → in review → approved. State tracks the work item; notifications wake the other role. The reviewer has read-only filesystem access.     |

The deck's Reactive Signals example covers Mastra Code nested-instructions loading. The cart, home and work-item demos here focus on state processors and notifications. The builder/reviewer demo uses fictional review labels; it does not create GitHub pull requests.

## Offline walkthrough

Use the source and deterministic tests to explain the flows without provider access. Run `pnpm test` after installation; it needs neither a model key nor a running server.

1. **Send/queue/steer:** follow `demo1` in `scripts/demo.ts`. Send starts a run, queued turns wait, cancellation removes one turn, and steering joins the active run. The French follow-up runs afterward.
2. **Shop:** follow the cart processor in `src/mastra/shop.ts` and its tests: initial snapshot, sale-price delta, removal delta and a new snapshot when context no longer contains one.
3. **Home:** follow `src/mastra/home.ts`. The in-memory house feeds `StateLane`, tools edit device state, and simulated events call `sendNotificationSignal`.
4. **Builder/reviewer:** follow the work-item transition test, then `submitForReview` and `reviewerMessagePeer` in `src/mastra/index.ts`. Shared state tracks progress while notifications connect the two roles.
