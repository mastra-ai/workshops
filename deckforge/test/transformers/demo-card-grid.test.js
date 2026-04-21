import { test } from 'node:test';
import assert from 'node:assert/strict';

import demoCardGrid from '../../src/transformers/demo-card-grid.js';
import { tokensToBlocks } from '../../src/parser.js';

function bulletList(md) {
  return tokensToBlocks(md).find(b => b.type === 'bullet-list');
}

function makeBlock(n) {
  const items = Array.from({ length: n }, (_, i) => `- **Item ${i + 1}** body ${i + 1}`).join('\n');
  return bulletList(items);
}

test('demo-card-grid: accepts bullet-list', () => {
  assert.deepEqual(demoCardGrid.accepts, ['bullet-list']);
});

test('demo-card-grid: validate accepts 3 items', () => {
  assert.deepEqual(demoCardGrid.validate(makeBlock(3), {}), { ok: true });
});

test('demo-card-grid: validate accepts 6 items', () => {
  assert.deepEqual(demoCardGrid.validate(makeBlock(6), {}), { ok: true });
});

test('demo-card-grid: validate rejects 2 items', () => {
  const r = demoCardGrid.validate(makeBlock(2), {});
  assert.equal(r.ok, false);
  assert.match(r.error, /needs 3–6 items.*got 2/);
});

test('demo-card-grid: validate rejects 7 items', () => {
  const r = demoCardGrid.validate(makeBlock(7), {});
  assert.equal(r.ok, false);
  assert.match(r.error, /got 7/);
});

test('demo-card-grid: renders numbered demo-card per item', () => {
  const block = makeBlock(3);
  const out = demoCardGrid.render(block, {}, {});
  assert.match(out.html, /^<div class="demo-grid">/);
  assert.match(out.html, /<div class="demo-number">01<\/div>/);
  assert.match(out.html, /<div class="demo-number">02<\/div>/);
  assert.match(out.html, /<div class="demo-number">03<\/div>/);
  assert.match(out.html, /<h4>Item 1<\/h4>/);
  assert.match(out.html, /<p>body 1<\/p>/);
});

test('demo-card-grid: bold prefix becomes title, remaining spans become body', () => {
  const block = bulletList('- **Alpha** — first\n- **Beta** — second\n- **Gamma** — third');
  const out = demoCardGrid.render(block, {}, {});
  assert.match(out.html, /<h4>Alpha<\/h4>\s*\n\s*<p>first<\/p>/);
});

test('demo-card-grid: items without bold prefix still render with number', () => {
  const block = bulletList('- first thing\n- second thing\n- third thing');
  const out = demoCardGrid.render(block, {}, {});
  assert.match(out.html, /<div class="demo-number">01<\/div>/);
  assert.match(out.html, /<p>first thing<\/p>/);
});
