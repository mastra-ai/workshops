/**
 * card-grid — grid of titled cards built from a bullet list.
 *
 * Each bullet must start with a `**bold**` prefix; the bold text becomes
 * the card title and the remaining spans become the card body. Mirrors the
 * passthrough's implicit card-list detection, but opt-in via directive.
 */

import { renderSpans, stripLeadingSeparator, splitBoldPrefix, escapeHtml } from './util.js';

function isTruthyParam(value) {
  if (value === undefined || value === null) return false;
  if (value === true || value === 'true' || value === '1' || value === '') return true;
  return false;
}

export default {
  name: 'card-grid',
  accepts: ['bullet-list'],
  validate(block) {
    const items = (block.data && block.data.items) || [];
    if (items.length === 0) {
      return { ok: false, error: 'card-grid: needs at least one item.' };
    }
    for (let i = 0; i < items.length; i++) {
      if (!splitBoldPrefix(items[i])) {
        return {
          ok: false,
          error: `card-grid: item ${i + 1} must start with a **bold** prefix.`,
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
      const title = escapeHtml(split.title.text);
      const bodySpans = split.body.slice();
      if (bodySpans[0] && bodySpans[0].kind === 'text') {
        bodySpans[0] = {
          kind: 'text',
          text: stripLeadingSeparator(bodySpans[0].text),
        };
      }
      const body = renderSpans(bodySpans).trim();
      const bodyHtml = body ? `\n    <p>${body}</p>` : '';
      const style = stagger ? ` style="animation-delay: ${i * 80}ms;"` : '';
      return `  <div class="card fade-on-scroll"${style}>\n    <h4>${title}</h4>${bodyHtml}\n  </div>`;
    }).join('\n');

    const wrapperClass = stagger
      ? 'card-grid df-stagger-in'
      : 'card-grid';
    const dataAttr = stagger ? ' data-stagger-in="true"' : '';
    const html = `<div class="${wrapperClass}"${dataAttr}>\n${cards}\n</div>\n`;

    const css = stagger
      ? `.df-stagger-in > .card { opacity: 0; transform: translateY(8px); animation: dfStaggerFade 0.5s ease forwards; }
@keyframes dfStaggerFade { to { opacity: 1; transform: translateY(0); } }`
      : undefined;

    return css ? { html, css } : { html };
  },
};
