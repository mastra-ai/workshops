import { createServer } from 'node:http';
import { once } from 'node:events';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { startServer } from '../scripts/server.js';
import { createPublicGateway } from '../scripts/public-gateway.js';

const keys = await generateKeyPair('RS256');
const publicKey = { ...await exportJWK(keys.publicKey), kid: 'test', alg: 'RS256', use: 'sig' };
const issuerServer = createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ keys: [publicKey] }));
});
let issuer: string;
let server: Awaited<ReturnType<typeof startServer>>;
let gateway: ReturnType<typeof createPublicGateway>;
let publicUrl: string;
const resource = 'https://returns.test/api/mcp/returns-modern/mcp';
beforeAll(async () => {
  issuerServer.listen(0, '127.0.0.1');
  await once(issuerServer, 'listening');
  const address = issuerServer.address();
  if (!address || typeof address === 'string') throw new Error('No issuer port');
  issuer = `http://127.0.0.1:${address.port}`;
  server = await startServer({ MCP_AUTH_MODE: 'workos', WORKOS_ISSUER: issuer, WORKOS_JWKS_URL: issuer,
    MCP_RESOURCE_URL: resource, MCP_USER_TENANTS: JSON.stringify({ 'user-north': 'north' }) });
  gateway = createPublicGateway(server.baseUrl, resource, issuer);
  gateway.listen(0, '127.0.0.1');
  await once(gateway, 'listening');
  const gatewayAddress = gateway.address();
  if (!gatewayAddress || typeof gatewayAddress === 'string') throw new Error('No gateway port');
  publicUrl = `http://127.0.0.1:${gatewayAddress.port}`;
}, 90_000);
afterAll(async () => { gateway?.close(); gateway?.closeAllConnections(); await server?.close(); issuerServer.close(); });
const token = (options: { issuer?: string; audience?: string; subject?: string; expires?: number } = {}) =>
  new SignJWT({}).setProtectedHeader({ alg: 'RS256', kid: 'test' }).setIssuedAt()
    .setIssuer(options.issuer ?? issuer).setAudience(options.audience ?? resource)
    .setSubject(options.subject ?? 'user-north').setExpirationTime(options.expires ?? Math.floor(Date.now() / 1000) + 60)
    .sign(keys.privateKey);
const call = (value?: string) => fetch(`${publicUrl}/api/mcp/returns-modern/mcp`, {
  method: 'POST', headers: value ? { authorization: `Bearer ${value}` } : {}, body: '{}',
});

test('advertises the configured issuer and exact resource, not a client-supplied host', async () => {
  const response = await call();
  expect(response.status).toBe(401);
  expect(response.headers.get('www-authenticate')).toContain('https://returns.test/.well-known/oauth-protected-resource');
  const metadata = await fetch(`${server.baseUrl}/.well-known/oauth-protected-resource`).then(r => r.json());
  expect(metadata).toMatchObject({ resource, authorization_servers: [issuer] });
});
test('gateway exposes no Studio, REST, tool-execution or legacy transport routes', async () => {
  for (const path of ['/', '/traces', '/api/tools', '/api/mcp/returns-modern/tools/getOrder/execute', '/returns/orders/ORD-001', '/api/mcp/returns-modern/sse']) {
    for (const method of ['GET', 'POST']) expect((await fetch(publicUrl + path, { method })).status).toBe(404);
  }
  expect((await fetch(`${publicUrl}/.well-known/oauth-protected-resource`)).status).toBe(200);
});
test('gateway fails closed when upstream resource metadata does not match', async () => {
  const blocked = createPublicGateway(server.baseUrl, `${resource}/other`, issuer);
  blocked.listen(0, '127.0.0.1');
  await once(blocked, 'listening');
  try {
    const address = blocked.address();
    if (!address || typeof address === 'string') throw new Error('No gateway port');
    expect((await fetch(`http://127.0.0.1:${address.port}/.well-known/oauth-protected-resource`)).status).toBe(503);
  } finally { blocked.close(); blocked.closeAllConnections(); }
});
test('rejects fixture, malformed, expired, wrong-issuer and wrong-audience tokens', async () => {
  for (const value of ['workshop-north', 'not-a-jwt', await token({ expires: 1 }), await token({ issuer: 'https://wrong.test' }), await token({ audience: 'https://wrong.test' })]) {
    expect((await call(value)).status).toBe(401);
  }
  const jwt = await token();
  const [header, payload, signature] = jwt.split('.');
  expect((await call(`${header}.${payload}.${signature?.startsWith('A') ? 'B' : 'A'}${signature?.slice(1)}`)).status).toBe(401);
});
test('denies authenticated users without a tenant mapping', async () => {
  for (const subject of ['unknown', 'toString', '__proto__']) {
    expect((await call(await token({ subject }))).status).toBe(403);
  }
});
test('propagates the verified identity to MCP tools and resource authorization', async () => {
  const client = new Client({ name: 'oauth-test', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(`${publicUrl}/api/mcp/returns-modern/mcp`), {
      requestInit: { headers: { authorization: `Bearer ${await token()}` } },
    }));
    expect((await client.callTool({ name: 'getOrder', arguments: { orderId: 'ORD-001' } })).structuredContent).toMatchObject({ id: 'ORD-001' });
    expect((await client.callTool({ name: 'getOrder', arguments: { orderId: 'ORD-005' } })).isError).toBe(true);
    expect((await client.readResource({ uri: 'returns://orders/ORD-001' })).contents).toHaveLength(1);
    await expect(client.readResource({ uri: 'returns://orders/ORD-005' })).rejects.toThrow();
  } finally { await client.close(); }
});
