/**
 * Standard shell — default for H2 vertical slides.
 *
 * Wraps blocks in `<div class="section fade-on-scroll" id="...">` and emits
 * the slide typography styles that the pre-change `slideStyles()` produced.
 */

const slideStyles = `<style>
    .section h2 {
      margin-bottom: 1rem;
    }
    .section h3 {
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      color: var(--accent);
    }
    .section ul, .section ol {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }
    .section li {
      font-size: 1.05rem;
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }
    .section li strong {
      color: var(--text-primary);
    }
  </style>`;

export default {
  name: 'standard',
  render(slide, bodyHtml) {
    return {
      sectionClass: 'section fade-on-scroll',
      styles: slideStyles,
      bodyHtml,
    };
  },
};
