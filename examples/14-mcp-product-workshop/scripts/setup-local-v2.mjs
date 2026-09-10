import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile, realpath, lstat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import semver from 'semver';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const source = process.env.MASTRA_MCP_V2_PATH;
assert(source, 'Set MASTRA_MCP_V2_PATH to the MCP v2 worktree');
const checkout = await realpath(source);
const target = resolve(checkout, 'packages/mcp');
const files = ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml'];
const hashes = () => Promise.all(files.map(async file => createHash('sha256').update(await readFile(file)).digest('hex')));
const before = await hashes();
const manifest = JSON.parse(await readFile(resolve(target, 'package.json'), 'utf8'));
assert.equal(manifest.name, '@mastra/mcp');
await access(resolve(checkout, 'node_modules'));
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: checkout, encoding: 'utf8' }).trim();
const core = JSON.parse(await readFile('node_modules/@mastra/core/package.json', 'utf8'));
assert(semver.satisfies(core.version, manifest.peerDependencies['@mastra/core'], { includePrerelease: true }), 'Core peer range mismatch');
try {
  execFileSync('pnpm', ['turbo', 'run', 'build:lib', '--filter=@mastra/mcp...'], { cwd: checkout, stdio: 'inherit' });
  await access(resolve(target, 'dist/index.js'));
  const entry = resolve(root, 'node_modules/@mastra/mcp');
  assert((await lstat(entry)).isSymbolicLink(), 'Refusing to replace a non-symlink package entry');
  execFileSync('rm', [entry]);
  execFileSync('ln', ['-s', target, entry]);
  assert.equal(await realpath(entry), target);
  const { MCPServer } = await import('@mastra/mcp');
  const { createTool } = await import('@mastra/core/tools');
  const { z } = await import('zod');
  const probe = createTool({ id: 'probe', description: 'Cross-instance smoke test', inputSchema: z.object({ value: z.number() }), outputSchema: z.object({ value: z.number() }), execute: async input => input });
  const server = new MCPServer({ id: 'overlay-probe', name: 'Overlay probe', version: '1.0.0', tools: { probe } });
  try {
    assert.equal(server.getServerInfo().protocol_version, '2026-07-28');
    assert((await server.getToolListInfo()).tools.some(tool => tool.name === 'probe'));
    assert.deepEqual(await server.executeTool('probe', { value: 7 }), { value: 7 });
  } finally { await server.close(); }
  console.log(JSON.stringify({ overlay: target, commit, core: core.version, smoke: 'GREEN' }));
} finally {
  assert.deepEqual(await hashes(), before, 'Overlay modified a manifest or lockfile');
}
