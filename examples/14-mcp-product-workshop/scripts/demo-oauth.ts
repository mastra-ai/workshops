import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { MCPClient, MCPOAuthClientProvider } from '@mastra/mcp';
import { noopObserve } from '@mastra/core/tools';
import { oauthClientMetadata } from './clients/oauth-config.js';

const resource = process.env.MCP_RESOURCE_URL;
if (!resource) throw new Error('MCP_RESOURCE_URL is required');
const metadata = oauthClientMetadata(resource);
const response = await fetch(metadata.client_id);
assert.equal(response.status, 200, 'Start serve:oauth with --oauth-check');
assert.deepEqual(await response.json(), metadata);

const provider = new MCPOAuthClientProvider({
  redirectUrl: metadata.redirect_uris[0],
  clientMetadataUrl: metadata.client_id,
  clientMetadata: metadata,
  onRedirectToAuthorization: url => {
    assert.equal(url.searchParams.get('client_id'), metadata.client_id);
    assert.equal(url.searchParams.get('resource'), resource);
    assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
    console.log('CIMD + resource audience + PKCE S256: verified. Complete sign-in in your browser.');
    if (process.platform === 'darwin') execFileSync('open', [url.href]);
    else console.log(url.href);
  },
});
const client = new MCPClient({ servers: { returns: { url: new URL(resource), authProvider: provider, protocolVersion: '2026-07-28' } } });
process.once('SIGINT', () => void client.disconnect());
process.once('SIGTERM', () => void client.disconnect());
try {
  await client.authenticate('returns', { timeoutMs: 7_200_000 });
  assert.equal(client.getServerAuthState('returns'), 'authorized');
  const tools = await client.listTools();
  assert.equal(Object.keys(tools).length, 5);
  const order = await tools.returns_getOrder.execute?.({ orderId: 'ORD-001' }, { observe: noopObserve });
  assert.deepEqual(order, { id: 'ORD-001', totalCents: 4900, ageDays: 5, status: 'delivered' });
  await client.resources.read('returns', 'returns://orders/ORD-001');
  console.log('OAUTH GREEN: real login, five tools, authorized order and resource. No tokens saved.');
} finally {
  await client.disconnect();
}
