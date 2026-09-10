import { createServer, request } from 'node:http';
import { mcpPath, metadataPath } from '../src/mastra/mcp/oauth.js';
import { oauthClientMetadata, oauthClientPath } from './clients/oauth-config.js';

export function createPublicGateway(baseUrl: string, resource: string, issuer: string, publishOAuthClient = false) {
  const upstream = new URL(baseUrl);
  if (upstream.protocol !== 'http:' || upstream.hostname !== '127.0.0.1') throw new Error('Gateway requires a loopback upstream');
  const allowedHeaders = new Set(['authorization', 'accept', 'content-type', 'mcp-protocol-version', 'mcp-method', 'mcp-name']);
  return createServer(async (req, res) => {
    const path = req.url?.split('?')[0];
    if (publishOAuthClient && path === oauthClientPath && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      res.end(JSON.stringify(oauthClientMetadata(resource)));
      return;
    }
    const allowed = (path === mcpPath && req.method === 'POST') || (path === metadataPath && req.method === 'GET');
    if (!allowed) { res.writeHead(404).end(); req.resume(); return; }
    try {
      const response = await fetch(new URL(metadataPath, upstream), { signal: AbortSignal.timeout(3000), redirect: 'error' });
      const metadata = await response.json();
      if (!response.ok || metadata.resource !== resource || metadata.authorization_servers?.length !== 1 || metadata.authorization_servers[0] !== issuer) {
        throw new Error('Upstream is not the configured OAuth resource');
      }
    } catch { res.writeHead(503).end(); req.resume(); return; }
    const proxy = request(new URL(path, upstream), {
      method: req.method,
      headers: Object.fromEntries(Object.entries(req.headers).filter(([name]) => allowedHeaders.has(name))),
    }, response => {
      for (const header of ['content-type', 'cache-control', 'www-authenticate']) {
        const value = response.headers[header];
        if (value) res.setHeader(header, value);
      }
      res.writeHead(response.statusCode ?? 502);
      response.on('error', () => res.destroy());
      response.pipe(res);
    });
    proxy.on('error', () => { if (!res.headersSent) res.writeHead(502); res.end(); });
    req.on('aborted', () => proxy.destroy());
    res.on('close', () => proxy.destroy());
    req.pipe(proxy);
  });
}
