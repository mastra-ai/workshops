import { Mastra } from '@mastra/core/mastra';
import { Workspace, LocalFilesystem } from '@mastra/core/workspace';
import { LibSQLStore } from '@mastra/libsql';
import { Observability, DefaultExporter } from '@mastra/observability';
import { join } from 'path';
import { smartAgent } from './agents/smart-agent';

export const mastra = new Mastra({
  agents: { smartAgent },
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: ':memory:',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'beyond-guardrails',
        exporters: [new DefaultExporter()],
      },
    },
  }),
  workspace: new Workspace({
    filesystem: new LocalFilesystem({ basePath: join(process.cwd(), '../..') }),
  }),
});
