import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { MastraCompositeStore } from '@mastra/core/storage';
import { DuckDBStore } from '@mastra/duckdb';
import { Observability, MastraStorageExporter, SensitiveDataFilter } from '@mastra/observability';
import { createMcpOAuth, mcpPath, oauthConfigSchema } from './mcp/oauth.js';
import { fixtureIdentity } from './auth-fixture.js';
import { returnsRoutes } from './api/returns.js';
import { capabilities, returnsModern } from './mcp/index.js';
import { processReturnWorkflow } from './workflows/returns.js';
import { supportAgent } from './agents/support.js';

const oauth = process.env.MCP_AUTH_MODE === 'workos' ? createMcpOAuth(oauthConfigSchema.parse({
  issuer: process.env.WORKOS_ISSUER,
  resource: process.env.MCP_RESOURCE_URL,
  jwksUrl: process.env.WORKOS_JWKS_URL,
  users: JSON.parse(process.env.MCP_USER_TENANTS ?? '{}'),
})) : undefined;

mkdirSync('.runtime', { recursive: true });
const dbPath = resolve(process.env.MASTRA_DB ?? '.runtime/returns.db');
export const traceExporter = new MastraStorageExporter({ maxBatchWaitMs: 200 });

export const mastra = new Mastra({
  bundler: { externals: ['@mastra/mcp'] },
  tools: capabilities.tools,
  mcpServers: { returnsModern },
  ...(process.env.DEMO_AGENT === '1' ? { agents: { supportAgent } } : {}),
  workflows: { processReturnWorkflow },
  storage: new MastraCompositeStore({
    id: 'returns-storage',
    default: new LibSQLStore({ id: 'returns-libsql', url: `file:${dbPath}` }),
    domains: {
      observability: await new DuckDBStore({ path: `${dbPath}.duckdb` }).getStore('observability'),
    },
  }),
  observability: new Observability({ configs: { local: {
    serviceName: 'returns-desk', exporters: [traceExporter], spanOutputProcessors: [new SensitiveDataFilter()],
  } } }),
  server: {
    host: '127.0.0.1', port: Number(process.env.PORT ?? 4111),
    apiRoutes: [...returnsRoutes, ...(oauth ? [oauth.metadataRoute] : [])],
    middleware: [
      ...(oauth ? [oauth.middleware] : []),
      { path: '/api/*', handler: async (c, next) => {
        const isMcp = c.req.path === mcpPath;
        if ((isMcp && oauth) || (!isMcp && c.req.method === 'GET')) { await next(); return; }
        try { c.get('requestContext').set('mastra__user', await fixtureIdentity(c.req.header('authorization'))); }
        catch { return c.json({ error: 'Authentication required.' }, 401); }
        await next();
      } },
    ],
  },
});
