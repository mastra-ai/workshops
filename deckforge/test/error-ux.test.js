import { test } from 'node:test';
import assert from 'node:assert/strict';

import { renderSlide } from '../src/renderer.js';
import { tokensToBlocks } from '../src/parser.js';

function mkSlide(blocks) {
  return {
    id: 's1',
    title: 'T',
    nav: 'T',
    level: 2,
    group: null,
    groupIndex: 0,
    slideIndex: 0,
    isGroupHeader: false,
    shellDirective: null,
    blocks,
    contentHash: '0',
  };
}

function blockWithBadDirective() {
  // A sibling paragraph follows the bad block so we can verify the rest of
  // the slide still renders in dev mode.
  return tokensToBlocks('<!-- df: nonexistent-transformer -->\n- one\n- two\n\nA safe paragraph.');
}

test('dev mode: unknown transformer produces error panel, other blocks still render', () => {
  const blocks = blockWithBadDirective();
  assert.ok(blocks.length >= 2, 'fixture should yield the bad directive block plus a safe sibling');
  const rendered = renderSlide(mkSlide(blocks), { mode: 'dev' });
  assert.match(rendered.bodyHtml, /class="df-error-panel"/);
  assert.match(rendered.bodyHtml, /unknown transformer &quot;nonexistent-transformer&quot;/);
  // The safe paragraph still renders via passthrough.
  assert.match(rendered.bodyHtml, /<p>A safe paragraph\.<\/p>/);
  // Error-panel CSS is emitted once on the slide.
  const cssMatches = (rendered.transformerCss.match(/\.df-error-panel/g) || []).length;
  assert.ok(cssMatches >= 1, 'error panel css should be present');
});

test('build mode: unknown transformer throws with a specific message', () => {
  const blocks = blockWithBadDirective();
  assert.throws(
    () => renderSlide(mkSlide(blocks), { mode: 'build' }),
    /unknown transformer "nonexistent-transformer"/,
  );
});

test('dev mode: failed validate() produces error panel, not a throw', () => {
  // card-grid requires a **bold** prefix on every item; this one violates it.
  const blocks = tokensToBlocks('<!-- df: card-grid -->\n- plain one\n- plain two');
  const rendered = renderSlide(mkSlide(blocks), { mode: 'dev' });
  assert.match(rendered.bodyHtml, /class="df-error-panel"/);
  assert.match(rendered.bodyHtml, /must start with a \*\*bold\*\* prefix/);
  // Error panel CSS is deduped regardless of mode.
  assert.match(rendered.transformerCss, /\.df-error-panel/);
});

test('build mode: failed validate() throws', () => {
  const blocks = tokensToBlocks('<!-- df: card-grid -->\n- plain one\n- plain two');
  assert.throws(
    () => renderSlide(mkSlide(blocks), { mode: 'build' }),
    /must start with a \*\*bold\*\* prefix/,
  );
});

test('default mode is build (unchanged call-sites still throw)', () => {
  const blocks = blockWithBadDirective();
  assert.throws(() => renderSlide(mkSlide(blocks)), /unknown transformer/);
});
