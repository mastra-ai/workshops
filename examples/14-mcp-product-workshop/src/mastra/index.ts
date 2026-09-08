import { Mastra } from '@mastra/core/mastra';
import { authenticate, returnsRoutes } from './api/returns.js';
import { returnsModern, returnsLegacy } from './mcp/index.js';
import { processReturnWorkflow } from './workflows/returns.js';

export const mastra = new Mastra({
  bundler: { externals: ['@mastra/mcp'] },
  mcpServers: { returnsModern, returnsLegacy },
  workflows: { processReturnWorkflow },
  server: {
    port: Number(process.env.PORT ?? 4111), apiRoutes: returnsRoutes,
    middleware: [{
      path: '/api/mcp/:serverId/mcp',
      handler: async (c, next) => {
        try {
          const identity = authenticate(c.req.header('authorization'));
          c.get('requestContext').set('mastra__user', identity);
          c.get('requestContext').set('identity', identity);
        } catch { return c.json({ error: 'Authentication required.' }, 401); }
        await next();
      },
    }],
  },
});
