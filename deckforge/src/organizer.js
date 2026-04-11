/**
 * Slide Organizer (Component 2)
 *
 * Reads deck.json and injects navigation into each HTML slide file:
 *   - Top nav bar with slide tabs (grouped by H1 sections)
 *   - Prev/next links
 *   - Keyboard navigation init with group-aware Shift+Arrow support
 *
 * This is deliberately separate from the generator so that slides
 * can be reordered just by editing deck.json and re-running organize.
 */

import fs from 'fs';
import path from 'path';

/**
 * Build the top navigation bar HTML.
 * Groups are shown as primary tabs; vertical slides within a group
 * are shown as sub-items separated by dividers.
 */
function buildTopNav(manifest, currentIndex, deckTitle) {
  const slides = manifest.slides;

  // Build nav links with group dividers
  let navLinks = '';
  let lastGroupIndex = -1;

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    // Insert a divider between groups (but not before the first)
    if (slide.groupIndex !== lastGroupIndex && lastGroupIndex !== -1) {
      navLinks += `      <span class="nav-divider">│</span>\n`;
    }
    lastGroupIndex = slide.groupIndex;

    const isActive = i === currentIndex ? ' class="active"' : '';
    const label = slide.nav || slide.title || `Slide ${i + 1}`;
    navLinks += `      <a href="${slide.file}"${isActive}>${label}</a>\n`;
  }

  // Prev/next links
  const prevFile = currentIndex > 0 ? slides[currentIndex - 1].file : null;
  const nextFile = currentIndex < slides.length - 1 ? slides[currentIndex + 1].file : null;

  const prevLink = prevFile
    ? `<a href="${prevFile}">← Prev</a>`
    : `<a class="disabled">← Prev</a>`;
  const nextLink = nextFile
    ? `<a href="${nextFile}">Next →</a>`
    : `<a class="disabled">Next →</a>`;

  return `  <nav class="topnav">
    <a href="index.html" class="topnav-brand">${deckTitle}</a>
    <div class="topnav-sections">
${navLinks}    </div>
    <div class="topnav-nav">
      ${prevLink}
      ${nextLink}
    </div>
  </nav>`;
}

/**
 * Build the keyboard nav script for this slide, including group-jump data.
 */
function buildKeyNavScript(manifest, currentIndex) {
  const slides = manifest.slides;
  const prevFile = currentIndex > 0 ? slides[currentIndex - 1].file : null;
  const nextFile = currentIndex < slides.length - 1 ? slides[currentIndex + 1].file : null;

  // Find the next/prev group header for Shift+Arrow navigation
  let nextGroupFile = null;
  let prevGroupFile = null;

  // Current slide's group index
  const currentGroupIndex = slides[currentIndex].groupIndex;

  // Next group: find the first slide in the next group
  for (let i = currentIndex + 1; i < slides.length; i++) {
    if (slides[i].groupIndex > currentGroupIndex) {
      nextGroupFile = slides[i].file;
      break;
    }
  }

  // Prev group: find the first slide (group header) of the previous group
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (slides[i].groupIndex < currentGroupIndex) {
      // Go to the group header of that group
      const targetGroup = slides[i].groupIndex;
      for (let j = 0; j < slides.length; j++) {
        if (slides[j].groupIndex === targetGroup && slides[j].isGroupHeader) {
          prevGroupFile = slides[j].file;
          break;
        }
      }
      if (!prevGroupFile) prevGroupFile = slides[i].file;
      break;
    }
  }

  // If we're not on the group header and pressing Shift+Left, go to our own group header
  if (!prevGroupFile && !slides[currentIndex].isGroupHeader) {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (slides[i].groupIndex === currentGroupIndex && slides[i].isGroupHeader) {
        prevGroupFile = slides[i].file;
        break;
      }
    }
  }

  const prev = prevFile ? `'${prevFile}'` : 'null';
  const next = nextFile ? `'${nextFile}'` : 'null';
  const nextGroup = nextGroupFile ? `'${nextGroupFile}'` : 'null';
  const prevGroup = prevGroupFile ? `'${prevGroupFile}'` : 'null';

  return `  <script>
    initKeyNav(${prev}, ${next}, ${nextGroup}, ${prevGroup});
  <\/script>`;
}

/**
 * Inject navigation into a single HTML slide file.
 */
function injectNav(htmlContent, topNav, keyNavScript) {
  // Replace the NAV_PLACEHOLDER comment with the actual nav
  let result = htmlContent.replace(
    /\s*<!-- NAV_PLACEHOLDER:.*?-->/,
    '\n' + topNav
  );

  // Replace the KEYNAV_PLACEHOLDER comment with the init script
  result = result.replace(
    /\s*<!-- KEYNAV_PLACEHOLDER:.*?-->/,
    '\n' + keyNavScript
  );

  return result;
}

/**
 * Run the organizer: read deck.json and inject nav into all slides.
 */
export function organize(deckDir) {
  const manifestPath = path.join(deckDir, 'deck.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`No deck.json found in ${deckDir}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const slides = manifest.slides;

  for (let i = 0; i < slides.length; i++) {
    const filePath = path.join(deckDir, slides[i].file);
    if (!fs.existsSync(filePath)) {
      console.warn(`  Warning: ${slides[i].file} not found, skipping`);
      continue;
    }

    let html = fs.readFileSync(filePath, 'utf-8');
    const topNav = buildTopNav(manifest, i, manifest.title);
    const keyNavScript = buildKeyNavScript(manifest, i);

    html = injectNav(html, topNav, keyNavScript);
    fs.writeFileSync(filePath, html);
  }

  return manifest;
}
