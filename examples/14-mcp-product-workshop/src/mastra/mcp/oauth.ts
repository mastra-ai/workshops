import { registerApiRoute, type Middleware } from '@mastra/core/server';
import { extractBearerToken, generateProtectedResourceMetadata, generateWWWAuthenticateHeader } from '@mastra/mcp';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { z } from 'zod';

export const mcpPath = '/api/mcp/returns-modern/mcp';
export const metadataPath = '/.well-known/oauth-protected-resource';
export const oauthConfigSchema = z.object({
  issuer: z.url(),
  resource: z.url(),
  jwksUrl: z.url(),
  users: z.record(z.string(), z.enum(['north', 'south'])),
});

export function createMcpOAuth(config: z.infer<typeof oauthConfigSchema>) {
  const jwks = createRemoteJWKSet(new URL(config.jwksUrl));
  const users = new Map(Object.entries(config.users));
  const metadata = generateProtectedResourceMetadata({
    resource: config.resource, authorizationServers: [config.issuer],
    resourceName: 'Returns Desk', scopesSupported: [],
  });
  const resourceMetadataUrl = new URL(metadataPath, config.resource).href;
  const middleware: Middleware = {
    path: mcpPath,
    handler: async (c, next) => {
      const token = extractBearerToken(c.req.header('authorization'));
      try {
        if (!token) throw new Error('Missing bearer token');
        const { payload } = await jwtVerify(token, jwks, {
          issuer: config.issuer, audience: config.resource, algorithms: ['RS256'], requiredClaims: ['sub', 'exp'],
        });
        const tenantId = payload.sub ? users.get(payload.sub) : undefined;
        if (!tenantId) return c.json({ error: 'access_denied' }, 403);
        c.get('requestContext').set('mastra__user', { tenantId, userId: payload.sub });
      } catch {
        c.header('WWW-Authenticate', generateWWWAuthenticateHeader({
          resourceMetadataUrl, additionalParams: token ? { error: 'invalid_token' } : {},
        }));
        return c.json({ error: 'unauthorized' }, 401);
      }
      await next();
    },
  };
  const metadataRoute = registerApiRoute(metadataPath, {
    method: 'GET', requiresAuth: false,
    handler: async c => c.json(metadata),
  });
  return { middleware, metadataRoute };
}
