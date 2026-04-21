/**
 * v1 transformer registry.
 *
 * Exports the named transformers that authors opt into via `<!-- df: <name> -->`
 * and a `resolveTransformer(block, registry)` helper that returns the
 * directive-selected transformer or the passthrough fallback for the block's
 * primitive type.
 *
 * The renderer defaults `opts.transformers` to `v1Transformers`, so these
 * names are resolvable without any explicit wiring at the CLI.
 */

import callout from './callout.js';
import cardGrid from './card-grid.js';
import statGrid from './stat-grid.js';
import demoCardGrid from './demo-card-grid.js';
import tuiWindow from './tui-window.js';
import modeToggle from './mode-toggle.js';
import { passthroughByType } from './passthrough/index.js';

export const v1Transformers = {
  callout,
  'card-grid': cardGrid,
  'stat-grid': statGrid,
  'demo-card-grid': demoCardGrid,
  'tui-window': tuiWindow,
  'mode-toggle': modeToggle,
};

export function resolveTransformer(block, registry = v1Transformers) {
  if (block.directive) {
    return registry[block.directive.name] || null;
  }
  return passthroughByType[block.type] || null;
}

export { callout, cardGrid, statGrid, demoCardGrid, tuiWindow, modeToggle };
export default v1Transformers;
