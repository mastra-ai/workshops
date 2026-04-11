/**
 * IR types and helpers for DeckForge's transformer pipeline.
 *
 * The parser emits `Slide[]` where each slide holds a tree of `Block` nodes.
 * Renderers look up a transformer per block (or fall back to the passthrough
 * for that primitive type) and compose the slide HTML.
 */

/**
 * @typedef {'heading'|'paragraph'|'bullet-list'|'nested-bullet-list'|'ordered-list'|'code-block'|'blockquote'|'image'|'horizontal-rule'|'html-passthrough'} BlockType
 *
 * @typedef {Object} Block
 * @property {BlockType} type
 * @property {Object} data
 * @property {Object|null} directive
 * @property {number} line
 *
 * @typedef {Object} Slide
 * @property {string} id
 * @property {string} title
 * @property {string} nav
 * @property {1|2} level
 * @property {string|null} group
 * @property {number} groupIndex
 * @property {number} slideIndex
 * @property {boolean} isGroupHeader
 * @property {Object|null} shellDirective
 * @property {Block[]} blocks
 * @property {string} contentHash
 *
 * @typedef {Object} Transformer
 * @property {string} name
 * @property {string[]} accepts
 * @property {(block: Block, params: Object) => {ok: true}|{ok: false, error: string}} validate
 * @property {(block: Block, params: Object, ctx: RenderCtx) => {html: string, css?: string, js?: string}} render
 *
 * @typedef {Object} RenderCtx
 * @property {string} slideId
 * @property {number} blockIndex
 */

export const PRIMITIVE_TYPES = [
  'heading',
  'paragraph',
  'bullet-list',
  'nested-bullet-list',
  'ordered-list',
  'code-block',
  'blockquote',
  'image',
  'horizontal-rule',
];

const ALL_TYPES = new Set([...PRIMITIVE_TYPES, 'html-passthrough']);

export function validateBlock(block) {
  if (!block || typeof block !== 'object') {
    return { ok: false, error: 'block must be an object' };
  }
  if (!ALL_TYPES.has(block.type)) {
    return { ok: false, error: `unknown block type: ${block.type}` };
  }
  if (!block.data || typeof block.data !== 'object') {
    return { ok: false, error: 'block.data must be an object' };
  }
  if (block.directive !== null && typeof block.directive !== 'object') {
    return { ok: false, error: 'block.directive must be an object or null' };
  }
  return { ok: true };
}

export function hashBlocks(blocks) {
  let h = 0;
  const str = JSON.stringify(blocks.map(b => ({ t: b.type, d: b.data })));
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16);
}
