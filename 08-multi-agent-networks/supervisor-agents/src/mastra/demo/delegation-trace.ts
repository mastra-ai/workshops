import {
  delegationTraceEventSchema,
  supervisorTraceEventSchema,
  type DelegationTraceEvent,
  type SupervisorTraceEvent,
} from './runtime-events';
import { specialistContextRules, specialistNames, summarizeScopedContext } from '../agents/supervisor-shared';

export type TraceMessage = {
  content?: {
    parts?: Array<{
      type?: string;
      text?: string;
    }>;
  };
};

// Demo-only helpers for the browser trace stream live here so src/mastra/agents stays focused on core supervisor behavior.
export const buildStartedDelegationEvent = ({
  primitiveId,
  prompt,
  messages,
}: {
  primitiveId: string;
  prompt: string;
  messages: TraceMessage[];
}): DelegationTraceEvent =>
  delegationTraceEventSchema.parse({
    traceId: `${primitiveId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    specialistId: primitiveId,
    specialistName: specialistNames[primitiveId] ?? primitiveId,
    status: 'started',
    reason: specialistContextRules[primitiveId] ?? 'Use only the scoped intake required for this specialist.',
    contextShared: summarizeScopedContext(messages as never),
    prompt: prompt.slice(0, 1200),
    timestamp: new Date().toISOString(),
  });

export const buildCompletedDelegationEvent = ({
  baseEvent,
  success,
  summary,
  durationMs,
  feedback,
}: {
  baseEvent: DelegationTraceEvent;
  success: boolean;
  summary?: string;
  durationMs?: number;
  feedback?: string;
}): DelegationTraceEvent =>
  delegationTraceEventSchema.parse({
    ...baseEvent,
    status: success ? 'completed' : 'failed',
    summary: summary?.slice(0, 1200),
    feedback: feedback?.slice(0, 1200),
    durationMs,
    timestamp: new Date().toISOString(),
  });

export const buildSupervisorTraceEvent = ({
  traceId,
  status,
  detail,
}: {
  traceId: string;
  status: SupervisorTraceEvent['status'];
  detail: string;
}): SupervisorTraceEvent =>
  supervisorTraceEventSchema.parse({
    traceId,
    status,
    detail,
    timestamp: new Date().toISOString(),
  });
