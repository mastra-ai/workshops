import { z } from 'zod';

export function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key,
    /token|requestState|authorization|baggage|tracestate/i.test(key) ? '<redacted>' :
    ((key === 'id' && 'jsonrpc' in value) || /^(requestId|sessionId|runId|startedAt|endedAt)$/.test(key)) ? '<volatile>' : sanitize(item),
  ]));
  if (typeof value === 'string') return value.replace(/http:\/\/localhost:\d+/g, '<base-url>').replace(/workshop-(north|south)/g, '<fixture-token>');
  return value;
}
export type WireEvent = { direction: string; method?: string; status?: number; session?: boolean; body?: unknown };
export function recorder(events: WireEvent[]): typeof fetch {
  return async (input, init) => {
    const request = new Request(input, init);
    let method = request.method;
    if (request.method === 'POST') {
      const body = JSON.parse(await request.clone().text());
      method = z.object({ method: z.string() }).parse(body).method;
      events.push({ direction: 'request', method, session: request.headers.has('mcp-session-id'), body: sanitize(body) });
    }
    const response = await fetch(request);
    events.push({ direction: 'response', method, status: response.status, session: response.headers.has('mcp-session-id') });
    if (!response.body) return response;
    const sse = response.headers.get('content-type')?.includes('text/event-stream');
    const decoder = new TextDecoder();
    let buffer = '';
    function capture(text: string) { if (text.trim()) events.push({ direction: 'body', method, body: sanitize(JSON.parse(text)) }); }
    const body = response.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        if (sse) {
          const lines = buffer.split('\n'); buffer = lines.pop() ?? '';
          for (const line of lines) if (line.startsWith('data:')) capture(line.slice(5));
        }
        controller.enqueue(chunk);
      },
      flush() { buffer += decoder.decode(); if (!sse && response.headers.get('content-type')?.includes('json')) capture(buffer); },
    }));
    return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
  };
}
