/**
 * Section-divider shell — opt-in shell for "Part One / Part Two"
 * transition slides. Adds a `.section-label` element and the pulse
 * animation class around the slide heading.
 *
 * Not used by default in v1 (the default H1 shell stays `hero`) to keep
 * the foundation plan byte-identical with pre-change output. Enable via
 * `<!-- df: shell-section-divider label="Part One" -->`.
 */

export default {
  name: 'section-divider',
  render(slide, bodyHtml, params = {}) {
    const label = params.label || slide.title || '';
    const labelHtml = label
      ? `<div class="section-label pulse">${label}</div>\n`
      : '';
    return {
      sectionClass: 'section centered fade-on-scroll',
      styles: '',
      bodyHtml: `${labelHtml}${bodyHtml}`,
    };
  },
};
