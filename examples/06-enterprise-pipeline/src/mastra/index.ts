import { Mastra } from '@mastra/core/mastra';
import { Workspace, LocalFilesystem } from '@mastra/core/workspace';
import { LibSQLStore } from '@mastra/libsql';
import { Observability, DefaultExporter } from '@mastra/observability';
import { join } from 'path';
import { enterpriseAgent } from './agents/enterprise-agent';

export const mastra = new Mastra({
  agents: { enterpriseAgent },
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: ':memory:',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'enterprise-pipeline',
        exporters: [new DefaultExporter()],
      },
    },
  }),
  workspace: new Workspace({
    filesystem: new LocalFilesystem({ basePath: join(process.cwd(), '../..') }),
  }),
});
