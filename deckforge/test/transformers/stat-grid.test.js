import { test } from 'node:test';
import assert from 'node:assert/strict';

import statGrid from '../../src/transformers/stat-grid.js';
import { tokensToBlocks } from '../../src/parser.js';

function bulletList(md) {
  return tokensToBlocks(md).find(b => b.type === 'bullet-list');
}

test('stat-grid: accepts bullet-list', () => {
  assert.deepEqual(statGrid.accepts, ['bullet-list']);
});

test('stat-grid: validate accepts %, $, × numeric prefixes', () => {
  const block = bulletList('- **70%** of time saved\n- **$2.4M** in savings\n- **3×** faster');
  assert.deepEqual(statGrid.validate(block, {}), { ok: true });
});

test('stat-grid: validate rejects non-numeric prefix', () => {
  const block = bulletList('- **Yes** a thing\n- **50%** something');
  const r = statGrid.validate(block, {});
  assert.equal(r.ok, false);
  assert.match(r.error, /item 1.*"Yes" is not numeric/);
});

test('stat-grid: validate rejects item missing bold prefix', () => {
  const block = bulletList('- **50%** ok\n- plain item');
  const r = statGrid.validate(block, {});
  assert.equal(r.ok, false);
  assert.match(r.error, /item 2.*\*\*numeric\*\*/);
});

test('stat-grid: renders stat-card with number and label', () => {
  const block = bulletList('- **70%** faster\n- **$2.4M** saved\n- **3×** throughput');
  const out = statGrid.render(block, {}, {});
  assert.match(out.html, /^<div class="stat-grid">/);
  assert.match(out.html, /<div class="stat-number">70%<\/div>/);
  assert.match(out.html, /<div class="stat-label">faster<\/div>/);
  assert.match(out.html, /<div class="stat-number">\$2\.4M<\/div>/);
  assert.match(out.html, /<div class="stat-number">3×<\/div>/);
});

test('stat-grid: strips separator noise between number and caption', () => {
  const dash = bulletList('- **50%** — after rollout');
  const colon = bulletList('- **50%**: after rollout');
  assert.match(statGrid.render(dash, {}, {}).html, /<div class="stat-label">after rollout<\/div>/);
  assert.match(statGrid.render(colon, {}, {}).html, /<div class="stat-label">after rollout<\/div>/);
});

test('stat-grid: card with no caption skips the label', () => {
  const block = bulletList('- **70%**\n- **3×**');
  const out = statGrid.render(block, {}, {});
  assert.ok(!out.html.includes('stat-label'));
});

test('stat-grid: stagger-in param adds class + delays + css', () => {
  const block = bulletList('- **50%** a\n- **3×** b');
  const out = statGrid.render(block, { 'stagger-in': true }, {});
  assert.match(out.html, /class="stat-grid df-stagger-in"/);
  assert.match(out.html, /data-stagger-in="true"/);
  assert.match(out.css, /@keyframes dfStaggerFade/);
});
