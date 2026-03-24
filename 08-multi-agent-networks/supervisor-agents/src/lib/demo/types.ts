import type { UIMessage } from '@ai-sdk/svelte';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type PrivacyPosture = 'low' | 'balanced' | 'high';
export type InternetExposure = 'none' | 'limited' | 'public';

export type AdvisorFormValues = {
  goal: string;
  users: string;
  budget: string;
  hardware: string;
  existingSetup: string;
  preferences: string;
  constraints: string;
  skillLevel: SkillLevel;
  privacyPosture: PrivacyPosture;
  internetExposure: InternetExposure;
};

export type SampleScenario = {
  id: string;
  title: string;
  summary: string;
  prompt: string;
  formValues: AdvisorFormValues;
};

export type RuntimeDelegationTrace = {
  traceId: string;
  specialistId: string;
  specialistName: string;
  status: 'started' | 'completed' | 'failed';
  reason: string;
  contextShared: string;
  prompt: string;
  summary?: string;
  durationMs?: number;
  feedback?: string;
  timestamp: string;
};

export type RuntimeSupervisorTrace = {
  traceId: string;
  status: 'started' | 'completed' | 'failed';
  detail: string;
  timestamp: string;
};

export type AdvisorDataParts = {
  delegationTrace: RuntimeDelegationTrace;
  supervisorTrace: RuntimeSupervisorTrace;
};

export type TimelineItemKind =
  | 'supervisor-start'
  | 'delegation-start'
  | 'delegation-update'
  | 'delegation-complete'
  | 'supervisor-finish'
  | 'status'
  | 'error';

export type TimelineItem = {
  id: string;
  kind: TimelineItemKind;
  title: string;
  detail: string;
  specialist?: string;
  contextShared?: string;
  timestampLabel: string;
};

export type AdvisorRunState = {
  prompt: string;
  timeline: TimelineItem[];
  recommendation: string;
  rawResponse: string;
};

export type AdvisorChatMessage = UIMessage<never, AdvisorDataParts>;
