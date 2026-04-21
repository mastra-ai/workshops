/**
 * Shared helpers for v1 transformers.
 *
 * Transformers receive IR blocks whose `data.spans` / `data.items` hold
 * structured inline content. These helpers render that content back to HTML
 * without having to round-trip through marked's renderer pipeline.
 */

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderSpans(spans) {
  let out = '';
  for (const s of spans || []) {
    if (!s) continue;
    if (s.kind === 'bold') out += `<strong>${escapeHtml(s.text)}</strong>`;
    else if (s.kind === 'italic') out += `<em>${escapeHtml(s.text)}</em>`;
    else if (s.kind === 'code') out += `<code>${escapeHtml(s.text)}</code>`;
    else out += escapeHtml(s.text);
  }
  return out;
}

/**
 * Strip a leading separator (whitespace, hyphen, en/em dash, colon, period)
 * that authors commonly write between a `**Title**` prefix and the body
 * (`**Title** — body` / `**Title**: body`). The separator is visual noise once
 * the prefix becomes its own element.
 */
export function stripLeadingSeparator(text) {
  return text.replace(/^[\s\-–—:.]+/, '');
}

/**
 * Split a span list into { titleSpan, bodySpans } where `titleSpan` is the
 * leading bold span. Returns `null` if the first span is not bold.
 */
export function splitBoldPrefix(spans) {
  if (!spans || spans.length === 0) return null;
  const [head, ...rest] = spans;
  if (!head || head.kind !== 'bold') return null;
  return { title: head, body: rest };
}
