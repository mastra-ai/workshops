/**
 * Slide Generator (Component 1)
 *
 * Parses a single Markdown file into individual HTML slide files.
 *
 * Markdown structure:
 *   # Group Title        → group header slide (horizontal nav)
 *   ## Slide Title        → vertical slide within group
 *   ### Subsection        → subsection within a slide (not a new slide)
 *   ---                   → explicit slide break (within same group)
 *
 * Each H1 starts a new group. Each H2 starts a new slide within that group.
 * Content before the first heading becomes the title slide.
 */

import { marked } from 'marked';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Markdown → Slide tree
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} Slide
 * @property {string} id - Filename-safe slug
 * @property {string} title - Display title
 * @property {string} nav - Short nav label
 * @property {string} markdown - Raw markdown content for this slide
 * @property {number} level - 1 = group header, 2 = vertical slide
 * @property {string|null} group - Parent group id (null for group headers)
 * @property {number} groupIndex - Index of the group this belongs to
 * @property {number} slideIndex - Global sequential index
 */

/**
 * Parse markdown source into an array of slide descriptors.
 */
export function parseSlides(mdSource) {
  const lines = mdSource.split('\n');
  const slides = [];
  let currentSlide = null;
  let groupIndex = -1;
  let currentGroupId = null;
  let slideCounter = 0;

  function pushCurrent() {
    if (currentSlide && currentSlide.lines.length > 0) {
      currentSlide.markdown = currentSlide.lines.join('\n').trim();
      delete currentSlide.lines;
      if (currentSlide.markdown) {
        currentSlide.slideIndex = slideCounter++;
        slides.push(currentSlide);
      }
    }
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const isSeparator = /^---+\s*$/.test(line);

    if (h1Match) {
      // New group header slide
      pushCurrent();
      groupIndex++;
      const title = h1Match[1].trim();
      const slug = slugify(title);
      currentGroupId = slug;
      currentSlide = {
        id: slug,
        title,
        nav: title.length > 20 ? title.slice(0, 18) + '…' : title,
        lines: [line],
        level: 1,
        group: null,
        groupIndex,
        isGroupHeader: true,
      };
    } else if (h2Match) {
      // New vertical slide within current group
      pushCurrent();
      const title = h2Match[1].trim();
      const slug = slugify(title);
      currentSlide = {
        id: `${currentGroupId ? currentGroupId + '-' : ''}${slug}`,
        title,
        nav: title.length > 20 ? title.slice(0, 18) + '…' : title,
        lines: [line],
        level: 2,
        group: currentGroupId,
        groupIndex: Math.max(groupIndex, 0),
        isGroupHeader: false,
      };
    } else if (isSeparator && currentSlide) {
      // Explicit break — start new slide at same level in same group
      pushCurrent();
      currentSlide = {
        id: `${currentGroupId || 'slide'}-${slideCounter}`,
        title: '',
        nav: '',
        lines: [],
        level: 2,
        group: currentGroupId,
        groupIndex: Math.max(groupIndex, 0),
        isGroupHeader: false,
      };
    } else {
      // Accumulate content
      if (!currentSlide) {
        // Content before any heading — create an implicit title slide
        groupIndex++;
        currentGroupId = 'title';
        currentSlide = {
          id: 'title',
          title: 'Title',
          nav: 'Title',
          lines: [],
          level: 1,
          group: null,
          groupIndex,
          isGroupHeader: true,
        };
      }
      currentSlide.lines.push(line);
    }
  }

  pushCurrent();

  // Deduplicate IDs
  const seen = new Map();
  for (const slide of slides) {
    if (seen.has(slide.id)) {
      const count = seen.get(slide.id) + 1;
      seen.set(slide.id, count);
      slide.id = `${slide.id}-${count}`;
    } else {
      seen.set(slide.id, 1);
    }
  }

  return slides;
}

// ---------------------------------------------------------------------------
// Markdown → HTML rendering
// ---------------------------------------------------------------------------

/**
 * Configure marked for presentation-quality HTML output.
 */
function createRenderer() {
  const renderer = new marked.Renderer();

  // Headings
  renderer.heading = function (token) {
    const content = this.parser.parseInline(token.tokens);
    return `<h${token.depth}>${content}</h${token.depth}>\n`;
  };

  // Paragraphs — render inline tokens so **bold**, *italic*, etc. work
  renderer.paragraph = function (token) {
    const content = this.parser.parseInline(token.tokens);
    return `<p>${content}</p>\n`;
  };

  // Lists → card grids when items have bold titles
  renderer.list = function (token) {
    const items = token.items || [];

    // Render each item's inner content using marked's built-in parser
    const renderedItems = items.map(item => {
      // Each list item has tokens — render them to get the HTML
      let inner = '';
      if (item.tokens && item.tokens.length > 0) {
        inner = marked.parser(item.tokens, { renderer });
      } else {
        inner = item.text || '';
      }
      return inner.trim();
    });

    // Detect a "card-style" list: every item must be a single <p> that starts
    // with <strong> and has nothing after it (no nested lists, no extra paras).
    // This lets authors opt out of card rendering by adding sub-bullets.
    const isCardList = renderedItems.every(html => {
      return /^<p>\s*<strong>[\s\S]*?<\/p>\s*$/.test(html);
    });

    if (isCardList && renderedItems.length >= 2) {
      const cols = renderedItems.length <= 2 ? 2 : renderedItems.length <= 3 ? 3 : renderedItems.length <= 4 ? 2 : 3;
      let html = `<div class="card-grid" style="grid-template-columns: repeat(${cols}, 1fr);">\n`;
      for (const itemHtml of renderedItems) {
        // Extract bold title and remaining text from the rendered HTML
        const match = itemHtml.match(/<p>\s*<strong>(.+?)<\/strong>\s*[-–:.]?\s*([\s\S]*?)<\/p>/);
        if (match) {
          html += `  <div class="card fade-on-scroll">\n    <h4>${match[1]}</h4>\n    <p>${match[2].trim()}</p>\n  </div>\n`;
        } else {
          html += `  <div class="card fade-on-scroll">\n    ${itemHtml}\n  </div>\n`;
        }
      }
      html += `</div>\n`;
      return html;
    }

    // Regular list
    const tag = token.ordered ? 'ol' : 'ul';
    let html = `<${tag}>\n`;
    for (const itemHtml of renderedItems) {
      html += `<li>${itemHtml}</li>\n`;
    }
    html += `</${tag}>\n`;
    return html;
  };

  // Code blocks → styled code component
  renderer.code = function ({ text, lang }) {
    const language = lang || '';
    return `<div class="code-block fade-on-scroll">
  <div class="code-header">
    <span class="code-filename"></span>
    ${language ? `<span class="code-lang">${language}</span>` : ''}
  </div>
  <pre class="code-body"><code>${escapeHtml(text)}</code></pre>
</div>\n`;
  };

  // Blockquotes → callout boxes
  renderer.blockquote = function (token) {
    const inner = this.parser.parse(token.tokens);
    return `<div class="callout fade-on-scroll">\n  ${inner}\n</div>\n`;
  };

  // Inline code
  renderer.codespan = function ({ text }) {
    return `<code>${text}</code>`;
  };

  // Horizontal rules within a slide → visual divider
  renderer.hr = function () {
    return `<hr style="border: none; border-top: 1px solid var(--border); margin: 2rem 0;">\n`;
  };

  return renderer;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Render a single slide's markdown to styled HTML body content.
 */
export function renderSlideContent(slide) {
  const renderer = createRenderer();
  const html = marked.parse(slide.markdown, { renderer, breaks: false });
  return html;
}

// ---------------------------------------------------------------------------
// HTML file generation
// ---------------------------------------------------------------------------

/**
 * Generate the full HTML for a single slide file.
 */
export function generateSlideHtml(slide, bodyContent, deckTitle) {
  const isHero = slide.level === 1 && slide.isGroupHeader;

  const sectionClass = isHero
    ? 'section centered fade-on-scroll'
    : 'section fade-on-scroll';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${slide.title} — ${deckTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  ${isHero ? heroStyles() : slideStyles()}
</head>
<body>
  <!-- NAV_PLACEHOLDER: organizer will inject topnav here -->
  <div class="page">
    <div class="main">
      <div class="${sectionClass}" id="${slide.id}">
        ${bodyContent}
      </div>
    </div>
  </div>
  <script src="shared.js"><\/script>
  <!-- KEYNAV_PLACEHOLDER: organizer will inject initKeyNav call here -->
</body>
</html>`;
}

function heroStyles() {
  return `<style>
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
}

function slideStyles() {
  return `<style>
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
}

// ---------------------------------------------------------------------------
// Index page generation
// ---------------------------------------------------------------------------

export function generateIndexHtml(deckTitle, slides) {
  const slideLinks = slides.map((s, i) => {
    const num = String(i + 1).padStart(2, '0');
    const filename = `${num}-${s.id}.html`;
    return `      <a href="${filename}" class="card"><span class="demo-number">${num}</span><h4>${s.nav || s.title}</h4></a>`;
  }).join('\n');

  const firstFile = `01-${slides[0]?.id || 'title'}.html`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${deckTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .index-wrapper { text-align: center; max-width: 900px; padding: 2rem; }
    .index-wrapper h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .index-wrapper .subtitle { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 2.5rem; }
    .slide-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; text-align: left; }
    .slide-grid .card { text-decoration: none; cursor: pointer; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .slide-grid .card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .slide-grid .card .demo-number { font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent); }
    .slide-grid .card h4 { color: var(--text-primary); font-size: 0.95rem; margin: 0; }
    .start-link { display: inline-block; margin-bottom: 2rem; padding: 0.75rem 2rem; background: var(--accent); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.2s; }
    .start-link:hover { background: var(--accent-hover); }
  </style>
</head>
<body>
  <div class="index-wrapper">
    <h1>${deckTitle}</h1>
    <p class="subtitle">${slides.length} slides</p>
    <a href="${firstFile}" class="start-link">Start Presentation &rarr;</a>
    <div class="slide-grid">
${slideLinks}
    </div>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Build pipeline
// ---------------------------------------------------------------------------

/**
 * Full build: read markdown, generate all HTML files into outputDir.
 * Returns the deck manifest (deck.json).
 */
export function build(mdPath, outputDir) {
  const mdSource = fs.readFileSync(mdPath, 'utf-8');

  // Extract deck title from frontmatter or first H1
  let deckTitle = 'Untitled Deck';
  const frontmatterMatch = mdSource.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/^title:\s*(.+)$/m);
    if (titleMatch) deckTitle = titleMatch[1].trim().replace(/^["']|["']$/g, '');
  } else {
    const h1Match = mdSource.match(/^#\s+(.+)$/m);
    if (h1Match) deckTitle = h1Match[1].trim();
  }

  const slides = parseSlides(mdSource);

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Generate each slide HTML
  const manifest = [];
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const num = String(i + 1).padStart(2, '0');
    const filename = `${num}-${slide.id}.html`;

    const bodyContent = renderSlideContent(slide);
    const html = generateSlideHtml(slide, bodyContent, deckTitle);

    fs.writeFileSync(path.join(outputDir, filename), html);

    manifest.push({
      file: filename,
      nav: slide.nav || slide.title,
      title: slide.title,
      level: slide.level,
      group: slide.group,
      groupIndex: slide.groupIndex,
      isGroupHeader: slide.isGroupHeader || false,
    });
  }

  // Write deck.json
  const deckJson = { title: deckTitle, slides: manifest };
  fs.writeFileSync(path.join(outputDir, 'deck.json'), JSON.stringify(deckJson, null, 2));

  // Generate index.html
  const indexHtml = generateIndexHtml(deckTitle, slides);
  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

  return deckJson;
}
