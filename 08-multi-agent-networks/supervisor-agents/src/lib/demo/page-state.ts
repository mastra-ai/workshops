import type {
  AdvisorChatMessage,
  AdvisorFormValues,
  RuntimeDelegationTrace,
  RuntimeSupervisorTrace,
  TimelineItem,
} from './types';

export const defaultFormValues = (): AdvisorFormValues => ({
  goal: '',
  users: '',
  budget: '',
  hardware: '',
  existingSetup: '',
  preferences: '',
  constraints: '',
  skillLevel: 'intermediate',
  privacyPosture: 'balanced',
  internetExposure: 'limited',
});

export const timelineLabel = (timestamp = new Date().toISOString()) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

export const buildAdvisorPrompt = (values: AdvisorFormValues) => `
Create a self-hosting stack recommendation using this intake.

Goal:
${values.goal || 'Not specified'}

Users / scale:
${values.users || 'Not specified'}

Budget:
${values.budget || 'Not specified'}

Hardware:
${values.hardware || 'Not specified'}

Existing setup:
${values.existingSetup || 'Not specified'}

Preferences:
${values.preferences || 'Not specified'}

Constraints:
${values.constraints || 'Not specified'}

Skill level: ${values.skillLevel}
Privacy posture: ${values.privacyPosture}
Internet exposure: ${values.internetExposure}
`.trim();

export function extractAssistantText(messages: AdvisorChatMessage[]): string {
  return messages
    .filter((message) => message.role === 'assistant')
    .flatMap((message) => message.parts)
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
    .trim();
}

export function upsertTimelineItem(items: TimelineItem[], item: TimelineItem): TimelineItem[] {
  const index = items.findIndex((entry) => entry.id === item.id);

  if (index === -1) {
    return [...items, item];
  }

  const nextItems = [...items];
  nextItems[index] = item;
  return nextItems;
}

export function buildSupervisorTimelineItem(trace: RuntimeSupervisorTrace): TimelineItem {
  const isStarted = trace.status === 'started';
  const startedStatusMessage =
    'The browser request reached the supervisor. Delegation callbacks will stream into the trace pane as they happen.';

  return {
    id: trace.traceId,
    kind: trace.status === 'completed' ? 'supervisor-finish' : trace.status === 'failed' ? 'error' : 'supervisor-start',
    title:
      trace.status === 'completed'
        ? 'Supervisor synthesized final recommendation'
        : trace.status === 'failed'
          ? 'Supervisor failed'
          : 'Supervisor intake started',
    detail: isStarted ? startedStatusMessage : trace.detail,
    contextShared: isStarted && trace.detail !== startedStatusMessage ? trace.detail : undefined,
    timestampLabel: timelineLabel(trace.timestamp),
  };
}

export function buildDelegationTimelineItem(trace: RuntimeDelegationTrace): TimelineItem {
  return {
    id: trace.traceId,
    kind:
      trace.status === 'started'
        ? 'delegation-start'
        : trace.status === 'failed'
          ? 'error'
          : 'delegation-complete',
    title:
      trace.status === 'started'
        ? `Supervisor delegated to ${trace.specialistName}`
        : trace.status === 'failed'
          ? `${trace.specialistName} returned an error`
          : `${trace.specialistName} returned scoped guidance`,
    detail:
      trace.status === 'started'
        ? trace.reason
        : trace.summary || trace.feedback || 'The specialist completed successfully.',
    specialist: trace.specialistName,
    timestampLabel: timelineLabel(trace.timestamp),
  };
}
