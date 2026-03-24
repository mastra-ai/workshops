<script lang="ts">
  import { Streamdown } from 'svelte-streamdown';

  type Props = {
    markdown?: string;
    busy?: boolean;
    error?: string | null;
  };

  let { markdown = '', busy = false, error = null }: Props = $props();

  const hasContent = $derived(markdown.trim().length > 0);
</script>

<div class="flex h-full flex-col">
  <div class="border-b border-zinc-200 px-6 py-5">
    <p class="text-[0.68rem] font-semibold uppercase tracking-widest text-zinc-500">Supervisor synthesis</p>
    <div class="mt-1 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold tracking-tight text-zinc-950">Recommendation panel</h2>
      </div>
      <p
        class={`shrink-0 rounded-md border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${busy
          ? 'border-amber-200 bg-amber-50 text-amber-700'
          : 'border-zinc-200 bg-zinc-50 text-zinc-500'}`}
      >
        {busy ? 'Streaming' : hasContent ? 'Final output' : 'Ready'}
      </p>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto px-6 py-5">
    {#if error}
      <div class="rounded-xl border border-rose-200 bg-rose-50 px-5 py-5">
        <p class="text-sm font-semibold text-rose-950">The advisor run failed.</p>
        <p class="mt-2 text-sm leading-6 text-rose-800">{error}</p>
      </div>
    {:else if hasContent || busy}
      <div class="rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-4 py-4">
        {#if hasContent}
          <Streamdown
            content={markdown}
            class="streamdown-doc prose prose-li:my-1 prose-li:p-0 prose-ul:my-1 prose-p:my-1"
            parseIncompleteMarkdown={true}
            allowedLinkPrefixes={['*']}
            animation={{
              enabled: busy,
              type: 'fade',
              duration: 140,
              timingFunction: 'ease-out',
              tokenize: 'word',
              animateOnMount: false,
            }}
          />
        {:else}
          <div class="space-y-3">
            <div class="h-4 w-32 rounded bg-zinc-200/80"></div>
            <div class="h-4 w-full rounded bg-zinc-200/70"></div>
            <div class="h-4 w-[88%] rounded bg-zinc-200/70"></div>
            <div class="h-4 w-[72%] rounded bg-zinc-200/70"></div>
          </div>
        {/if}
      </div>
    {:else}
      <div class="flex h-full min-h-72 flex-col justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-6 py-8 text-center">
        <p class="text-sm font-medium text-zinc-900">Final recommendation appears here.</p>
      </div>
    {/if}
  </div>
</div>
