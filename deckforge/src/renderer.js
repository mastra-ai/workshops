/**
 * Renderer — walks the slide IR, dispatches each block to a transformer
 * (or the passthrough for that primitive), composes the slide shell, and
 * writes the HTML output tree.
 *
 * Per-slide CSS/JS contributed by transformers is deduped by transformer
 * `name` so the same transformer used twice on a slide contributes one
 * `<style>` / `<script>` block.
 */

import fs from 'fs';
import path from 'path';

import { parseMarkdown } from './parser.js';
import { defaultShells, resolveShell } from './shells/index.js';
import { passthroughByType } from './transformers/passthrough/index.js';
import { v1Transformers } from './transformers/index.js';
import { validateBlock } from './ir.js';

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array(b.length + 1);
  let curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

function closestTransformerName(name, known) {
  let best = null;
  let bestDist = Infinity;
  for (const k of known) {
    const d = levenshtein(name, k);
    if (d < bestDist) { bestDist = d; best = k; }
  }
  const threshold = Math.max(2, Math.floor(name.length / 3));
  return bestDist <= threshold ? best : null;
}

function lookupTransformer(block, transformers) {
  if (block.directive) {
    const name = block.directive.name;
    if (transformers[name]) return transformers[name];
    const known = Object.keys(transformers);
    const suggestion = closestTransformerName(name, known);
    const hint = suggestion ? ` Did you mean "${suggestion}"?` : '';
    throw new Error(
      `unknown transformer "${name}" at line ${block.line}.${hint} ` +
      `Available: ${known.join(', ') || '(none registered)'}`
    );
  }
  return passthroughByType[block.type];
}

const ERROR_PANEL_CSS = `.df-error-panel { background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 10px; padding: 1rem 1.25rem; margin-top: 1.5rem; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.85rem; }
.df-error-panel strong { color: #ef4444; display: block; margin-bottom: 0.5rem; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; }
.df-error-panel pre { white-space: pre-wrap; word-break: break-word; margin: 0; color: var(--text-secondary); }`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function errorPanel(message, block) {
  const lineHint = block && block.line ? ` (line ${block.line})` : '';
  return `<div class="df-error-panel">\n  <strong>DeckForge error${lineHint}</strong>\n  <pre>${escapeHtml(message)}</pre>\n</div>\n`;
}

/**
 * Render a single slide IR into the inner body HTML + wrapper info.
 * Returns `{ html, css, js, sectionClass, styles }` so the deck-level
 * renderer can compose the final file.
 */
export function renderSlide(slide, opts = {}) {
  const transformers = opts.transformers || v1Transformers;
  const shells = opts.shells || defaultShells;
  const mode = opts.mode === 'dev' ? 'dev' : 'build';

  const cssByName = new Map();
  const jsByName = new Map();
  const parts = [];

  function handleBlockError(err, block) {
    if (mode === 'build') throw err;
    parts.push(errorPanel(err.message, block));
    if (!cssByName.has('__df_error_panel__')) {
      cssByName.set('__df_error_panel__', ERROR_PANEL_CSS);
    }
  }

  for (let i = 0; i < slide.blocks.length; i++) {
    const block = slide.blocks[i];
    const v = validateBlock(block);
    if (!v.ok) {
      handleBlockError(new Error(`invalid block at slide=${slide.id} index=${i}: ${v.error}`), block);
      continue;
    }
    let tx;
    try {
      tx = lookupTransformer(block, transformers);
    } catch (err) {
      handleBlockError(err, block);
      continue;
    }
    if (!tx) {
      handleBlockError(new Error(`no transformer for block type="${block.type}" on slide "${slide.id}"`), block);
      continue;
    }
    const params = (block.directive && block.directive.params) || {};
    try {
      const validated = tx.validate ? tx.validate(block, params) : { ok: true };
      if (!validated.ok) {
        throw new Error(`transformer ${tx.name} rejected block: ${validated.error}`);
      }
      const ctx = { slideId: slide.id, blockIndex: i };
      const out = tx.render(block, params, ctx);
      parts.push(out.html || '');
      if (out.css && !cssByName.has(tx.name)) cssByName.set(tx.name, out.css);
      if (out.js && !jsByName.has(tx.name)) jsByName.set(tx.name, out.js);
    } catch (err) {
      handleBlockError(err, block);
      continue;
    }
  }

  const bodyHtml = parts.join('');
  const resolved = resolveShell(slide, shells);
  const shelled = resolved.shell.render(slide, bodyHtml, resolved.params);

  return {
    sectionClass: shelled.sectionClass,
    styles: shelled.styles,
    bodyHtml: shelled.bodyHtml,
    transformerCss: [...cssByName.values()].join('\n'),
    transformerJs: [...jsByName.values()].join('\n'),
  };
}

function composeSlideHtml(slide, deckTitle, rendered) {
  const extraStyle = rendered.transformerCss
    ? `\n  <style>\n${rendered.transformerCss}\n  </style>`
    : '';
  const extraScript = rendered.transformerJs
    ? `\n  <script>\n${rendered.transformerJs}\n  </script>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${slide.title} — ${deckTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  ${rendered.styles}${extraStyle}
</head>
<body>
  <!-- NAV_PLACEHOLDER: organizer will inject topnav here -->
  <div class="page">
    <div class="main">
      <div class="${rendered.sectionClass}" id="${slide.id}">
        ${rendered.bodyHtml}
      </div>
    </div>
  </div>
  <script src="shared.js"><\/script>${extraScript}
  <!-- KEYNAV_PLACEHOLDER: organizer will inject initKeyNav call here -->
</body>
</html>`;
}

function composeIndexHtml(deckTitle, slides) {
  const links = slides.map((s, i) => {
    const num = String(i + 1).padStart(2, '0');
    const filename = `${num}-${s.id}.html`;
    return `      <a href="${filename}" class="card"><span class="demo-number">${num}</span><h4>${s.nav || s.title}</h4></a>`;
  }).join('\n');
  const firstFile = `01-${slides[0]?.id || 'title'}.html`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${deckTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .index-wrapper { text-align: center; max-width: 900px; padding: 2rem; }
    .index-wrapper h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .index-wrapper .subtitle { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 2.5rem; }
    .slide-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; text-align: left; }
    .slide-grid .card { text-decoration: none; cursor: pointer; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .slide-grid .card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .slide-grid .card .demo-number { font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent); }
    .slide-grid .card h4 { color: var(--text-primary); font-size: 0.95rem; margin: 0; }
    .start-link { display: inline-block; margin-bottom: 2rem; padding: 0.75rem 2rem; background: var(--accent); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.2s; }
    .start-link:hover { background: var(--accent-hover); }
  </style>
</head>
<body>
  <div class="index-wrapper">
    <h1>${deckTitle}</h1>
    <p class="subtitle">${slides.length} slides</p>
    <a href="${firstFile}" class="start-link">Start Presentation &rarr;</a>
    <div class="slide-grid">
${links}
    </div>
  </div>
</body>
</html>`;
}

/**
 * Full deck render: parse markdown, render each slide, write the output
 * tree (slides + `deck.json` + `index.html`). Returns the manifest.
 */
export function renderDeck(mdPath, outputDir, opts = {}) {
  const mdSource = fs.readFileSync(mdPath, 'utf-8');
  const { deckTitle, slides } = parseMarkdown(mdSource);

  fs.mkdirSync(outputDir, { recursive: true });

  const manifest = [];
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const num = String(i + 1).padStart(2, '0');
    const filename = `${num}-${slide.id}.html`;
    const rendered = renderSlide(slide, opts);
    const html = composeSlideHtml(slide, deckTitle, rendered);
    fs.writeFileSync(path.join(outputDir, filename), html);
    manifest.push({
      file: filename,
      nav: slide.nav || slide.title,
      title: slide.title,
      level: slide.level,
      group: slide.group,
      groupIndex: slide.groupIndex,
      isGroupHeader: slide.isGroupHeader || false,
    });
  }

  const deckJson = { title: deckTitle, slides: manifest };
  fs.writeFileSync(path.join(outputDir, 'deck.json'), JSON.stringify(deckJson, null, 2));
  fs.writeFileSync(path.join(outputDir, 'index.html'), composeIndexHtml(deckTitle, slides));

  return deckJson;
}
