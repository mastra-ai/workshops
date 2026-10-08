import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ticTacToeServer, gameSchema } from '../src/mastra/mcp/tic-tac-toe';
import { withMcpClient } from './helpers';

test('human/agent turns, revisions, wins, draws, and game isolation over MCP', async () => {
  await withMcpClient(ticTacToeServer, async client => {
    const call = (name: string, args = {}) => client.callTool({ name, arguments: args });
    const readGame = async (name: string, args = {}) => gameSchema.parse((await call(name, args)).structuredContent);
    const first = await readGame('new_game');
    const second = await readGame('new_game');
    assert.notEqual(first.gameId, second.gameId);
    assert.equal((await call('play_agent_move', { gameId: first.gameId, cell: 4, expectedRevision: 0 })).isError, true);
    for (const [revision, cell] of [0, 3, 1, 4, 2].entries()) {
      const result = await call(revision % 2 ? 'play_agent_move' : 'play_human_move', { gameId: first.gameId, cell, expectedRevision: revision });
      assert.equal(result.isError, false);
    }
    const won = await readGame('get_game', { gameId: first.gameId });
    assert.equal(won.winner, 'X');
    assert.deepEqual(won.winningLine, [0, 1, 2]);
    assert.equal(won.turn, null);
    assert.equal((await call('play_agent_move', { gameId: first.gameId, cell: 8, expectedRevision: 5 })).isError, true);
    assert.equal((await readGame('get_game', { gameId: second.gameId })).revision, 0);

    const race = await Promise.all([0, 1].map(cell => call('play_human_move', { gameId: second.gameId, cell, expectedRevision: 0 })));
    assert.equal(race.filter(result => !result.isError).length, 1);
    const occupied = (await readGame('get_game', { gameId: second.gameId })).board.indexOf('X');
    assert.equal((await call('play_agent_move', { gameId: second.gameId, cell: occupied, expectedRevision: 1 })).isError, true);
    assert.equal((await call('play_agent_move', { gameId: second.gameId, cell: 9, expectedRevision: 1 })).isError, true);
    assert.equal((await call('get_game', { gameId: '00000000-0000-4000-8000-000000000000' })).isError, true);

    const drawn = await readGame('new_game');
    for (const [revision, cell] of [0, 1, 2, 4, 3, 5, 7, 6, 8].entries()) {
      assert.equal((await call(revision % 2 ? 'play_agent_move' : 'play_human_move', { gameId: drawn.gameId, cell, expectedRevision: revision })).isError, false);
    }
    assert.equal((await readGame('get_game', { gameId: drawn.gameId })).status, 'draw');

    const tools = (await client.listTools()).tools;
    assert.deepEqual(tools.find(tool => tool.name === 'play_human_move')?._meta?.ui, { visibility: ['app'] });
    assert.deepEqual(tools.find(tool => tool.name === 'play_agent_move')?._meta?.ui, { visibility: ['model'] });
  });
});
