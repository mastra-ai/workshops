import { App, applyDocumentTheme, applyHostStyleVariables } from '@modelcontextprotocol/ext-apps';
import type { McpUiHostContext } from '@modelcontextprotocol/ext-apps';

export function element<T extends HTMLElement = HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

export function status(message: string, error = false) {
  const target = element('status');
  target.textContent = message;
  target.dataset.error = String(error);
}

// Shared plumbing only. Each example keeps its own tool calls and interaction flow.
export function createAppClient<T>(name: string, render: (data: T) => void) {
  const app = new App({ name, version: '1.0.0' }, {}, { strict: true, autoResize: true });
  let ready = false;
  let busy = false;

  function dataFrom(result: Awaited<ReturnType<App['callServerTool']>>): T {
    if (result.isError) {
      throw new Error(result.content.filter(item => item.type === 'text').map(item => item.text).join('\n'));
    }
    // Studio sends initial results as JSON text and wraps REST callbacks in { result }.
    const text = result.content.find(item => item.type === 'text')?.text;
    const data = result.structuredContent ?? (text ? JSON.parse(text) : undefined);
    if (!data || typeof data !== 'object') throw new Error('The server did not return app data.');
    // These data contracts are exported by the matching server; its outputSchema validates them.
    return ('result' in data ? data.result : data) as T;
  }

  function theme(context: McpUiHostContext) {
    if (context.theme) applyDocumentTheme(context.theme);
    if (context.styles?.variables) applyHostStyleVariables(context.styles.variables);
    if (context.displayMode) document.body.dataset.displayMode = context.displayMode;
  }

  app.addEventListener('hostcontextchanged', theme);
  app.addEventListener('toolresult', result => {
    try { render(dataFrom(result)); } catch (error) { status(String(error), true); }
  });
  app.addEventListener('toolcancelled', () => status('The tool call was cancelled. Try again in chat.', true));

  async function connect() {
    try {
      await app.connect();
      theme(app.getHostContext() ?? {});
      ready = true;
      document.querySelectorAll<HTMLFieldSetElement>('fieldset[data-controls]').forEach(field => { field.disabled = false; });
      status('Connected to chat.');
    } catch {
      status('Open this app in an MCP Apps host. The host connection is unavailable.', true);
    }
  }

  async function call<R = T>(name: string, args: Record<string, unknown>): Promise<R> {
    const result = await app.callServerTool({ name, arguments: args });
    return dataFrom(result) as unknown as R;
  }

  async function share(prompt: string, context: Record<string, unknown>) {
    if (!app.getHostCapabilities()?.message) {
      throw new Error(`This host cannot send chat messages. Copy into chat: ${prompt}\n${JSON.stringify(context)}`);
    }
    if (app.getHostCapabilities()?.updateModelContext) {
      await app.updateModelContext({ structuredContent: context });
    }
    // Include context in the message as well, so the turn works in hosts without context updates.
    const result = await app.sendMessage({
      role: 'user',
      content: [{ type: 'text', text: `${prompt}\n\n${JSON.stringify(context)}` }],
    });
    if (result.isError) throw new Error('The host rejected the message. Use the button to retry.');
    status('Sent to chat.');
  }

  async function run(action: () => Promise<void>) {
    if (!ready || busy) return;
    busy = true;
    document.querySelectorAll<HTMLFieldSetElement>('fieldset[data-controls]').forEach(field => { field.disabled = true; });
    status('Working…');
    try {
      await action();
    } catch (error) {
      status(error instanceof Error ? error.message : String(error), true);
    } finally {
      busy = false;
      document.querySelectorAll<HTMLFieldSetElement>('fieldset[data-controls]').forEach(field => { field.disabled = false; });
    }
  }

  return { app, connect, call, share, run, get busy() { return busy; } };
}

export const money = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 2,
}).format(value);
