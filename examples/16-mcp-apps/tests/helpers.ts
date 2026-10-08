import { createServer } from 'node:http';
import type { MCPServer } from '@mastra/mcp';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';

// Exercise the actual HTTP protocol, not just a tool's execute function.
export async function withMcpClient<T>(server: MCPServer, test: (client: Client) => Promise<T>): Promise<T> {
  const http = createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    void server.startHTTP({ url, httpPath: '/mcp', req, res }).catch(error => {
      res.writeHead(500).end(String(error));
    });
  });
  await new Promise<void>(resolve => http.listen(0, '127.0.0.1', resolve));
  const address = http.address();
  if (!address || typeof address === 'string') throw new Error('Missing test server port');
  const client = new Client({ name: 'example-tests', version: '1.0.0' }, {
    versionNegotiation: { mode: { pin: '2026-07-28' } },
  });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${address.port}/mcp`)));
    return await test(client);
  } finally {
    await client.close();
    await server.close();
    http.closeAllConnections();
    await new Promise<void>((resolve, reject) => http.close(error => error ? reject(error) : resolve()));
  }
}
