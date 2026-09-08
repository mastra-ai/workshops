import { Mastra } from '@mastra/core/mastra';
import { authenticate, returnsRoutes } from './api/returns.js';
import { returnsModern, returnsLegacy } from './mcp/index.js';

export const mastra = new Mastra({
  bundler: { externals: ['@mastra/mcp'] },
  mcpServers: { returnsModern, returnsLegacy },
  // The workflow is exposed through authenticated MCP only, not a second API.
  server: {
    port: Number(process.env.PORT ?? 4111), apiRoutes: returnsRoutes,
    middleware: [{
      path: '/api/mcp/*',
      handler: async (c, next) => {
        // Registry metadata is public for Studio; execution and transports are not.
        if (c.req.method === 'GET' && c.req.path.startsWith('/api/mcp/v0/servers')) { await next(); return; }
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
