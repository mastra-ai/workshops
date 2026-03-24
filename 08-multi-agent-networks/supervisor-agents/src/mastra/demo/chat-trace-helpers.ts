import type { UIMessageStreamWriter } from 'ai';
import type { DelegationCompleteContext, DelegationStartContext, MessageFilterContext } from '@mastra/core/agent';
import { buildDelegationPrompt, summarizeScopedContext } from '../agents/supervisor-shared';
import {
  buildCompletedDelegationEvent,
  buildStartedDelegationEvent,
  buildSupervisorTraceEvent,
  type TraceMessage,
} from './delegation-trace';
import type { DelegationTraceEvent, SupervisorTraceEvent } from './runtime-events';

// Demo-only bridge between Mastra delegation callbacks and the browser timeline stream.
export const createDelegationTraceState = () => {
  const delegationEvents: DelegationTraceEvent[] = [];
  let supervisorStartedEvent: SupervisorTraceEvent | null = null;
  let supervisorTraceId: string | null = null;

  return {
    events: delegationEvents,
    consumeSupervisorStartedEvent: () => {
      const event = supervisorStartedEvent;
      supervisorStartedEvent = null;
      return event;
    },
    setSupervisorStartedEvent: (event: SupervisorTraceEvent | null) => {
      supervisorStartedEvent = event;
    },
    setSupervisorTraceId: (traceId: string) => {
      supervisorTraceId = traceId;
    },
    handleDelegationStart: ({
      primitiveId,
      prompt,
      messages,
    }: Pick<DelegationStartContext, 'primitiveId' | 'prompt' | 'messages'>) => {
      const contextShared = summarizeScopedContext(messages);

      if (!supervisorStartedEvent) {
        supervisorStartedEvent = buildSupervisorTraceEvent({
          traceId: supervisorTraceId ?? `supervisor-${Date.now()}`,
          status: 'started',
          detail: contextShared,
        });
      }

      const event = buildStartedDelegationEvent({
        primitiveId,
        prompt,
        messages: messages as TraceMessage[],
      });

      delegationEvents.push(event);

      return {
        event,
        delegationResult: {
          modifiedPrompt: buildDelegationPrompt({
            primitiveId,
            prompt,
            scopedContextSummary: contextShared,
          }),
          modifiedMaxSteps: 2,
        },
      };
    },
    handleDelegationComplete: ({
      primitiveId,
      prompt,
      messages,
      success,
      result,
      error,
      duration,
    }: Pick<
      DelegationCompleteContext,
      'primitiveId' | 'prompt' | 'messages' | 'success' | 'result' | 'error' | 'duration'
    >) => {
      const index = delegationEvents.findIndex(
        (event) => event.specialistId === primitiveId && event.status === 'started',
      );
      const baseEvent =
        index === -1
          ? buildStartedDelegationEvent({
              primitiveId,
              prompt,
              messages: messages as TraceMessage[],
            })
          : delegationEvents[index];

      const completedEvent = buildCompletedDelegationEvent({
        baseEvent,
        success,
        summary: success ? result.text : error?.message,
        feedback: success ? undefined : error?.message,
        durationMs: duration,
      });

      if (index === -1) {
        delegationEvents.push(completedEvent);
      } else {
        delegationEvents[index] = completedEvent;
      }

      return {
        event: completedEvent,
        feedback: JSON.stringify(completedEvent),
      };
    },
    messageFilter: ({ messages }: Pick<MessageFilterContext, 'messages'>) => messages.slice(-6),
  };
};

export const writeSupervisorTrace = ({
  writer,
  traceId,
  status,
  detail,
}: {
  writer: UIMessageStreamWriter;
  traceId: string;
  status: 'started' | 'completed' | 'failed';
  detail: string;
}) => {
  const event = buildSupervisorTraceEvent({
    traceId,
    status,
    detail,
  });

  writer.write({
    type: 'data-supervisorTrace',
    data: event,
  });

  return event;
};

export const flushDelegationEvents = ({
  writer,
  events,
  emittedCount,
}: {
  writer: UIMessageStreamWriter;
  events: DelegationTraceEvent[];
  emittedCount: number;
}) => {
  let nextCount = emittedCount;

  while (nextCount < events.length) {
    writer.write({
      type: 'data-delegationTrace',
      data: events[nextCount],
    });
    nextCount += 1;
  }

  return nextCount;
};
