/**
 * demo-card-grid — numbered card grid from a bullet list (3–6 items).
 *
 * The numbering is derived from the item order (01, 02, 03…). This is
 * structural decoration, permitted under the idempotency rule — the
 * transformer re-uses content the primitive already carries, it does not
 * invent any.
 */

import { renderSpans, stripLeadingSeparator, splitBoldPrefix, escapeHtml } from './util.js';

const MIN_ITEMS = 3;
const MAX_ITEMS = 6;

export default {
  name: 'demo-card-grid',
  accepts: ['bullet-list'],
  validate(block) {
    const items = (block.data && block.data.items) || [];
    if (items.length < MIN_ITEMS || items.length > MAX_ITEMS) {
      return {
        ok: false,
        error: `demo-card-grid: needs ${MIN_ITEMS}–${MAX_ITEMS} items (got ${items.length}).`,
      };
    }
    return { ok: true };
  },
  render(block) {
    const items = block.data.items;
    const cards = items.map((spans, i) => {
      const num = String(i + 1).padStart(2, '0');
      const split = splitBoldPrefix(spans);
      if (split) {
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
        return `  <div class="demo-card fade-on-scroll">\n    <div class="demo-number">${num}</div>\n    <h4>${title}</h4>${bodyHtml}\n  </div>`;
      }
      const body = renderSpans(spans).trim();
      const bodyHtml = body ? `\n    <p>${body}</p>` : '';
      return `  <div class="demo-card fade-on-scroll">\n    <div class="demo-number">${num}</div>${bodyHtml}\n  </div>`;
    }).join('\n');

    return { html: `<div class="demo-grid">\n${cards}\n</div>\n` };
  },
};
