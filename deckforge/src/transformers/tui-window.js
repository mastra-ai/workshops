/**
 * tui-window — TUI-framed code block.
 *
 * Wraps a code-block's source in the shared `.tui-window` chrome from
 * `theme/shared.css` (titlebar + dots + title + body). Title defaults to
 * the code-block's language tag, or "terminal" when the block is untagged.
 */

import { escapeHtml } from './util.js';

export default {
  name: 'tui-window',
  accepts: ['code-block'],
  validate() {
    return { ok: true };
  },
  render(block, params) {
    const source = (block.data && block.data.source) || '';
    const lang = block.data && block.data.lang;
    const rawTitle = params.title !== undefined ? params.title : (lang || 'terminal');
    const title = escapeHtml(rawTitle);
    const body = escapeHtml(source);
    const html = `<div class="tui-window fade-on-scroll">
  <div class="tui-titlebar">
    <div class="tui-dots"><span></span><span></span><span></span></div>
    <div class="tui-title">${title}</div>
  </div>
  <pre class="tui-body"><code>${body}</code></pre>
</div>
`;
    return { html };
  },
};
