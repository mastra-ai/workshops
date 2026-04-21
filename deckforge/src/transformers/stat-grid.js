/**
 * stat-grid — numeric stat cards from a bullet list.
 *
 * Every item must begin with a **bold** span whose text is numeric
 * (`**70%**`, `**$2.4M**`, `**3×**` etc). The numeric is the figure;
 * the rest of the item is the caption.
 */

import { renderSpans, stripLeadingSeparator, splitBoldPrefix, escapeHtml } from './util.js';

const NUMERIC_RE = /^[\s$£€¥]*-?\d[\d,.]*\s*[%kmbMBtT×x+]?\s*$/;

function isNumericText(text) {
  if (!text) return false;
  return NUMERIC_RE.test(text.trim());
}

function isTruthyParam(value) {
  if (value === undefined || value === null) return false;
  if (value === true || value === 'true' || value === '1' || value === '') return true;
  return false;
}

export default {
  name: 'stat-grid',
  accepts: ['bullet-list'],
  validate(block) {
    const items = (block.data && block.data.items) || [];
    if (items.length === 0) {
      return { ok: false, error: 'stat-grid: needs at least one item.' };
    }
    for (let i = 0; i < items.length; i++) {
      const split = splitBoldPrefix(items[i]);
      if (!split) {
        return {
          ok: false,
          error: `stat-grid: item ${i + 1} must start with a **numeric** bold prefix (e.g. **70%**).`,
        };
      }
      if (!isNumericText(split.title.text)) {
        return {
          ok: false,
          error: `stat-grid: item ${i + 1} prefix "${split.title.text}" is not numeric.`,
        };
      }
    }
    return { ok: true };
  },
  render(block, params) {
    const items = block.data.items;
    const stagger = isTruthyParam(params['stagger-in']);
    const cards = items.map((spans, i) => {
      const split = splitBoldPrefix(spans);
      const number = escapeHtml(split.title.text.trim());
      const bodySpans = split.body.slice();
      if (bodySpans[0] && bodySpans[0].kind === 'text') {
        bodySpans[0] = {
          kind: 'text',
          text: stripLeadingSeparator(bodySpans[0].text),
        };
      }
      const label = renderSpans(bodySpans).trim();
      const labelHtml = label ? `\n    <div class="stat-label">${label}</div>` : '';
      const style = stagger ? ` style="animation-delay: ${i * 80}ms;"` : '';
      return `  <div class="stat-card fade-on-scroll"${style}>\n    <div class="stat-number">${number}</div>${labelHtml}\n  </div>`;
    }).join('\n');

    const wrapperClass = stagger ? 'stat-grid df-stagger-in' : 'stat-grid';
    const dataAttr = stagger ? ' data-stagger-in="true"' : '';
    const html = `<div class="${wrapperClass}"${dataAttr}>\n${cards}\n</div>\n`;

    const css = stagger
      ? `.stat-grid.df-stagger-in > .stat-card { opacity: 0; transform: translateY(8px); animation: dfStaggerFade 0.5s ease forwards; }
@keyframes dfStaggerFade { to { opacity: 1; transform: translateY(0); } }`
      : undefined;

    return css ? { html, css } : { html };
  },
};
