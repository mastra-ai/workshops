import { test } from 'node:test';
import assert from 'node:assert/strict';

import modeToggle from '../../src/transformers/mode-toggle.js';
import { tokensToBlocks } from '../../src/parser.js';
import { renderSlide } from '../../src/renderer.js';

function nestedList(md) {
  return tokensToBlocks(md).find(b => b.type === 'nested-bullet-list');
}

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

test('mode-toggle: accepts nested-bullet-list', () => {
  assert.deepEqual(modeToggle.accepts, ['nested-bullet-list']);
});

test('mode-toggle: validate accepts 2+ modes, each with 1+ children', () => {
  const block = nestedList('- Mode A\n  - one\n- Mode B\n  - two');
  assert.deepEqual(modeToggle.validate(block, {}), { ok: true });
});

test('mode-toggle: validate rejects single-parent input', () => {
  const block = nestedList('- Solo\n  - only');
  // A single-parent nested list is actually parsed as a nested-bullet-list only
  // when the flattener does not collapse it; force the condition instead.
  const forced = {
    type: 'nested-bullet-list',
    data: { items: [{ spans: [{ kind: 'text', text: 'Solo' }], children: [{ spans: [{ kind: 'text', text: 'only' }] }] }] },
    directive: null,
    line: 1,
  };
  const r = modeToggle.validate(forced, {});
  assert.equal(r.ok, false);
  assert.match(r.error, /at least 2 modes/);
});

test('mode-toggle: validate rejects a mode with no children', () => {
  const forced = {
    type: 'nested-bullet-list',
    data: {
      items: [
        { spans: [{ kind: 'text', text: 'A' }], children: [{ spans: [{ kind: 'text', text: 'a1' }] }] },
        { spans: [{ kind: 'text', text: 'B' }], children: [] },
      ],
    },
    directive: null,
    line: 1,
  };
  const r = modeToggle.validate(forced, {});
  assert.equal(r.ok, false);
  assert.match(r.error, /mode 2 must have at least one child/);
});

test('mode-toggle: render produces tabs and panels (2 modes)', () => {
  const block = nestedList('- Supervised\n  - human approves\n  - drafts only\n- Autonomous\n  - agent acts');
  const out = modeToggle.render(block, {}, { slideId: 's1', blockIndex: 0 });
  assert.match(out.html, /data-df-mode-toggle="mt-s1-0"/);
  assert.match(out.html, /id="mt-s1-0-tab-0" class="mode-toggle-tab active"[^>]*data-df-mode-tab="0">Supervised</);
  assert.match(out.html, /id="mt-s1-0-tab-1" class="mode-toggle-tab"[^>]*data-df-mode-tab="1">Autonomous</);
  assert.match(out.html, /id="mt-s1-0-panel-0" class="mode-toggle-panel active"[^>]*data-df-mode-panel="0"/);
  assert.match(out.html, /id="mt-s1-0-panel-1" class="mode-toggle-panel"[^>]*data-df-mode-panel="1" hidden/);
  assert.match(out.html, /<li>human approves<\/li>/);
  assert.match(out.html, /<li>agent acts<\/li>/);
});

test('mode-toggle: ARIA tab pattern attributes are present', () => {
  const block = nestedList('- A\n  - a1\n- B\n  - b1');
  const out = modeToggle.render(block, {}, { slideId: 's1', blockIndex: 0 });
  assert.match(out.html, /role="tablist"/);
  // Two tabs with role/aria-selected/aria-controls/tabindex.
  assert.match(out.html, /role="tab" aria-selected="true" aria-controls="mt-s1-0-panel-0" tabindex="0"/);
  assert.match(out.html, /role="tab" aria-selected="false" aria-controls="mt-s1-0-panel-1" tabindex="-1"/);
  // Panels with role/aria-labelledby.
  assert.match(out.html, /role="tabpanel" aria-labelledby="mt-s1-0-tab-0"/);
  assert.match(out.html, /role="tabpanel" aria-labelledby="mt-s1-0-tab-1"/);
});

test('mode-toggle: tab-switch JS keeps aria-selected and tabindex in sync', () => {
  const block = nestedList('- A\n  - a\n- B\n  - b');
  const out = modeToggle.render(block, {}, { slideId: 's1', blockIndex: 0 });
  assert.match(out.js, /setAttribute\('aria-selected'/);
  assert.match(out.js, /setAttribute\('tabindex'/);
  assert.match(out.js, /ArrowRight/);
  assert.match(out.js, /ArrowLeft/);
});

test('mode-toggle: render handles 3 modes', () => {
  const block = nestedList('- A\n  - a1\n- B\n  - b1\n- C\n  - c1');
  const out = modeToggle.render(block, {}, { slideId: 's1', blockIndex: 0 });
  assert.match(out.html, /data-df-mode-tab="0">A</);
  assert.match(out.html, /data-df-mode-tab="1">B</);
  assert.match(out.html, /data-df-mode-tab="2">C</);
});

test('mode-toggle: emits IIFE-wrapped JS', () => {
  const block = nestedList('- A\n  - a\n- B\n  - b');
  const out = modeToggle.render(block, {}, { slideId: 's1', blockIndex: 0 });
  assert.match(out.js, /^\(function\(\)\{/);
  assert.match(out.js, /\}\)\(\);$/);
  assert.match(out.js, /data-df-mode-toggle/);
});

test('mode-toggle: two toggles on one slide dedupe to a single JS chunk', () => {
  const blocks = [
    { type: 'nested-bullet-list', data: nestedList('- A\n  - a\n- B\n  - b').data, directive: { name: 'mode-toggle', params: {} }, line: 1 },
    { type: 'nested-bullet-list', data: nestedList('- C\n  - c\n- D\n  - d').data, directive: { name: 'mode-toggle', params: {} }, line: 5 },
  ];
  const rendered = renderSlide(mkSlide(blocks));
  const occurrences = (rendered.transformerJs.match(/document\.querySelectorAll/g) || []).length;
  assert.equal(occurrences, 1, 'mode-toggle js should be emitted exactly once per slide');
  const cssOccurrences = (rendered.transformerCss.match(/\.mode-toggle-panel\.active/g) || []).length;
  assert.equal(cssOccurrences, 1, 'mode-toggle css should be deduped too');
});
