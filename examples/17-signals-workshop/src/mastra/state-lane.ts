// A state lane computed by an input processor, modelled on core's TaskStateProcessor.
// The app writes plain values into a per-thread store; before each model step the processor
// compares the store with what the model already saw (last snapshot + deltas since) and emits:
//   - a snapshot when the window has no snapshot for this lane (first time, or it aged out),
//   - a delta with only the changed entries otherwise,
//   - nothing when nothing changed.
import type {
  ComputeStateSignalArgs,
  ComputeStateSignalResult,
} from "@mastra/core/processors";

type Values = Record<string, string>;
type Change = { key: string; from?: string; to: string };

export class StateLane {
  private store = new Map<string, Values>();
  readonly stateId: string;

  constructor(
    readonly id: string,
    private tags: { snapshot: string; delta: string },
  ) {
    this.stateId = id;
  }

  set(threadId: string, key: string, value: string) {
    this.store.set(threadId, { ...this.store.get(threadId), [key]: value });
  }
  get(threadId: string): Values {
    return { ...this.store.get(threadId) };
  }

  computeStateSignal(args: ComputeStateSignalArgs): ComputeStateSignalResult {
    const current = this.store.get(args.threadId);
    if (!current) return;

    // What the model currently sees: the last snapshot with each delta since applied.
    const seen: Values = {
      ...((args.lastSnapshot?.metadata?.value as Values | undefined) ?? {}),
    };
    for (const d of args.deltasSinceSnapshot ?? []) {
      for (const ch of (d.metadata?.delta as { changes?: Change[] } | undefined)
        ?.changes ?? [])
        seen[ch.key] = ch.to;
    }
    const changes: Change[] = Object.entries(current)
      .filter(([key, to]) => seen[key] !== to)
      .map(([key, to]) => ({ key, from: seen[key], to }));
    const cacheKey = `${this.id}:${JSON.stringify(Object.entries(current).sort())}`;

    if (!args.lastSnapshot || !args.contextWindow.hasSnapshot) {
      return {
        id: this.id,
        mode: "snapshot",
        tagName: this.tags.snapshot,
        cacheKey,
        contents: Object.entries(current)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n"),
        value: current,
        metadata: { value: current },
      };
    }
    if (changes.length === 0) return;
    return {
      id: this.id,
      mode: "delta",
      tagName: this.tags.delta,
      cacheKey,
      contents: changes
        .map((ch) => `${ch.key}: ${ch.from ?? "(new)"} → ${ch.to}`)
        .join("\n"),
      value: current,
      delta: { changes },
      metadata: { value: current, delta: { changes } },
    };
  }
}
