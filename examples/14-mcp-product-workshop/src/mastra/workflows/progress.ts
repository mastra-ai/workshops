import type { RequestContext } from '@mastra/core/request-context';

export type StageReporter = (stage: string, progress: number) => Promise<void>;

// Ephemeral, application-owned callback: only the live wrapper call supplies it.
// This example does not persist, suspend or resume workflow runs.
export async function reportStage(context: RequestContext | undefined, stage: string, progress: number) {
  const reporter = context?.get('returns.stageReporter') as StageReporter | undefined;
  await reporter?.(stage, progress);
}
