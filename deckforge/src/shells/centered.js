/**
 * Centered shell — generic centered layout for H1 group headers that
 * opt out of the hero treatment via a directive. Emits the same
 * centered wrapper as the hero shell but without the hero typography.
 */

export default {
  name: 'centered',
  render(slide, bodyHtml) {
    return {
      sectionClass: 'section centered fade-on-scroll',
      styles: '',
      bodyHtml,
    };
  },
};
