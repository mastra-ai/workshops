import { test } from 'node:test';
import assert from 'node:assert/strict';

import tuiWindow from '../../src/transformers/tui-window.js';
import { tokensToBlocks } from '../../src/parser.js';

function codeBlock(md) {
  return tokensToBlocks(md).find(b => b.type === 'code-block');
}

test('tui-window: accepts code-block', () => {
  assert.deepEqual(tuiWindow.accepts, ['code-block']);
});

test('tui-window: validate is always ok', () => {
  assert.deepEqual(tuiWindow.validate(), { ok: true });
});

test('tui-window: default title comes from code-block lang', () => {
  const block = codeBlock('```bash\necho hi\n```');
  const out = tuiWindow.render(block, {}, {});
  assert.match(out.html, /<div class="tui-title">bash<\/div>/);
});

test('tui-window: default title falls back to "terminal" when lang is missing', () => {
  const block = codeBlock('```\necho hi\n```');
  const out = tuiWindow.render(block, {}, {});
  assert.match(out.html, /<div class="tui-title">terminal<\/div>/);
});

test('tui-window: explicit title param overrides default', () => {
  const block = codeBlock('```bash\necho hi\n```');
  const out = tuiWindow.render(block, { title: 'my-terminal' }, {});
  assert.match(out.html, /<div class="tui-title">my-terminal<\/div>/);
});

test('tui-window: renders titlebar, dots, and body with escaped content', () => {
  const block = codeBlock('```html\n<div>hi</div>\n```');
  const out = tuiWindow.render(block, {}, {});
  assert.match(out.html, /^<div class="tui-window fade-on-scroll">/);
  assert.match(out.html, /<div class="tui-dots"><span><\/span><span><\/span><span><\/span><\/div>/);
  assert.match(out.html, /<pre class="tui-body"><code>&lt;div&gt;hi&lt;\/div&gt;<\/code><\/pre>/);
});

test('tui-window: snapshot', () => {
  const block = codeBlock('```bash\n$ npm test\n```');
  const out = tuiWindow.render(block, { title: 'shell' }, {});
  const expected = `<div class="tui-window fade-on-scroll">
  <div class="tui-titlebar">
    <div class="tui-dots"><span></span><span></span><span></span></div>
    <div class="tui-title">shell</div>
  </div>
  <pre class="tui-body"><code>$ npm test</code></pre>
</div>
`;
  assert.equal(out.html, expected);
});
