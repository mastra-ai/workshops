<script lang="ts">
  import type { TimelineItem } from '$lib/demo/types';

  type Props = {
    items: TimelineItem[];
    busy?: boolean;
  };

  let { items, busy = false }: Props = $props();

  const kindStyles: Record<TimelineItem['kind'], string> = {
    'supervisor-start': 'bg-amber-50/70',
    'delegation-start': 'bg-white',
    'delegation-update': 'bg-zinc-50/70',
    'delegation-complete': 'bg-emerald-50/70',
    'supervisor-finish': 'bg-zinc-100/80',
    status: 'bg-zinc-50',
    error: 'bg-rose-50/80',
  };

  const kindEyebrows: Record<TimelineItem['kind'], string> = {
    'supervisor-start': 'Supervisor',
    'delegation-start': 'Delegation started',
    'delegation-update': 'Delegation update',
    'delegation-complete': 'Delegation complete',
    'supervisor-finish': 'Supervisor synthesis',
    status: 'Status',
    error: 'Error',
  };
</script>

<div class="flex h-full flex-col">
  <div class="flex flex-col border-b border-zinc-200 px-6 py-5">
    <p class="text-[0.68rem] font-semibold uppercase tracking-widest text-zinc-500">Delegation trace</p>
    <div class="flex items-center justify-between mt-1">
      <h2 class="text-lg font-semibold tracking-tight text-zinc-950">Supervisor timeline</h2>
      {#if busy}
        <div class="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[0.68rem] font-semibold uppercase text-amber-700">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></span>
          Live
        </div>
      {/if}
    </div>
  </div>

  <div class="flex-1 overflow-y-auto px-6 py-5">
    {#if items.length === 0}
      <div class="flex h-full min-h-72 flex-col justify-center rounded-[1.75rem] border border-dashed border-zinc-200 bg-zinc-50/70 px-6 py-8 text-center">
        <p class="text-sm font-medium text-zinc-900">The trace appears here once the supervisor starts delegating.</p>
        <p class="mt-2 text-sm leading-6 text-zinc-600">
          Use a sample scenario or fill out the intake form to stream real delegation callbacks into this pane.
        </p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each items as item (item.id)}
          <article class={`rounded-[1.6rem] border border-zinc-200/80 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] ${kindStyles[item.kind]}`}>
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[0.68rem] font-semibold uppercase tracking-wider text-zinc-500">{kindEyebrows[item.kind]}</p>
                <p class="mt-2 text-sm font-semibold text-zinc-950">{item.title}</p>
              </div>
            </div>

            <p class="mt-3 text-sm leading-6 text-zinc-700">{item.detail}</p>

            {#if item.contextShared}
              <div class="mt-4 rounded-2xl border border-zinc-200 bg-white/80 px-3 py-3">
                <p class="text-[0.68rem] font-semibold uppercase tracking-wider text-zinc-500">Scoped context sent</p>
                <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{item.contextShared}</p>
              </div>
            {/if}
          </article>
        {/each}
      </div>
    {/if}
  </div>
</div>
