/**
 * mode-toggle — tabbed toggle over a nested bullet list.
 *
 * Parents are tabs, children are panels. The first tab is active by default.
 * The click handler is a single slide-level IIFE (dedup key: transformer
 * name) that walks every `[data-df-mode-toggle]` wrapper on the slide, so
 * the script appears exactly once regardless of how many toggles the slide
 * contains.
 */

import { renderSpans, escapeHtml } from './util.js';

function spansToText(spans) {
  return (spans || []).map(s => s.text || '').join('');
}

const TOGGLE_JS = `(function(){
  document.querySelectorAll('[data-df-mode-toggle]').forEach(function(wrap){
    var tabs = wrap.querySelectorAll('[data-df-mode-tab]');
    var panels = wrap.querySelectorAll('[data-df-mode-panel]');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var key = tab.getAttribute('data-df-mode-tab');
        tabs.forEach(function(t){
          t.classList.toggle('active', t.getAttribute('data-df-mode-tab') === key);
        });
        panels.forEach(function(p){
          var active = p.getAttribute('data-df-mode-panel') === key;
          p.classList.toggle('active', active);
          if (active) { p.removeAttribute('hidden'); } else { p.setAttribute('hidden', ''); }
        });
      });
    });
  });
})();`;

const TOGGLE_CSS = `.mode-toggle-wrap { margin-top: 1.5rem; }
.mode-toggle-panels { margin-top: 1rem; }
.mode-toggle-panel { display: none; }
.mode-toggle-panel.active { display: block; }
.mode-toggle-panel ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }`;

export default {
  name: 'mode-toggle',
  accepts: ['nested-bullet-list'],
  validate(block) {
    const items = (block.data && block.data.items) || [];
    if (items.length < 2) {
      return { ok: false, error: `mode-toggle: needs at least 2 modes (got ${items.length}).` };
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.children || item.children.length < 1) {
        return {
          ok: false,
          error: `mode-toggle: mode ${i + 1} must have at least one child bullet.`,
        };
      }
    }
    return { ok: true };
  },
  render(block, params, ctx) {
    const items = block.data.items;
    const slideId = (ctx && ctx.slideId) || 'slide';
    const blockIndex = (ctx && typeof ctx.blockIndex === 'number') ? ctx.blockIndex : 0;
    const wrapId = `mt-${slideId}-${blockIndex}`;

    const tabs = items.map((item, i) => {
      const label = escapeHtml(spansToText(item.spans).trim());
      const active = i === 0 ? ' active' : '';
      return `    <button type="button" class="mode-toggle-tab${active}" data-df-mode-tab="${i}">${label}</button>`;
    }).join('\n');

    const panels = items.map((item, i) => {
      const active = i === 0;
      const cls = `mode-toggle-panel${active ? ' active' : ''}`;
      const hidden = active ? '' : ' hidden';
      const children = item.children.map(c => `      <li>${renderSpans(c.spans)}</li>`).join('\n');
      return `    <div class="${cls}" data-df-mode-panel="${i}"${hidden}>
    <ul>
${children}
    </ul>
  </div>`;
    }).join('\n');

    const html = `<div class="mode-toggle-wrap" data-df-mode-toggle="${wrapId}">
  <div class="mode-toggle" role="tablist">
${tabs}
  </div>
  <div class="mode-toggle-panels">
${panels}
  </div>
</div>
`;

    return { html, css: TOGGLE_CSS, js: TOGGLE_JS };
  },
};
