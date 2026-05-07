export const advisorMemoryResource = 'self-hosting-stack-advisor-demo';

export const createAdvisorThreadId = () =>
  `advisor-thread-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
