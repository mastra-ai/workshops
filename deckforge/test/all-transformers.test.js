import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { renderDeck } from '../src/renderer.js';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function freshTempDir(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `deckforge-${label}-`));
}

test('integration: all-transformers fixture matches committed snapshot', () => {
  const out = freshTempDir('all-transformers');
  renderDeck(path.join(REPO_ROOT, 'test/fixtures/all-transformers.md'), out);

  const snapDir = path.join(REPO_ROOT, 'test/snapshots/all-transformers');
  if (process.env.UPDATE_SNAPSHOTS === '1' || !fs.existsSync(snapDir)) {
    fs.mkdirSync(snapDir, { recursive: true });
    for (const f of fs.readdirSync(out)) {
      fs.copyFileSync(path.join(out, f), path.join(snapDir, f));
    }
    return;
  }

  const expectedFiles = fs.readdirSync(snapDir).sort();
  const actualFiles = fs.readdirSync(out).sort();
  assert.deepEqual(actualFiles, expectedFiles, 'file list mismatch');
  for (const f of expectedFiles) {
    const a = fs.readFileSync(path.join(out, f), 'utf-8');
    const b = fs.readFileSync(path.join(snapDir, f), 'utf-8');
    assert.equal(a, b, `snapshot mismatch: ${f}`);
  }
});
