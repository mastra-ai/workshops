<script lang="ts">
  import type { SampleScenario } from '$lib/demo/types';

  type Props = {
    scenarios: SampleScenario[];
    activeScenarioId?: string;
    onSelect: (scenario: SampleScenario) => void;
  };

  let { scenarios, activeScenarioId, onSelect }: Props = $props();
</script>

<div class="space-y-4">
  <div class="space-y-1">
    <p class="text-[0.68rem] font-semibold uppercase tracking-widest text-zinc-500">Select a scenario</p>
    <h2 class="text-lg font-semibold tracking-tight text-zinc-950">Examples</h2>
  </div>

  <div class="grid gap-3">
    {#each scenarios as scenario (scenario.id)}
      <button
        type="button"
        class={`group rounded-2xl border px-4 py-4 text-left transition duration-150 active:scale-[0.99] ${
          scenario.id === activeScenarioId
            ? 'border-amber-300 bg-amber-50/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]'
            : 'border-zinc-200 bg-white/90 hover:border-zinc-300 hover:bg-zinc-50'
        }`}
        onclick={() => onSelect(scenario)}
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-2">
            <div>
              <p class="text-sm font-semibold text-zinc-950">{scenario.title}</p>
              <p class="mt-1 text-sm leading-6 text-zinc-600">{scenario.summary}</p>
            </div>

          </div>
        </div>
      </button>
    {/each}
  </div>
</div>
