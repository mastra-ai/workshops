/**
 * Shell registry + `resolveShell` helper.
 *
 * Precedence (§5 of the design doc, relaxed for the foundation plan's
 * byte-compat constraint):
 *
 *   1. Slide's `shellDirective` (from `<!-- df: shell-* -->`) wins.
 *   2. H1 group headers → hero (every H1, not just the first — the
 *      pre-change generator treated all H1 as centered hero slides,
 *      so the foundation plan preserves that).
 *   3. H2 vertical slides → standard.
 *
 * The first-H1-only vs other-H1-section-divider split in the design
 * doc is deferred to the v1 transformer plan; the shells exist now so
 * that change is a one-line switch later.
 */

import standard from './standard.js';
import hero from './hero.js';
import centered from './centered.js';
import sectionDivider from './section-divider.js';

export const defaultShells = {
  standard,
  hero,
  centered,
  'section-divider': sectionDivider,
  sectionDivider,
};

export function resolveShell(slide, shells = defaultShells) {
  if (slide.shellDirective && shells[slide.shellDirective.name]) {
    return {
      shell: shells[slide.shellDirective.name],
      params: slide.shellDirective.params || {},
    };
  }
  if (slide.level === 1) {
    return { shell: shells.hero, params: {} };
  }
  return { shell: shells.standard, params: {} };
}

export { standard, hero, centered, sectionDivider };
export default defaultShells;
