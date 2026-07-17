import { z } from 'zod';

export const delegationTraceStatusSchema = z.enum(['started', 'completed', 'failed']);

export const delegationTraceEventSchema = z.object({
  traceId: z.string(),
  specialistId: z.string(),
  specialistName: z.string(),
  status: delegationTraceStatusSchema,
  reason: z.string(),
  contextShared: z.string(),
  prompt: z.string(),
  summary: z.string().optional(),
  durationMs: z.number().int().nonnegative().optional(),
  timestamp: z.string(),
});

export const supervisorTraceEventSchema = z.object({
  traceId: z.string(),
  status: z.enum(['started', 'completed', 'failed']),
  detail: z.string(),
  timestamp: z.string(),
});

export type DelegationTraceEvent = z.infer<typeof delegationTraceEventSchema>;
export type SupervisorTraceEvent = z.infer<typeof supervisorTraceEventSchema>;
