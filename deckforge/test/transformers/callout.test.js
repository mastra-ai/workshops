import { test } from 'node:test';
import assert from 'node:assert/strict';

import callout from '../../src/transformers/callout.js';
import { tokensToBlocks } from '../../src/parser.js';

function blockquoteBlock(md) {
  const blocks = tokensToBlocks(md);
  return blocks.find(b => b.type === 'blockquote');
}

function paragraphBlock(md) {
  const blocks = tokensToBlocks(md);
  return blocks.find(b => b.type === 'paragraph');
}

test('callout: accepts blockquote and paragraph primitives', () => {
  assert.deepEqual(callout.accepts.sort(), ['blockquote', 'paragraph']);
});

test('callout: validate with no color param → ok', () => {
  const block = blockquoteBlock('> hello');
  assert.deepEqual(callout.validate(block, {}), { ok: true });
});

test('callout: validate rejects unknown color', () => {
  const block = blockquoteBlock('> hello');
  const r = callout.validate(block, { color: 'pink' });
  assert.equal(r.ok, false);
  assert.match(r.error, /invalid color "pink"/);
});

test('callout: validate accepts all four colors', () => {
  const block = blockquoteBlock('> hi');
  for (const c of ['accent', 'green', 'yellow', 'orange']) {
    assert.deepEqual(callout.validate(block, { color: c }), { ok: true });
  }
});

test('callout: default color → accent, emits base class only', () => {
  const block = blockquoteBlock('> hello **world**');
  const out = callout.render(block, {}, { slideId: 's1', blockIndex: 0 });
  assert.match(out.html, /^<div class="callout fade-on-scroll">/);
  assert.match(out.html, /<strong>world<\/strong>/);
  assert.match(out.html, /<p>hello <strong>world<\/strong><\/p>/);
});

test('callout: green/yellow/orange render with variant class', () => {
  const block = paragraphBlock('heads up');
  for (const color of ['green', 'yellow', 'orange']) {
    const out = callout.render(block, { color }, { slideId: 's1', blockIndex: 0 });
    assert.match(out.html, new RegExp(`class="callout callout-${color} fade-on-scroll"`));
  }
});

test('callout: emits color-variant CSS so the same transformer covers any color', () => {
  const block = paragraphBlock('hi');
  const out = callout.render(block, { color: 'green' }, { slideId: 's1', blockIndex: 0 });
  assert.match(out.css, /\.callout-green/);
  assert.match(out.css, /\.callout-yellow/);
  assert.match(out.css, /\.callout-orange/);
});

test('callout: escapes raw HTML in content', () => {
  const block = paragraphBlock('safe <script>alert(1)</script> text');
  const out = callout.render(block, {}, { slideId: 's1', blockIndex: 0 });
  assert.ok(!out.html.includes('<script>'));
  assert.match(out.html, /&lt;script&gt;/);
});
