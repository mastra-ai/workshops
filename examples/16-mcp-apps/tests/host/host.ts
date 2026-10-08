import { AppBridge, PostMessageTransport } from '@modelcontextprotocol/ext-apps/app-bridge';
import type { CallToolResult, Tool } from '@modelcontextprotocol/client';
import { z } from 'zod';

const gameState = z.object({ gameId: z.string().uuid(), revision: z.number().int() });

const element = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const query = new URLSearchParams(location.search);
const kind = query.get('app') ?? 'loan-calculator';
type Bootstrap = { id: string; tools: Tool[]; tool: Tool; args: Record<string, unknown>; result?: CallToolResult; html: string };
const bootstrap: Bootstrap = await (await fetch(`/api/bootstrap?app=${kind}`)).json();
let lastGame: { gameId: string } | undefined;
let selected: Record<string, unknown> | undefined;
const bridges: AppBridge[] = [];

async function call(name: string, args: Record<string, unknown>) {
  const response = await fetch('/api/call', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: bootstrap.id, name, args }),
  });
  const result: CallToolResult = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(result));
  const game = gameState.safeParse(result.structuredContent);
  if (game.success) lastGame = game.data;
  return result;
}

async function mount(frame: HTMLIFrameElement, resourceHtml: string, result?: CallToolResult, tool = bootstrap.tool, args = bootstrap.args) {
  const bridge = new AppBridge(null, { name: 'Local test host', version: '1.0.0' }, {
    serverTools: {},
    ...(query.has('noMessages') ? {} : { message: { text: {} } }),
    ...(query.has('noContext') ? {} : { updateModelContext: { text: {} } }),
  }, { hostContext: {
    theme: element<HTMLInputElement>('dark').checked ? 'dark' : 'light',
    displayMode: 'inline', availableDisplayModes: query.has('inlineOnly') ? ['inline'] : ['inline', 'fullscreen'],
    ...(result ? { toolInfo: { tool } } : {}),
  } });
  bridges.push(bridge);
  bridge.oncalltool = async params => {
    const descriptor = bootstrap.tools.find(tool => tool.name === params.name);
    const ui = descriptor?._meta?.ui as { visibility?: string[] } | undefined;
    if (ui?.visibility && !ui.visibility.includes('app')) throw new Error('Tool is not app-visible');
    const result = await call(params.name, params.arguments ?? {});
    return query.has('textOnly') && result.structuredContent
      ? { ...result, structuredContent: { result: result.structuredContent } }
      : result;
  };
  bridge.onmessage = async message => {
    if (element<HTMLInputElement>('reject').checked) return { isError: true };
    const pre = document.createElement('pre');
    pre.textContent = message.content.map(block => block.type === 'text' ? block.text : '').join('\n');
    element('messages').append(pre);
    return {};
  };
  bridge.onupdatemodelcontext = async context => {
    selected = context.structuredContent;
    element('context').textContent = JSON.stringify(context.structuredContent, null, 2);
    element('render-card').hidden = !selected?.metricId;
    return {};
  };
  bridge.onrequestdisplaymode = async ({ mode }) => {
    document.body.classList.toggle('fullscreen', mode === 'fullscreen');
    bridge.setHostContext({ displayMode: mode });
    return { mode };
  };
  bridge.addEventListener('sizechange', ({ height }) => { if (height) frame.style.height = `${height + 10}px`; });
  bridge.addEventListener('initialized', () => {
    if (result) {
      void bridge.sendToolInput({ arguments: args });
      void bridge.sendToolResult(query.has('textOnly') ? { ...result, structuredContent: undefined } : result);
      const game = gameState.safeParse(result.structuredContent);
      if (game.success) lastGame = game.data;
    }
    element('host-status').textContent = 'App connected through the official MCP Apps bridge.';
  });
  await bridge.connect(new PostMessageTransport(frame.contentWindow!, frame.contentWindow!));
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; form-action 'none'">`;
  const html = resourceHtml.replace('<head>', `<head>${csp}`);
  if (query.has('blob')) {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    frame.onload = () => URL.revokeObjectURL(url);
    frame.src = url;
  } else {
    frame.srcdoc = html;
  }
}

element('dark').onchange = () => {
  for (const bridge of bridges) bridge.setHostContext({ theme: element<HTMLInputElement>('dark').checked ? 'dark' : 'light' });
};
element('game-controls').hidden = kind !== 'tic-tac-toe';
element('agent-move').onclick = async () => {
  try {
    if (!lastGame) throw new Error('Start a game first.');
    const state = await call('get_game', { gameId: lastGame.gameId });
    const result = await call('play_agent_move', {
      gameId: lastGame.gameId, expectedRevision: gameState.parse(state.structuredContent).revision, cell: Number(element<HTMLInputElement>('agent-cell').value),
    });
    if (result.isError) throw new Error(JSON.stringify(result.content));
    element('host-status').textContent = 'Agent move committed. The existing board must discover it by polling (no notification sent).';
  } catch (error) { element('host-status').textContent = String(error); }
};
element('render-card').onclick = async () => {
  if (!selected) return;
  const args = { metricId: selected.metricId, period: selected.period, segment: selected.segment };
  const result = await call('show_metric', args);
  const frame = element<HTMLIFrameElement>('chat-card'); frame.hidden = false;
  await mount(frame, bootstrap.html, result, bootstrap.tools.find(tool => tool.name === 'show_metric')!, args);
};
await mount(element<HTMLIFrameElement>('app'), bootstrap.html, bootstrap.result);
