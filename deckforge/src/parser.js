/**
 * Markdown → Slide IR parser.
 *
 * The parser does a line-based pre-split into slides (H1 = group header,
 * H2 = vertical slide, `---` = explicit break), then runs `marked.lexer()`
 * on each slide's markdown to produce a tree of IR blocks.
 *
 * The IR block's `data` carries the structured payload described in the
 * design doc (§1), while `data.token` holds the raw marked token so the
 * passthrough transformers can recycle marked's renderer pipeline without
 * drifting from the pre-change HTML output.
 *
 * Directive parsing (`<!-- df: ... -->`) lives here for now; if it grows
 * past ~80 lines, lift it into `src/directives.js` per the plan's open
 * question 2.
 */

import { marked } from 'marked';
import { hashBlocks } from './ir.js';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractDeckTitle(mdSource) {
  const fm = mdSource.match(/^---\n([\s\S]*?)\n---/);
  if (fm) {
    const t = fm[1].match(/^title:\s*(.+)$/m);
    if (t) return t[1].trim().replace(/^["']|["']$/g, '');
  }
  const h1 = mdSource.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return 'Untitled Deck';
}

function parseDirective(raw) {
  const m = raw.match(/^<!--\s*df:\s*([a-z0-9-]+)([\s\S]*?)-->\s*$/i);
  if (!m) return null;
  const name = m[1];
  const paramStr = m[2].trim();
  const params = {};
  const re = /([a-zA-Z_][a-zA-Z0-9_-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;
  let match;
  while ((match = re.exec(paramStr)) !== null) {
    params[match[1]] = match[2] ?? match[3] ?? match[4];
  }
  return { name, params };
}

function parseAnchor(text) {
  const m = text.match(/^(.*?)\s*\{#([a-z0-9-]+)\}\s*$/i);
  if (m) return { text: m[1].trim(), anchor: m[2] };
  return { text, anchor: null };
}

function inlineTokensToSpans(tokens) {
  const spans = [];
  for (const t of tokens || []) {
    if (t.type === 'text') spans.push({ kind: 'text', text: t.text });
    else if (t.type === 'strong') spans.push({ kind: 'bold', text: t.text });
    else if (t.type === 'em') spans.push({ kind: 'italic', text: t.text });
    else if (t.type === 'codespan') spans.push({ kind: 'code', text: t.text });
    else if (t.type === 'link') spans.push({ kind: 'text', text: t.text });
    else if (t.raw) spans.push({ kind: 'text', text: t.raw });
  }
  return spans;
}

function isNestedList(listToken) {
  for (const item of listToken.items || []) {
    for (const sub of item.tokens || []) {
      if (sub.type === 'list') return true;
    }
  }
  return false;
}

function tokenToBlock(token, directive, line) {
  if (token.type === 'heading') {
    const { text, anchor } = parseAnchor(token.text);
    return {
      type: 'heading',
      data: { level: token.depth, text, anchor, token },
      directive,
      line,
    };
  }
  if (token.type === 'paragraph') {
    const inner = token.tokens || [];
    if (inner.length === 1 && inner[0].type === 'image') {
      return {
        type: 'image',
        data: { alt: inner[0].text || '', url: inner[0].href || '', token },
        directive,
        line,
      };
    }
    return {
      type: 'paragraph',
      data: { spans: inlineTokensToSpans(inner), token },
      directive,
      line,
    };
  }
  if (token.type === 'list') {
    if (token.ordered) {
      const items = (token.items || []).map(i => inlineTokensToSpans(firstInline(i)));
      return {
        type: 'ordered-list',
        data: { items, token },
        directive,
        line,
      };
    }
    if (isNestedList(token)) {
      const items = (token.items || []).map(i => {
        const spans = inlineTokensToSpans(firstInline(i));
        const children = [];
        for (const sub of i.tokens || []) {
          if (sub.type === 'list') {
            for (const child of sub.items || []) {
              children.push({ spans: inlineTokensToSpans(firstInline(child)) });
            }
          }
        }
        return { spans, children };
      });
      return {
        type: 'nested-bullet-list',
        data: { items, token },
        directive,
        line,
      };
    }
    const items = (token.items || []).map(i => inlineTokensToSpans(firstInline(i)));
    return {
      type: 'bullet-list',
      data: { items, token },
      directive,
      line,
    };
  }
  if (token.type === 'code') {
    return {
      type: 'code-block',
      data: { lang: token.lang || null, source: token.text || '', token },
      directive,
      line,
    };
  }
  if (token.type === 'blockquote') {
    const spans = [];
    for (const inner of token.tokens || []) {
      if (inner.tokens) spans.push(...inlineTokensToSpans(inner.tokens));
    }
    return {
      type: 'blockquote',
      data: { spans, token },
      directive,
      line,
    };
  }
  if (token.type === 'hr') {
    return { type: 'horizontal-rule', data: { token }, directive, line };
  }
  if (token.type === 'html') {
    return {
      type: 'html-passthrough',
      data: { raw: token.raw || token.text || '', token },
      directive,
      line,
    };
  }
  return null;
}

function firstInline(item) {
  for (const t of item.tokens || []) {
    if (t.type === 'text' || t.type === 'paragraph') return t.tokens || [];
  }
  return item.tokens || [];
}

/**
 * Convert a slide's markdown body into an array of IR blocks.
 */
export function tokensToBlocks(markdown) {
  const tokens = marked.lexer(markdown);
  const blocks = [];
  let pendingDirective = null;
  let line = 1;
  for (const token of tokens) {
    if (token.type === 'space') {
      if (token.raw) line += (token.raw.match(/\n/g) || []).length;
      continue;
    }
    if (token.type === 'html') {
      const raw = (token.raw || token.text || '').trim();
      const dir = parseDirective(raw);
      if (dir) {
        pendingDirective = dir;
        if (token.raw) line += (token.raw.match(/\n/g) || []).length;
        continue;
      }
    }
    const block = tokenToBlock(token, pendingDirective, line);
    pendingDirective = null;
    if (block) blocks.push(block);
    if (token.raw) line += (token.raw.match(/\n/g) || []).length;
  }
  return blocks;
}

/**
 * Split the full deck markdown into slide objects with IR block trees.
 *
 * Heading discovery is line-based (to preserve the pre-change slide layout
 * rules: H1 = group header, H2 = vertical slide, `---` = explicit break).
 * Each slide's content is then lexed via `marked.lexer()` to produce blocks.
 */
export function parseMarkdown(mdSource) {
  const deckTitle = extractDeckTitle(mdSource);
  const lines = mdSource.split('\n');
  const rawSlides = [];
  let current = null;
  let groupIndex = -1;
  let currentGroupId = null;
  let slideCounter = 0;

  function pushCurrent() {
    if (current && current.lines.length > 0) {
      current.markdown = current.lines.join('\n').trim();
      delete current.lines;
      if (current.markdown) {
        current.slideIndex = slideCounter++;
        rawSlides.push(current);
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const isSeparator = /^---+\s*$/.test(line);

    if (h1Match) {
      pushCurrent();
      groupIndex++;
      const title = h1Match[1].trim();
      const slug = slugify(title);
      currentGroupId = slug;
      current = {
        id: slug,
        title,
        nav: title.length > 20 ? title.slice(0, 18) + '…' : title,
        lines: [line],
        level: 1,
        group: null,
        groupIndex,
        isGroupHeader: true,
      };
    } else if (h2Match) {
      pushCurrent();
      const title = h2Match[1].trim();
      const slug = slugify(title);
      current = {
        id: `${currentGroupId ? currentGroupId + '-' : ''}${slug}`,
        title,
        nav: title.length > 20 ? title.slice(0, 18) + '…' : title,
        lines: [line],
        level: 2,
        group: currentGroupId,
        groupIndex: Math.max(groupIndex, 0),
        isGroupHeader: false,
      };
    } else if (isSeparator && current) {
      pushCurrent();
      current = {
        id: `${currentGroupId || 'slide'}-${slideCounter}`,
        title: '',
        nav: '',
        lines: [],
        level: 2,
        group: currentGroupId,
        groupIndex: Math.max(groupIndex, 0),
        isGroupHeader: false,
      };
    } else {
      if (!current) {
        groupIndex++;
        currentGroupId = 'title';
        current = {
          id: 'title',
          title: 'Title',
          nav: 'Title',
          lines: [],
          level: 1,
          group: null,
          groupIndex,
          isGroupHeader: true,
        };
      }
      current.lines.push(line);
    }
  }
  pushCurrent();

  // Dedupe ids
  const seen = new Map();
  for (const s of rawSlides) {
    if (seen.has(s.id)) {
      const n = seen.get(s.id) + 1;
      seen.set(s.id, n);
      s.id = `${s.id}-${n}`;
    } else {
      seen.set(s.id, 1);
    }
  }

  const slides = rawSlides.map(raw => {
    const blocks = tokensToBlocks(raw.markdown);
    let shellDirective = null;
    if (blocks.length > 0 && blocks[0].directive && blocks[0].directive.name.startsWith('shell-')) {
      shellDirective = {
        name: blocks[0].directive.name.slice('shell-'.length),
        params: blocks[0].directive.params,
      };
      blocks[0].directive = null;
    }
    return {
      id: raw.id,
      title: raw.title,
      nav: raw.nav,
      level: raw.level,
      group: raw.group,
      groupIndex: raw.groupIndex,
      slideIndex: raw.slideIndex,
      isGroupHeader: raw.isGroupHeader,
      shellDirective,
      blocks,
      contentHash: hashBlocks(blocks),
      markdown: raw.markdown,
    };
  });

  return { deckTitle, slides };
}

export { parseDirective };
