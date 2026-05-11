import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { DefaultExporter, Observability, SensitiveDataFilter } from '@mastra/observability';
import { policyReviewer } from './agents/policy-reviewer';
import { supportAgent } from './agents/support-agent';
import { policyGroundingScorer, supportCompletenessScorer } from './scorers/support-scorer';
import { storage } from './storage';
import { refundWorkflow } from './workflows/refund-workflow';

export const mastra = new Mastra({
  agents: {
    supportAgent,
    policyReviewer,
  },
  workflows: {
    refundWorkflow,
  },
  scorers: {
    supportCompletenessScorer,
    policyGroundingScorer,
  },
  storage,
  logger: new PinoLogger({
    name: 'mastra-101-masterclass',
    level: 'info',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra-101-masterclass',
        exporters: [new DefaultExporter()],
        spanOutputProcessors: [new SensitiveDataFilter()],
      },
    },
  }),
  server: {
    port: 4111,
  },
});
