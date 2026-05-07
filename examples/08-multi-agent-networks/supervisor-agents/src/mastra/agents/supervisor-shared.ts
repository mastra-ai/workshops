import type { MessageFilterContext } from '@mastra/core/agent';

export const specialistNames: Record<string, string> = {
  'app-recommender': 'App Recommender',
  'security-reviewer': 'Security Reviewer',
  'operations-reviewer': 'Operations Reviewer',
};

export const specialistContextRules: Record<string, string> = {
  'app-recommender':
    'Pass only the user intake fields, target use cases, budget, and exclusion criteria relevant to application selection.',
  'security-reviewer':
    'Pass only the proposed stack shape, exposure model, authentication expectations, and backup approach needed for security review.',
  'operations-reviewer':
    'Pass only the proposed stack, expected maintenance capacity, migration context, and complexity tradeoffs needed for day-2 review.',
};

const extractMessageText = (message: MessageFilterContext['messages'][number]) => {
  const content = message.content as unknown;

  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .filter(
        (part): part is { type: 'text'; text: string } =>
          typeof part === 'object' && part !== null && 'type' in part && part.type === 'text' && 'text' in part,
      )
      .map((part) => part.text.trim())
      .filter(Boolean)
      .join('\n');
  }

  if (content && typeof content === 'object' && 'parts' in content && Array.isArray(content.parts)) {
    return content.parts
      .filter(
        (part): part is { type: 'text'; text: string } =>
          typeof part === 'object' && part !== null && 'type' in part && part.type === 'text' && 'text' in part,
      )
      .map((part) => part.text.trim())
      .filter(Boolean)
      .join('\n');
  }

  return '';
};

export const summarizeScopedContext = (messages: MessageFilterContext['messages'] = []) => {
  const recentText = messages
    .slice(-4)
    .map((message) => extractMessageText(message))
    .filter(Boolean)
    .join('\n');

  return recentText.slice(0, 600) || 'Scoped intake summary only.';
};

export const buildDelegationPrompt = ({
  primitiveId,
  prompt,
  scopedContextSummary,
}: {
  primitiveId: string;
  prompt: string;
  scopedContextSummary: string;
}) =>
  [
    `Supervisor delegation target: ${specialistNames[primitiveId] ?? primitiveId}`,
    'Use only the scoped information below. If critical context is missing, say so explicitly instead of inventing it.',
    'Return only the specialist output requested by your instructions.',
    `Delegation reason: ${specialistContextRules[primitiveId] ?? 'Use only the scoped intake required for this specialist.'}`,
    `Scoped context summary: ${scopedContextSummary}`,
    '',
    prompt,
  ].join('\n');
