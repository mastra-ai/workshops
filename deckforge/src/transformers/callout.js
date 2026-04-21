/**
 * callout — box-quote/callout transformer.
 *
 * Consumes `blockquote` or `paragraph`. Color variants beyond the shared
 * accent default are emitted as per-transformer CSS so `shared.css` only
 * owns the base `.callout` rule (matches the design-doc §7 split).
 */

import { renderSpans } from './util.js';

const COLORS = ['accent', 'green', 'yellow', 'orange'];

const COLOR_CSS = `.callout-green { background: var(--green-dim); border-color: rgba(34, 197, 94, 0.25); }
.callout-yellow { background: var(--yellow-dim); border-color: rgba(234, 179, 8, 0.25); }
.callout-orange { background: rgba(249, 115, 22, 0.1); border-color: rgba(249, 115, 22, 0.25); }`;

export default {
  name: 'callout',
  accepts: ['blockquote', 'paragraph'],
  validate(block, params) {
    if (params.color !== undefined && !COLORS.includes(params.color)) {
      return {
        ok: false,
        error: `callout: invalid color "${params.color}". Valid: ${COLORS.join(', ')}.`,
      };
    }
    return { ok: true };
  },
  render(block, params) {
    const color = params.color || 'accent';
    const inner = renderSpans(block.data.spans || []);
    const classes = color === 'accent'
      ? 'callout fade-on-scroll'
      : `callout callout-${color} fade-on-scroll`;
    const html = `<div class="${classes}">\n  <p>${inner}</p>\n</div>\n`;
    return { html, css: COLOR_CSS };
  },
};
