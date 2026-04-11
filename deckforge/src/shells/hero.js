/**
 * Hero shell — the first (and, by default, every) H1 group-header slide.
 *
 * v1 accepts `{ title, subtitle, authors?, decoration? }` in `params` but
 * only uses them to compose the same centered section the pre-change
 * generator produced. Richer parameterization is deferred to the next
 * milestone (design-doc open question 3).
 */

const heroStyles = `<style>
    .section.centered h1 {
      font-size: 4rem;
      color: var(--text-primary);
    }
    .section.centered p {
      font-size: 1.3rem;
      color: var(--text-secondary);
      max-width: 600px;
    }
  </style>`;

export default {
  name: 'hero',
  render(slide, bodyHtml) {
    return {
      sectionClass: 'section centered fade-on-scroll',
      styles: heroStyles,
      bodyHtml,
    };
  },
};
