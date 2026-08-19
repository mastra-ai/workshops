
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { DuckDBStore } from "@mastra/duckdb";
import { MastraCompositeStore } from '@mastra/core/storage';
import { Observability, MastraStorageExporter, MastraPlatformExporter, SensitiveDataFilter } from '@mastra/observability';
import { BraintrustExporter } from '@mastra/braintrust';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { supportAgent } from './agents/support-agent';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';
import { policyLeakScorer, toolNameLeakScorer } from './scorers/support-scorers';

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, supportAgent },
  scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer, policyLeakScorer, toolNameLeakScorer },
  storage: new MastraCompositeStore({
    id: 'composite-storage',
    default: new LibSQLStore({
      id: "mastra-storage",
      url: "file:./mastra.db",
    }),
    domains: {
      observability: await new DuckDBStore().getStore('observability'),
    }
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra',
        exporters: [
          new MastraStorageExporter(), // Persists observability events to Mastra Storage
          new MastraPlatformExporter(), // Sends observability events to Mastra Platform (if MASTRA_PLATFORM_ACCESS_TOKEN is set)
          // Sends traces to Braintrust for evaluation/scoring (needs BRAINTRUST_API_KEY).
          new BraintrustExporter({
            apiKey: process.env.BRAINTRUST_API_KEY,
            projectName: process.env.BRAINTRUST_PROJECT_NAME ?? 'training-demo',
          }),
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  }),
});
