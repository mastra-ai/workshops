import { test } from 'node:test';
import assert from 'node:assert/strict';

import cardGrid from '../../src/transformers/card-grid.js';
import { tokensToBlocks } from '../../src/parser.js';

function bulletList(md) {
  const blocks = tokensToBlocks(md);
  return blocks.find(b => b.type === 'bullet-list');
}

test('card-grid: accepts bullet-list', () => {
  assert.deepEqual(cardGrid.accepts, ['bullet-list']);
});

test('card-grid: validate happy path', () => {
  const block = bulletList('- **Alpha** — first\n- **Beta** — second');
  assert.deepEqual(cardGrid.validate(block, {}), { ok: true });
});

test('card-grid: validate rejects item missing bold prefix', () => {
  const block = bulletList('- **Alpha** — first\n- plain text');
  const r = cardGrid.validate(block, {});
  assert.equal(r.ok, false);
  assert.match(r.error, /item 2.*\*\*bold\*\*/);
});

test('card-grid: validate rejects empty list', () => {
  const block = { type: 'bullet-list', data: { items: [] }, directive: null, line: 1 };
  const r = cardGrid.validate(block, {});
  assert.equal(r.ok, false);
});

test('card-grid: render emits a grid with title and body per card', () => {
  const block = bulletList('- **Alpha** — first card\n- **Beta** — second card\n- **Gamma** — third card');
  const out = cardGrid.render(block, {}, { slideId: 's1', blockIndex: 0 });
  assert.match(out.html, /^<div class="card-grid">/);
  assert.match(out.html, /<h4>Alpha<\/h4>/);
  assert.match(out.html, /<p>first card<\/p>/);
  assert.match(out.html, /<h4>Beta<\/h4>/);
  assert.match(out.html, /<h4>Gamma<\/h4>/);
});

test('card-grid: strips separator noise between bold prefix and body', () => {
  const dash = bulletList('- **One** — dash body');
  const colon = bulletList('- **Two**: colon body');
  const plain = bulletList('- **Three** plain body');
  assert.match(cardGrid.render(dash, {}, {}).html, /<p>dash body<\/p>/);
  assert.match(cardGrid.render(colon, {}, {}).html, /<p>colon body<\/p>/);
  assert.match(cardGrid.render(plain, {}, {}).html, /<p>plain body<\/p>/);
});

test('card-grid: card with no body skips the <p>', () => {
  const block = bulletList('- **Alpha**\n- **Beta**');
  const out = cardGrid.render(block, {}, {});
  assert.match(out.html, /<h4>Alpha<\/h4>\n  <\/div>/);
  assert.ok(!/class="card fade-on-scroll">\s*<h4>Alpha<\/h4>\s*<p>/.test(out.html));
});

test('card-grid: stagger-in param adds wrapper class + inline delays + css', () => {
  const block = bulletList('- **A** — one\n- **B** — two');
  const out = cardGrid.render(block, { 'stagger-in': true }, {});
  assert.match(out.html, /class="card-grid df-stagger-in"/);
  assert.match(out.html, /data-stagger-in="true"/);
  assert.match(out.html, /animation-delay: 0ms/);
  assert.match(out.html, /animation-delay: 80ms/);
  assert.match(out.css, /@keyframes dfStaggerFade/);
});

test('card-grid: render snapshot (3 cards, no stagger)', () => {
  const block = bulletList('- **Alpha** — first thing\n- **Beta** — second thing\n- **Gamma** — third thing');
  const out = cardGrid.render(block, {}, {});
  const expected = `<div class="card-grid">
  <div class="card fade-on-scroll">
    <h4>Alpha</h4>
    <p>first thing</p>
  </div>
  <div class="card fade-on-scroll">
    <h4>Beta</h4>
    <p>second thing</p>
  </div>
  <div class="card fade-on-scroll">
    <h4>Gamma</h4>
    <p>third thing</p>
  </div>
</div>
`;
  assert.equal(out.html, expected);
});
