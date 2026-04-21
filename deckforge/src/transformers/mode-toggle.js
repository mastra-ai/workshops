/**
 * mode-toggle — tabbed toggle over a nested bullet list.
 *
 * Parents are tabs, children are panels. The first tab is active by default.
 * The click handler is a single slide-level IIFE (dedup key: transformer
 * name) that walks every `[data-df-mode-toggle]` wrapper on the slide, so
 * the script appears exactly once regardless of how many toggles the slide
 * contains.
 *
 * ARIA: follows the WAI-ARIA tab pattern — `role="tab"` on buttons with
 * `aria-selected` / `aria-controls`; `role="tabpanel"` on panels with
 * `aria-labelledby`. Arrow-left/right cycles focus between tabs in the same
 * tablist (inactive tabs carry `tabindex="-1"` so Tab only lands on the
 * active one).
 */

import { renderSpans, escapeHtml } from './util.js';

function spansToText(spans) {
  return (spans || []).map(s => s.text || '').join('');
}

const TOGGLE_JS = `(function(){
  document.querySelectorAll('[data-df-mode-toggle]').forEach(function(wrap){
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[data-df-mode-tab]'));
    var panels = wrap.querySelectorAll('[data-df-mode-panel]');
    function activate(key){
      tabs.forEach(function(t){
        var on = t.getAttribute('data-df-mode-tab') === key;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
      });
      panels.forEach(function(p){
        var on = p.getAttribute('data-df-mode-panel') === key;
        p.classList.toggle('active', on);
        if (on) { p.removeAttribute('hidden'); } else { p.setAttribute('hidden', ''); }
      });
    }
    tabs.forEach(function(tab, idx){
      tab.addEventListener('click', function(){
        activate(tab.getAttribute('data-df-mode-tab'));
      });
      tab.addEventListener('keydown', function(e){
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
          e.preventDefault();
          e.stopPropagation();
          activate(next.getAttribute('data-df-mode-tab'));
          next.focus();
        }
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
      const active = i === 0;
      const cls = `mode-toggle-tab${active ? ' active' : ''}`;
      const tabId = `${wrapId}-tab-${i}`;
      const panelId = `${wrapId}-panel-${i}`;
      return `    <button type="button" id="${tabId}" class="${cls}" role="tab" aria-selected="${active}" aria-controls="${panelId}" tabindex="${active ? '0' : '-1'}" data-df-mode-tab="${i}">${label}</button>`;
    }).join('\n');

    const panels = items.map((item, i) => {
      const active = i === 0;
      const cls = `mode-toggle-panel${active ? ' active' : ''}`;
      const hidden = active ? '' : ' hidden';
      const tabId = `${wrapId}-tab-${i}`;
      const panelId = `${wrapId}-panel-${i}`;
      const children = item.children.map(c => `      <li>${renderSpans(c.spans)}</li>`).join('\n');
      return `    <div id="${panelId}" class="${cls}" role="tabpanel" aria-labelledby="${tabId}" data-df-mode-panel="${i}"${hidden}>
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
