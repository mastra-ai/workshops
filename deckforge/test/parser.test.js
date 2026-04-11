import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseMarkdown, tokensToBlocks, parseDirective } from '../src/parser.js';
import { PRIMITIVE_TYPES, validateBlock } from '../src/ir.js';

test('PRIMITIVE_TYPES contains the nine primitives', () => {
  assert.equal(PRIMITIVE_TYPES.length, 9);
  assert.ok(PRIMITIVE_TYPES.includes('heading'));
  assert.ok(PRIMITIVE_TYPES.includes('horizontal-rule'));
});

test('parser: heading blocks capture level and text', () => {
  const blocks = tokensToBlocks('# H1 Title\n\n## H2 Title\n\n### H3 Title');
  const headings = blocks.filter(b => b.type === 'heading');
  assert.equal(headings.length, 3);
  assert.equal(headings[0].data.level, 1);
  assert.equal(headings[0].data.text, 'H1 Title');
  assert.equal(headings[1].data.level, 2);
  assert.equal(headings[2].data.level, 3);
});

test('parser: paragraph inline spans are captured', () => {
  const blocks = tokensToBlocks('A paragraph with **bold** and *italic* and `code`.');
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, 'paragraph');
  const kinds = blocks[0].data.spans.map(s => s.kind);
  assert.ok(kinds.includes('bold'));
  assert.ok(kinds.includes('italic'));
  assert.ok(kinds.includes('code'));
});

test('parser: flat bullet list parses as bullet-list', () => {
  const blocks = tokensToBlocks('- one\n- two\n- three');
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, 'bullet-list');
  assert.equal(blocks[0].data.items.length, 3);
});

test('parser: nested bullet list parses as nested-bullet-list', () => {
  const blocks = tokensToBlocks('- outer\n  - child\n- second');
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, 'nested-bullet-list');
  assert.equal(blocks[0].data.items.length, 2);
  assert.equal(blocks[0].data.items[0].children.length, 1);
});

test('parser: ordered list parses as ordered-list', () => {
  const blocks = tokensToBlocks('1. one\n2. two');
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, 'ordered-list');
  assert.equal(blocks[0].data.items.length, 2);
});

test('parser: fenced code block captures language and source', () => {
  const blocks = tokensToBlocks('```ts\nconst x = 1;\n```');
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, 'code-block');
  assert.equal(blocks[0].data.lang, 'ts');
  assert.match(blocks[0].data.source, /const x = 1;/);
});

test('parser: blockquote captures span array', () => {
  const blocks = tokensToBlocks('> hello **world**');
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, 'blockquote');
  assert.ok(blocks[0].data.spans.length >= 1);
});

test('parser: standalone image parses as image primitive', () => {
  const blocks = tokensToBlocks('![alt](https://example.com/x.png)');
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].type, 'image');
  assert.equal(blocks[0].data.alt, 'alt');
  assert.equal(blocks[0].data.url, 'https://example.com/x.png');
});

test('parser: horizontal rule parses as horizontal-rule', () => {
  const blocks = tokensToBlocks('before\n\n***\n\nafter');
  const hr = blocks.find(b => b.type === 'horizontal-rule');
  assert.ok(hr);
});

test('validateBlock: rejects unknown type', () => {
  const r = validateBlock({ type: 'unknown', data: {}, directive: null, line: 1 });
  assert.equal(r.ok, false);
});

test('validateBlock: accepts a valid block', () => {
  const r = validateBlock({ type: 'paragraph', data: { spans: [] }, directive: null, line: 1 });
  assert.equal(r.ok, true);
});

test('parseDirective: block directive form', () => {
  const d = parseDirective('<!-- df: foo a=1 b="two words" -->');
  assert.deepEqual(d, { name: 'foo', params: { a: '1', b: 'two words' } });
});

test('parseDirective: slide shell directive', () => {
  const d = parseDirective('<!-- df: shell-hero title="Deck" -->');
  assert.equal(d.name, 'shell-hero');
  assert.equal(d.params.title, 'Deck');
});

test('parseDirective: non-matching comment returns null', () => {
  assert.equal(parseDirective('<!-- just a comment -->'), null);
});

test('parseMarkdown: splits into slides and assigns unique ids', () => {
  const md = '# One\n\n## Two\n\nbody\n\n## Three\n\nmore';
  const { slides, deckTitle } = parseMarkdown(md);
  assert.equal(deckTitle, 'One');
  assert.equal(slides.length, 3);
  assert.equal(slides[0].level, 1);
  assert.equal(slides[1].level, 2);
  const ids = new Set(slides.map(s => s.id));
  assert.equal(ids.size, slides.length);
});

test('parseMarkdown: populates contentHash and blocks per slide', () => {
  const md = '# A\n\n## B\n\n- one\n- two\n';
  const { slides } = parseMarkdown(md);
  const slide = slides.find(s => s.title === 'B');
  assert.ok(slide);
  assert.ok(slide.blocks.length >= 2);
  assert.ok(slide.contentHash.length > 0);
});
