import { randomUUID } from 'node:crypto';
import { createTool } from '@mastra/core/tools';
import { MCPServer } from '@mastra/mcp';
import { z } from 'zod';
import html from './generated/tic-tac-toe';

const resourceUri = 'ui://tic-tac-toe/app.html';
export const gameSchema = z.object({
  gameId: z.string().uuid(),
  board: z.array(z.enum(['X', 'O']).nullable()).length(9),
  revision: z.number().int(),
  turn: z.enum(['X', 'O']).nullable(),
  status: z.enum(['playing', 'won', 'draw']),
  winner: z.enum(['X', 'O']).nullable(),
  winningLine: z.array(z.number()),
  expiresAt: z.string(),
});
export type Game = z.infer<typeof gameSchema>;
const games = new Map<string, Game>();
const lifetime = 60 * 60 * 1000;
const winningLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const gameInput = z.object({ gameId: z.string().uuid() });
const moveInput = gameInput.extend({
  cell: z.number().int().min(0).max(8).describe('Row-major cell index: 0 1 2 / 3 4 5 / 6 7 8.'),
  expectedRevision: z.number().int().min(0).describe('Revision returned by get_game. Rejects duplicate and stale moves.'),
});

function getGame(gameId: string): Game {
  const game = games.get(gameId);
  if (!game || Date.parse(game.expiresAt) <= Date.now()) {
    games.delete(gameId);
    throw new Error('Game not found or expired. Start a new game. Games reset when the server restarts.');
  }
  return structuredClone(game);
}

function playMove(input: z.infer<typeof moveInput>, player: 'X' | 'O'): Game {
  const game = getGame(input.gameId);
  if (game.revision !== input.expectedRevision) throw new Error('Stale move. Call get_game and use its current revision.');
  if (game.status !== 'playing') throw new Error('This game is finished. Start a new game.');
  if (game.turn !== player) throw new Error(`It is ${game.turn}'s turn, not ${player}'s.`);
  if (game.board[input.cell] !== null) throw new Error('That square is occupied. Choose an empty square.');
  game.board[input.cell] = player;
  game.revision++;
  game.winningLine = winningLines.find(line => line.every(cell => game.board[cell] === player)) ?? [];
  if (game.winningLine.length) {
    game.status = 'won'; game.winner = player; game.turn = null;
  } else if (game.board.every(Boolean)) {
    game.status = 'draw'; game.turn = null;
  } else {
    game.turn = player === 'X' ? 'O' : 'X';
  }
  // No await between checking the revision and committing the move.
  games.set(game.gameId, game);
  return structuredClone(game);
}

export const newGameTool = createTool({
  id: 'new_game',
  description: 'Open a new tic-tac-toe game. The human is X and moves first; you (the chat agent) are O. Return gameId for subsequent calls.',
  inputSchema: z.object({}),
  outputSchema: gameSchema,
  mcp: {
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false, idempotentHint: false },
    _meta: { ui: { resourceUri, visibility: ['model', 'app'] } },
  },
  execute: async () => {
    for (const [id, game] of games) if (Date.parse(game.expiresAt) <= Date.now()) games.delete(id);
    if (games.size >= 1000) throw new Error('Demo game capacity reached. Try again after games expire.');
    const game: Game = {
      gameId: randomUUID(), board: Array(9).fill(null), revision: 0, turn: 'X', status: 'playing',
      winner: null, winningLine: [], expiresAt: new Date(Date.now() + lifetime).toISOString(),
    };
    games.set(game.gameId, game);
    return structuredClone(game);
  },
});

export const getGameTool = createTool({
  id: 'get_game',
  description: 'Read authoritative game state and revision before choosing a move. X is human; O is the agent. Empty cells are null. Also used by the app to see agent moves.',
  inputSchema: gameInput,
  outputSchema: gameSchema,
  mcp: { annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true }, _meta: { ui: { visibility: ['model', 'app'] } } },
  execute: async ({ gameId }) => getGame(gameId),
});

export const playHumanMoveTool = createTool({
  id: 'play_human_move',
  description: 'Record a human X move from the board. The app then sends the move to chat.',
  inputSchema: moveInput,
  outputSchema: gameSchema,
  mcp: { annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false, idempotentHint: false }, _meta: { ui: { visibility: ['app'] } } },
  execute: async input => playMove(input, 'X'),
});

export const playAgentMoveTool = createTool({
  id: 'play_agent_move',
  description: 'Play your O move against the human. First read get_game, choose an empty cell yourself, then provide its revision. The existing board polls get_game and will show your move; no new UI is needed.',
  inputSchema: moveInput,
  outputSchema: gameSchema,
  mcp: { annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false, idempotentHint: false }, _meta: { ui: { visibility: ['model'] } } },
  execute: async input => playMove(input, 'O'),
});

export const ticTacToeTools = {
  new_game: newGameTool, get_game: getGameTool,
  play_human_move: playHumanMoveTool, play_agent_move: playAgentMoveTool,
};

export const ticTacToeServer = new MCPServer({
  id: 'tic-tac-toe', name: 'Tic Tac Toe', version: '1.0.0',
  instructions: 'The human plays X in the app. You play O. After every human move message, call get_game with its gameId. If still playing and turn is O, choose a legal strategic move and call play_agent_move with the current expectedRevision. Never use play_human_move or start a new game to reply to a move. Briefly explain your move. When the game ends, acknowledge the win or draw. Games are temporary single-process demos, not authenticated multiplayer sessions.',
  tools: ticTacToeTools,
  appResources: {
    [resourceUri]: { name: 'Human vs agent tic-tac-toe', html, meta: { prefersBorder: true, csp: { connectDomains: [], resourceDomains: [] } } },
  },
});
