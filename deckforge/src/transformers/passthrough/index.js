/**
 * Passthrough transformers — one per primitive.
 *
 * These exist so that a directive-free deck always has a renderer for every
 * block type. They delegate to a shared marked renderer whose output is
 * byte-identical to the pre-change `src/generator.js` output. When a v1
 * transformer is added later for a primitive, it takes precedence over the
 * passthrough; nothing else changes.
 */

import { marked } from 'marked';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createRenderer() {
  const renderer = new marked.Renderer();

  renderer.heading = function (token) {
    const content = this.parser.parseInline(token.tokens);
    return `<h${token.depth}>${content}</h${token.depth}>\n`;
  };

  renderer.paragraph = function (token) {
    const content = this.parser.parseInline(token.tokens);
    return `<p>${content}</p>\n`;
  };

  // Recursively flatten any nested list that has exactly one item: the
  // lone child becomes inline content of the parent item. A single
  // sub-bullet is a visual dead weight — authors almost always mean "one
  // sentence of context under this heading", not "a bulleted list of one".
  function flattenSingleChildSublists(items) {
    for (const item of items || []) {
      if (!item.tokens) continue;
      const out = [];
      for (const sub of item.tokens) {
        if (sub.type === 'list') {
          if ((sub.items || []).length === 1) {
            const only = sub.items[0];
            flattenSingleChildSublists([only]);
            out.push(...(only.tokens || []));
          } else {
            flattenSingleChildSublists(sub.items);
            out.push(sub);
          }
        } else {
          out.push(sub);
        }
      }
      item.tokens = out;
    }
  }

  renderer.list = function (token) {
    flattenSingleChildSublists(token.items);
    const items = token.items || [];

    const renderedItems = items.map(item => {
      let inner = '';
      if (item.tokens && item.tokens.length > 0) {
        inner = marked.parser(item.tokens, { renderer });
      } else {
        inner = item.text || '';
      }
      return inner.trim();
    });

    // A card list is any bullet list whose items all start with a bold
    // heading paragraph. The body may be inline (`**Title** — body`) or a
    // second paragraph (from a flattened single-child sub-bullet).
    const isCardList = renderedItems.every(html => /^<p>\s*<strong>/.test(html));

    if (isCardList && renderedItems.length >= 2) {
      const cols = renderedItems.length <= 2 ? 2 : renderedItems.length <= 3 ? 3 : renderedItems.length <= 4 ? 2 : 3;
      let html = `<div class="card-grid" style="grid-template-columns: repeat(${cols}, 1fr);">\n`;
      for (const itemHtml of renderedItems) {
        const match = itemHtml.match(/^<p>\s*<strong>([\s\S]*?)<\/strong>([\s\S]*?)<\/p>\s*([\s\S]*)$/);
        if (!match) {
          html += `  <div class="card fade-on-scroll">\n    ${itemHtml}\n  </div>\n`;
          continue;
        }
        const title = match[1];
        // Strip separator noise (hyphen, en-dash, em-dash, colon, period)
        // between the title and the inline body — authors write
        // `**Title** — body` purely as a visual affordance; redundant
        // here.
        const inlineBody = match[2].replace(/^[\s\-\u2013\u2014:.]+/, '').trim();
        const trailing = match[3].trim();

        let bodyHtml = '';
        if (inlineBody) {
          bodyHtml = `\n    <p>${inlineBody}</p>`;
        } else if (trailing) {
          // From a flattened single-child sub-bullet: typically a single
          // `<p>` to unwrap so the card markup stays flat.
          const onlyP = trailing.match(/^<p>([\s\S]*?)<\/p>\s*$/);
          bodyHtml = onlyP
            ? `\n    <p>${onlyP[1].trim()}</p>`
            : `\n    ${trailing}`;
        }
        html += `  <div class="card fade-on-scroll">\n    <h4>${title}</h4>${bodyHtml}\n  </div>\n`;
      }
      html += `</div>\n`;
      return html;
    }

    const tag = token.ordered ? 'ol' : 'ul';
    let html = `<${tag}>\n`;
    for (const itemHtml of renderedItems) {
      html += `<li>${itemHtml}</li>\n`;
    }
    html += `</${tag}>\n`;
    return html;
  };

  renderer.code = function ({ text, lang }) {
    const language = lang || '';
    return `<div class="code-block fade-on-scroll">
  <div class="code-header">
    <span class="code-filename"></span>
    ${language ? `<span class="code-lang">${language}</span>` : ''}
  </div>
  <pre class="code-body"><code>${escapeHtml(text)}</code></pre>
</div>\n`;
  };

  renderer.blockquote = function (token) {
    const inner = this.parser.parse(token.tokens);
    return `<div class="callout fade-on-scroll">\n  ${inner}\n</div>\n`;
  };

  renderer.codespan = function ({ text }) {
    return `<code>${text}</code>`;
  };

  renderer.hr = function () {
    return `<hr style="border: none; border-top: 1px solid var(--border); margin: 2rem 0;">\n`;
  };

  return renderer;
}

const sharedRenderer = createRenderer();

function renderToken(token) {
  return marked.parser([token], { renderer: sharedRenderer });
}

function makeTransformer(name, accepts) {
  return {
    name,
    accepts: [accepts],
    validate() {
      return { ok: true };
    },
    render(block) {
      const token = block.data && block.data.token;
      if (!token) {
        return { html: '' };
      }
      return { html: renderToken(token) };
    },
  };
}

export const heading = makeTransformer('passthrough-heading', 'heading');
export const paragraph = makeTransformer('passthrough-paragraph', 'paragraph');
export const bulletList = makeTransformer('passthrough-bullet-list', 'bullet-list');
export const nestedBulletList = makeTransformer('passthrough-nested-bullet-list', 'nested-bullet-list');
export const orderedList = makeTransformer('passthrough-ordered-list', 'ordered-list');
export const codeBlock = makeTransformer('passthrough-code-block', 'code-block');
export const blockquote = makeTransformer('passthrough-blockquote', 'blockquote');
export const image = makeTransformer('passthrough-image', 'image');
export const horizontalRule = makeTransformer('passthrough-horizontal-rule', 'horizontal-rule');

export const htmlPassthrough = {
  name: 'passthrough-html',
  accepts: ['html-passthrough'],
  validate() {
    return { ok: true };
  },
  render(block) {
    return { html: (block.data.raw || '') + '\n' };
  },
};

export const passthroughByType = {
  'heading': heading,
  'paragraph': paragraph,
  'bullet-list': bulletList,
  'nested-bullet-list': nestedBulletList,
  'ordered-list': orderedList,
  'code-block': codeBlock,
  'blockquote': blockquote,
  'image': image,
  'horizontal-rule': horizontalRule,
  'html-passthrough': htmlPassthrough,
};

export default passthroughByType;
