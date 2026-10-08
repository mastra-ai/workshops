import type { Game } from '../../mastra/mcp/tic-tac-toe';
import { createAppClient, element, status } from '../shared/client';

let current: Game | undefined;
let pendingMessage: { prompt: string; game: Game } | undefined;
let polling = false;
let pollStopped = false;
const client = createAppClient<Game>('Tic-tac-toe', acceptUpdate);

function acceptUpdate(game: Game) {
  // An older HTTP response must not roll back a newer move or replace a different game.
  if (current && (game.gameId !== current.gameId || game.revision < current.revision)) return;
  current = game;
  element('human').classList.toggle('active', game.turn === 'X');
  element('agent').classList.toggle('active', game.turn === 'O');
  element('turn').textContent = game.status === 'draw' ? 'A draw. Well played!'
    : game.status === 'won' ? (game.winner === 'X' ? 'You win!' : 'Your agent wins!')
    : game.turn === 'X' ? 'Your turn. Pick an empty square.' : 'Waiting for your agent’s move in chat…';
  element('game-id').textContent = `Game ${game.gameId} · revision ${game.revision}`;
  element('board').replaceChildren(...game.board.map((player, cell) => {
    const button = document.createElement('button');
    button.className = 'square';
    button.textContent = player ?? '';
    button.dataset.player = player ?? '';
    button.dataset.win = String(game.winningLine.includes(cell));
    button.setAttribute('aria-label', `Row ${Math.floor(cell / 3) + 1}, column ${cell % 3 + 1}: ${player ?? 'empty'}`);
    button.disabled = player !== null || game.turn !== 'X' || game.status !== 'playing';
    button.onclick = () => void client.run(async () => {
      const next = await client.call('play_human_move', { gameId: game.gameId, cell, expectedRevision: game.revision });
      acceptUpdate(next);
      pendingMessage = {
        prompt: `I played X at cell ${cell} (row ${Math.floor(cell / 3) + 1}, column ${cell % 3 + 1}). ${next.status === 'playing' ? 'Read get_game, then choose your O move with play_agent_move using the latest revision.' : 'The game has ended. Summarize the result.'}`,
        game: next,
      };
      element('retry').hidden = false;
      await sendPendingMove();
    });
    return button;
  }));
}

async function sendPendingMove() {
  if (!pendingMessage) return;
  await client.share(pendingMessage.prompt, { ...pendingMessage.game });
  pendingMessage = undefined;
  element('retry').hidden = true;
}

element('retry').onclick = () => void client.run(sendPendingMove);
element('new-game').onclick = () => void client.run(async () => {
  const game = await client.call('new_game', {});
  current = undefined; pendingMessage = undefined; pollStopped = false;
  element('retry').hidden = true;
  acceptUpdate(game);
  status('New game. You play first.');
});
element('refresh').onclick = () => void client.run(async () => {
  if (!current) throw new Error('Start a new game first.');
  acceptUpdate(await client.call('get_game', { gameId: current.gameId }));
  pollStopped = false;
  status('Board refreshed.');
});

// Tool-result notifications may update the initial frame, but hosts need not route later
// agent tool calls there. Poll shared server state rather than assuming they do.
const interval = window.setInterval(async () => {
  if (!current || current.status !== 'playing' || client.busy || polling || pollStopped || document.hidden) return;
  polling = true;
  try {
    acceptUpdate(await client.call('get_game', { gameId: current.gameId }));
  } catch (error) {
    pollStopped = true;
    status(`${String(error)} Use Refresh board to reconnect or start a new game.`, true);
  } finally { polling = false; }
}, 1500);
window.addEventListener('pagehide', () => clearInterval(interval));
client.app.onteardown = async () => { clearInterval(interval); return {}; };
void client.connect();
