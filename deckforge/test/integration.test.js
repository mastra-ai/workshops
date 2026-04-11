import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { renderDeck } from '../src/renderer.js';
import { organize } from '../src/organizer.js';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function freshTempDir(label) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `deckforge-${label}-`));
  return dir;
}

function readAll(dir) {
  const result = {};
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isFile()) {
      result[file] = fs.readFileSync(full, 'utf-8');
    }
  }
  return result;
}

test('integration: sample-deck build matches committed byte-compat snapshot', () => {
  const out = freshTempDir('sample');
  renderDeck(path.join(REPO_ROOT, 'examples/sample-deck.md'), out);
  // The snapshot captures the full post-organize output — run the organizer
  // so the byte-compat check includes nav + keynav injection.
  fs.copyFileSync(
    path.join(REPO_ROOT, 'theme/shared.css'),
    path.join(out, 'shared.css'),
  );
  fs.copyFileSync(
    path.join(REPO_ROOT, 'theme/shared.js'),
    path.join(out, 'shared.js'),
  );
  organize(out);

  const snapshotDir = path.join(REPO_ROOT, 'test/snapshots/sample-deck');
  const snapshot = readAll(snapshotDir);
  const actual = readAll(out);

  const htmlFiles = Object.keys(snapshot).filter(f => f.endsWith('.html') && f !== 'index.html');
  assert.ok(htmlFiles.length > 0, 'expected snapshot to contain slide html files');

  for (const file of htmlFiles) {
    assert.ok(actual[file], `missing generated file: ${file}`);
    assert.equal(actual[file], snapshot[file], `byte-compat drift in ${file}`);
  }

  // deck.json has the same content shape — compare after parse (nav field order).
  assert.equal(actual['deck.json'], snapshot['deck.json'], 'deck.json drift');
});

test('integration: minimal-deck build exercises all nine primitives', () => {
  const out = freshTempDir('minimal');
  const manifest = renderDeck(path.join(REPO_ROOT, 'test/fixtures/minimal-deck.md'), out);
  assert.ok(manifest.slides.length >= 2);

  const combined = fs
    .readdirSync(out)
    .filter(f => f.endsWith('.html'))
    .map(f => fs.readFileSync(path.join(out, f), 'utf-8'))
    .join('\n');

  // Spot-check that each primitive's rendered output appears somewhere.
  assert.match(combined, /<h1>/, 'heading h1');
  assert.match(combined, /<h2>/, 'heading h2');
  assert.match(combined, /<p>/, 'paragraph');
  assert.match(combined, /<ul>/, 'bullet-list');
  assert.match(combined, /<ol>/, 'ordered-list');
  assert.match(combined, /class="code-block/, 'code-block');
  assert.match(combined, /class="callout/, 'blockquote');
  assert.match(combined, /<img|example\.com\/logo\.png/, 'image');
  assert.match(combined, /<hr/, 'horizontal-rule');
});
