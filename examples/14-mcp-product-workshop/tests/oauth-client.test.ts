import { once } from 'node:events';
import { expect, test } from 'vitest';
import { createPublicGateway } from '../scripts/public-gateway.js';
import { oauthClientMetadata, oauthClientPath } from '../scripts/clients/oauth-config.js';

const resource = 'https://returns.test/api/mcp/returns-modern/mcp';
test.each([false, true])('CIMD rehearsal endpoint is opt-in (%s) and read-only', async enabled => {
  const gateway = createPublicGateway('http://127.0.0.1:1', resource, 'https://issuer.test', enabled);
  gateway.listen(0, '127.0.0.1');
  await once(gateway, 'listening');
  try {
    const address = gateway.address();
    if (!address || typeof address === 'string') throw new Error('No gateway port');
    const base = `http://127.0.0.1:${address.port}`;
    const response = await fetch(base + oauthClientPath);
    expect(response.status).toBe(enabled ? 200 : 404);
    if (enabled) {
      const metadata = await response.json();
      expect(metadata).toEqual(oauthClientMetadata(resource));
      expect(metadata.client_id).toBe('https://returns.test/oauth-client.json');
      expect(metadata.redirect_uris).toEqual(['http://localhost:8090/callback']);
    }
    expect((await fetch(base + oauthClientPath, { method: 'POST' })).status).toBe(404);
    expect((await fetch(base + '/api/tools')).status).toBe(404);
  } finally { gateway.close(); gateway.closeAllConnections(); }
});
