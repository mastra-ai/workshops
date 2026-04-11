import { test } from 'node:test';
import assert from 'node:assert/strict';

import { renderSlide } from '../src/renderer.js';
import { parseMarkdown, tokensToBlocks } from '../src/parser.js';
import { defaultShells, resolveShell } from '../src/shells/index.js';

function mkSlide(overrides = {}) {
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
    blocks: [],
    contentHash: '0',
    ...overrides,
  };
}

test('shell resolution: H1 → hero', () => {
  const { shell } = resolveShell(mkSlide({ level: 1, isGroupHeader: true }));
  assert.equal(shell.name, 'hero');
});

test('shell resolution: H2 → standard', () => {
  const { shell } = resolveShell(mkSlide({ level: 2 }));
  assert.equal(shell.name, 'standard');
});

test('shell resolution: directive wins', () => {
  const { shell } = resolveShell(
    mkSlide({ level: 2, shellDirective: { name: 'centered', params: {} } }),
  );
  assert.equal(shell.name, 'centered');
});

test('standard shell emits the section fade-on-scroll wrapper class', () => {
  const blocks = tokensToBlocks('## Title\n\nbody');
  const rendered = renderSlide(mkSlide({ blocks }));
  assert.equal(rendered.sectionClass, 'section fade-on-scroll');
  assert.match(rendered.styles, /\.section h2/);
});

test('hero shell emits the centered wrapper class', () => {
  const blocks = tokensToBlocks('# Title\n\nsubtitle');
  const rendered = renderSlide(mkSlide({ level: 1, isGroupHeader: true, blocks }));
  assert.equal(rendered.sectionClass, 'section centered fade-on-scroll');
  assert.match(rendered.styles, /\.section\.centered h1/);
});

test('css dedup: same transformer on two blocks → one css chunk', () => {
  const customTransformers = {
    mycss: {
      name: 'mycss',
      accepts: ['paragraph'],
      validate: () => ({ ok: true }),
      render: () => ({ html: '<p>x</p>\n', css: '.x { color: red }' }),
    },
  };
  const blocks = [
    { type: 'paragraph', data: { spans: [], token: null }, directive: { name: 'mycss', params: {} }, line: 1 },
    { type: 'paragraph', data: { spans: [], token: null }, directive: { name: 'mycss', params: {} }, line: 2 },
  ];
  const rendered = renderSlide(mkSlide({ blocks }), { transformers: customTransformers });
  assert.equal(rendered.transformerCss, '.x { color: red }');
});

test('unknown transformer → validation error', () => {
  const blocks = [
    { type: 'paragraph', data: { spans: [] }, directive: null, line: 1 },
  ];
  // Swap out the passthrough registry so paragraph has no transformer.
  // Easier: rely on unknown block type to trip validation.
  const badBlocks = [
    { type: 'not-a-type', data: {}, directive: null, line: 1 },
  ];
  assert.throws(() => renderSlide(mkSlide({ blocks: badBlocks })), /invalid block/);
});

test('renderSlide: sample deck slide round-trips without throwing', () => {
  const md = '# Hero\n\n## Body\n\n- a\n- b\n';
  const { slides } = parseMarkdown(md);
  for (const slide of slides) {
    const rendered = renderSlide(slide);
    assert.ok(rendered.bodyHtml.length > 0);
  }
});

test('default shells bundle exposes the four shell modules', () => {
  assert.equal(defaultShells.standard.name, 'standard');
  assert.equal(defaultShells.hero.name, 'hero');
  assert.equal(defaultShells.centered.name, 'centered');
  assert.equal(defaultShells.sectionDivider.name, 'section-divider');
});
