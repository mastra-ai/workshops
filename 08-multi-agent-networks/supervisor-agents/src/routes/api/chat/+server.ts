import type { RequestHandler } from './$types';
import { handleChatStream } from '@mastra/ai-sdk';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { mastra } from '../../../mastra';
import {
  createDelegationTraceState,
  flushDelegationEvents,
  writeSupervisorTrace,
} from '../../../mastra/demo/chat-trace-helpers';

export const POST: RequestHandler = async ({ request }) => {
  const params = await request.json();
  const messages = Array.isArray(params.messages) ? params.messages : [];
  const threadId =
    typeof params.threadId === 'string' && params.threadId.length > 0 ? params.threadId : undefined;
  const resourceId =
    typeof params.resourceId === 'string' && params.resourceId.length > 0
      ? params.resourceId
      : undefined;
  const memory =
    threadId && resourceId
      ? {
          thread: threadId,
          resource: resourceId,
        }
      : undefined;
  const delegationTrace = createDelegationTraceState();

  const mastraStream = await handleChatStream({
    mastra,
    agentId: 'stack-advisor-supervisor',
    params: {
      ...params,
      messages,
      maxSteps: 6,
      memory,
      threadId,
      resourceId,
      delegation: {
        onDelegationStart: (context) => delegationTrace.handleDelegationStart(context).delegationResult,
        onDelegationComplete: (context) => ({
          feedback: delegationTrace.handleDelegationComplete(context).feedback,
        }),
        messageFilter: delegationTrace.messageFilter,
      },
    },
  });

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: ({ writer }) => {
      const supervisorTraceId = `supervisor-${Date.now()}`;
      writeSupervisorTrace({
        writer,
        traceId: supervisorTraceId,
        status: 'started',
        detail:
          'The browser request reached the supervisor. Delegation callbacks will stream into the trace pane as they happen.',
      });

      delegationTrace.setSupervisorTraceId(supervisorTraceId);

      let emittedCount = 0;

      const sendDelegationUpdates = (final = false) => {
        const startedEvent = delegationTrace.consumeSupervisorStartedEvent();

        if (startedEvent) {
          writer.write({
            type: 'data-supervisorTrace',
            data: startedEvent,
          });
        }

        emittedCount = flushDelegationEvents({
          writer,
          events: delegationTrace.events,
          emittedCount,
        });

        if (final) {
          writeSupervisorTrace({
            writer,
            traceId: `supervisor-finish-${Date.now()}`,
            status: 'completed',
            detail: 'The supervisor finished synthesis and streamed the final recommendation.',
          });
        }
      };

      const reader = mastraStream.getReader();

      const pump = async (): Promise<void> => {
        while (true) {
          const { done, value } = await reader.read();
          sendDelegationUpdates();

          if (done) {
            sendDelegationUpdates(true);
            break;
          }

          writer.merge(
            new ReadableStream({
              start(controller) {
                controller.enqueue(value as never);
                controller.close();
              },
            }),
          );
        }
      };

      return pump().catch((error) => {
        writeSupervisorTrace({
          writer,
          traceId: `supervisor-error-${Date.now()}`,
          status: 'failed',
          detail: error instanceof Error ? error.message : 'Unknown streaming error',
        });
        throw error;
      });
    },
  });

  return createUIMessageStreamResponse({ stream });
};
