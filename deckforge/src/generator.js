/**
 * Thin entry point for the DeckForge build pipeline.
 *
 * Pre-refactor this file was a ~460-line monolith that did slide splitting,
 * marked-token rendering, and HTML string synthesis in one place. That logic
 * now lives in:
 *
 *   - `src/parser.js`                        markdown → Slide IR
 *   - `src/transformers/passthrough/`        default per-primitive renderers
 *   - `src/shells/`                          slide shell wrappers
 *   - `src/renderer.js`                      IR → HTML + manifest
 *
 * `build()` keeps its original signature so `src/server.js` and
 * `bin/deckforge.js` do not need to change.
 */

import { parseMarkdown } from './parser.js';
import { renderDeck } from './renderer.js';

export { parseMarkdown };

export function build(mdPath, outputDir, opts = {}) {
  return renderDeck(mdPath, outputDir, opts);
}
