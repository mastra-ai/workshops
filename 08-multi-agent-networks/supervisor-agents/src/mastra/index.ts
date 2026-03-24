import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import { appRecommenderAgent } from './agents/app-recommender';
import { stackAdvisorSupervisorAgent } from './agents/stack-advisor-supervisor';
import { operationsReviewerAgent } from './agents/operations-reviewer';
import { securityReviewerAgent } from './agents/security-reviewer';

export const mastra = new Mastra({
  agents: {
    stackAdvisorSupervisorAgent,
    appRecommenderAgent,
    securityReviewerAgent,
    operationsReviewerAgent,
  },
  storage: new LibSQLStore({
    id: 'workshop-supervisor-agents-demo',
    url: 'file:./mastra.db',
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
