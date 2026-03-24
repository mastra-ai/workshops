<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { DefaultChatTransport } from 'ai';
  import { delegationTraceEventSchema, supervisorTraceEventSchema } from '../mastra/demo/runtime-events';
  import AdvisorForm from '$lib/demo/components/AdvisorForm.svelte';
  import DelegationTimeline from '$lib/demo/components/DelegationTimeline.svelte';
  import RecommendationPanel from '$lib/demo/components/RecommendationPanel.svelte';
  import ScenarioPicker from '$lib/demo/components/ScenarioPicker.svelte';
  import { advisorMemoryResource, createAdvisorThreadId } from '$lib/demo/chat-memory';
  import {
    buildAdvisorPrompt,
    buildDelegationTimelineItem,
    buildSupervisorTimelineItem,
    defaultFormValues,
    extractAssistantText,
    timelineLabel,
    upsertTimelineItem,
  } from '$lib/demo/page-state';
  import { sampleScenarios } from '$lib/demo/sample-scenarios';
  import {
    type AdvisorChatMessage,
    type RuntimeDelegationTrace,
    type RuntimeSupervisorTrace,
    type TimelineItem,
  } from '$lib/demo/types';

  const initialScenario = sampleScenarios[0];

  let formValues = $state(initialScenario ? { ...initialScenario.formValues } : defaultFormValues());
  let activeScenarioId = $state<string | undefined>(initialScenario?.id);
  let timeline = $state<TimelineItem[]>([]);
  let recommendation = $state('');
  let runError = $state<string | null>(null);
  let runCounter = 0;
  let threadId = $state(createAdvisorThreadId());

  function syncRecommendationFromMessages(messages: AdvisorChatMessage[]) {
    recommendation = extractAssistantText(messages);
  }

  $effect(() => {
    syncRecommendationFromMessages(chat.messages as AdvisorChatMessage[]);
  });

  const chat = new Chat<AdvisorChatMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ messages, body }) => ({
        body: {
          ...body,
          messages,
          resourceId: advisorMemoryResource,
          threadId,
          memory: {
            resource: advisorMemoryResource,
            thread: threadId,
          },
        },
      }),
    }),
    dataPartSchemas: {
      delegationTrace: delegationTraceEventSchema,
      supervisorTrace: supervisorTraceEventSchema,
    },
    onData: (dataPart) => {
      if (dataPart.type === 'data-supervisorTrace') {
        timeline = upsertTimelineItem(
          timeline,
          buildSupervisorTimelineItem(dataPart.data as RuntimeSupervisorTrace),
        );
      }

      if (dataPart.type === 'data-delegationTrace') {
        timeline = upsertTimelineItem(
          timeline,
          buildDelegationTimelineItem(dataPart.data as RuntimeDelegationTrace),
        );
      }
    },
    onFinish: ({ messages }) => {
      syncRecommendationFromMessages(messages as AdvisorChatMessage[]);
    },
    onError: (error) => {
      runError = error instanceof Error ? error.message : 'Unknown streaming error';
      timeline = upsertTimelineItem(timeline, {
        id: `error-${runCounter}`,
        kind: 'error',
        title: 'Advisor run failed',
        detail: runError,
        timestampLabel: timelineLabel(),
      });
    },
  });

  const isBusy = $derived(chat.status === 'submitted' || chat.status === 'streaming');

  function applyScenario(scenario: (typeof sampleScenarios)[number]) {
    activeScenarioId = scenario.id;
    formValues = { ...scenario.formValues };
  }

  function selectedScenarioPrompt() {
    return sampleScenarios.find((scenario) => scenario.id === activeScenarioId)?.prompt;
  }

  async function runAdvisor() {
    runCounter += 1;
    runError = null;
    recommendation = '';
    timeline = [];
    threadId = createAdvisorThreadId();

    const prompt = selectedScenarioPrompt() ?? buildAdvisorPrompt(formValues);

    await chat.sendMessage({ text: prompt });
  }

  function resetForm() {
    formValues = defaultFormValues();
    activeScenarioId = undefined;
    timeline = [];
    recommendation = '';
    runError = null;
    threadId = createAdvisorThreadId();
  }

</script>

<svelte:head>
  <title>Self-Hosting Stack Advisor</title>
  <meta
    name="description"
    content="Workshop-ready supervisor agent demo for turning self-hosting requests into tailored stack recommendations."
  />
</svelte:head>

<div class="min-h-dvh bg-(--app-canvas) text-zinc-950">
  <div class="mx-auto flex min-h-dvh max-w-425 flex-col px-4 py-4 md:px-6 lg:px-8">
    <header class="grid gap-6 border-b border-zinc-200/80 pb-8 pt-6 xl:grid-cols-[1.2fr_0.8fr] lg:items-end">
      <div class="space-y-4">
        <p class="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-700">
          Supervisor agent workshop demo
        </p>
        <div class="max-w-3xl space-y-4">
          <h1 class="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-5xl">
            Self-Hosting Stack Advisor
          </h1>
          <p class="max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
            A top-level Mastra supervisor decides when to involve app, security, and operations specialists, then synthesizes one browser-streamed recommendation.
          </p>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <div class="rounded-[1.6rem] border border-zinc-200 bg-white px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <p class="text-[0.68rem] font-semibold uppercase tracking-wider text-zinc-500">Entry point</p>
          <p class="mt-3 text-sm font-medium text-zinc-900">/api/chat</p>
          <p class="mt-2 text-sm leading-6 text-zinc-600">Stream route layered over Mastra with runtime trace events.</p>
        </div>
        <div class="rounded-[1.6rem] border border-zinc-200 bg-white px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <p class="text-[0.68rem] font-semibold uppercase tracking-wider text-zinc-500">Model</p>
          <p class="mt-3 text-sm font-medium text-zinc-900">gpt-5.4 & gpt-5.4-mini</p>
          <p class="mt-2 text-sm leading-6 text-zinc-600">Used by the supervisor and every specialist.</p>
        </div>
        <div class="rounded-[1.6rem] border border-zinc-200 bg-white px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <p class="text-[0.68rem] font-semibold uppercase tracking-wider text-zinc-500">Trace mode</p>
          <p class="mt-3 text-sm font-medium text-zinc-900">Live delegation callbacks</p>
          <p class="mt-2 text-sm leading-6 text-zinc-600">Timeline items come from streamed supervisor events.</p>
        </div>
      </div>
    </header>

    <main class="grid flex-1 gap-4 py-4 xl:grid-cols-[0.9fr_0.9fr_1.5fr]">
      <section class="flex min-h-152 flex-col overflow-hidden rounded-4xl border border-zinc-200/80 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
        <div class="border-b border-zinc-200 px-6 py-5">
          <p class="text-[0.68rem] font-semibold uppercase tracking-widest text-zinc-500">Structured intake</p>
          <h2 class="mt-1 text-lg font-semibold tracking-tight text-zinc-950">Problem framing</h2>
        </div>
        <div class="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <ScenarioPicker scenarios={sampleScenarios} activeScenarioId={activeScenarioId} onSelect={applyScenario} />
          <AdvisorForm values={formValues} disabled={isBusy} onSubmit={runAdvisor} onReset={resetForm} />
        </div>
      </section>

      <section class="min-h-152 overflow-hidden rounded-4xl border border-zinc-200/80 bg-(--app-panel-muted) shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
        <DelegationTimeline items={timeline} busy={isBusy} />
      </section>

      <section class="min-h-152 overflow-hidden rounded-4xl border border-zinc-200/80 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
        <RecommendationPanel markdown={recommendation} busy={isBusy} error={runError} />
      </section>
    </main>
  </div>
</div>
