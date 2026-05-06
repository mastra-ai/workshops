#!/usr/bin/env node

/**
 * flatten.js — Bake all partial markers into the deck slides in-place.
 * After running this, every HTML file is self-contained and works
 * directly from the filesystem (file:// protocol).
 *
 * Usage: node flatten.js
 *
 * This replaces:
 *   <!-- partial:head -->     → meta, fonts, shared.css link
 *   <!-- partial:title -->    → slide nav label + deck title
 *   <!-- partial:topnav -->   → full navigation bar
 *   <!-- partial:scripts -->  → <script src="shared.js"></script>
 *   <!-- partial:keynav -->   → <script>initKeyNav(prev, next);</script>
 *
 * It also:
 *   - Copies shared.css and shared.js into each deck directory
 *   - Generates a styled index.html for each deck
 *   - Generates a root index.html linking all decks
 *   - Overwrites the source index.html in each deck (the old redirect is gone)
 */

const fs = require("fs");
const path = require("path");

const DECKS_DIR = path.join(__dirname, "decks");
const SHARED_DIR = path.join(__dirname, "shared");

// ─── Helpers ────────────────────────────────────────────────────────────────

function readFile(p) {
  return fs.readFileSync(p, "utf-8");
}

function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, "utf-8");
}

// ─── Partial Content ────────────────────────────────────────────────────────

// Title placeholder is replaced per-slide in processSlide()
const HEAD_PARTIAL = `    <meta charset="UTF-8">
    <title><!-- partial:title --></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="shared.css">`;

const SCRIPTS_PARTIAL = `<script src="shared.js"></script>`;

function generateTopnav(deck) {
  const links = deck.slides
    .map((s) => `        <a href="${s.file}">${s.nav}</a>`)
    .join("\n");

  return `<nav class="topnav">
    <a href="${deck.slides[0].file}" class="topnav-brand">${deck.title}</a>
    <div class="topnav-sections">
${links}
    </div>
</nav>`;
}

function getKeyNavCall(deck, slideFile) {
  const idx = deck.slides.findIndex((s) => s.file === slideFile);
  const prev = idx > 0 ? `"${deck.slides[idx - 1].file}"` : "null";
  const next =
    idx < deck.slides.length - 1 ? `"${deck.slides[idx + 1].file}"` : "null";
  return `initKeyNav(${prev}, ${next});`;
}

// ─── Process a single slide ─────────────────────────────────────────────────

function processSlide(html, deck, slideFile) {
  // 1. Head partial (without title — title is separate)
  html = html.replace(/<!-- partial:head -->/g, HEAD_PARTIAL);

  // 2. Title
  const slide = deck.slides.find((s) => s.file === slideFile);
  const pageTitle = slide ? `${slide.nav} — ${deck.title}` : deck.title;
  html = html.replace(/<!-- partial:title -->/g, pageTitle);

  // 3. Topnav
  html = html.replace(/<!-- partial:topnav -->/g, generateTopnav(deck));

  // 4. Scripts (shared.js)
  html = html.replace(/<!-- partial:scripts -->/g, SCRIPTS_PARTIAL);

  // 5. Keynav
  html = html.replace(
    /<!-- partial:keynav -->/g,
    `<script>${getKeyNavCall(deck, slideFile)}</script>`
  );

  return html;
}

// ─── Generate deck index page ───────────────────────────────────────────────

function generateDeckIndex(deck) {
  const firstSlide = deck.slides[0].file;
  const slideLinks = deck.slides
    .map(
      (s, i) =>
        `            <a href="${s.file}" class="card"><span class="demo-number">${String(i + 1).padStart(2, "0")}</span><h4>${s.nav}</h4></a>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${deck.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
        <h1>${deck.title}</h1>
        <p class="subtitle">${deck.slides.length} slides</p>
        <a href="${firstSlide}" class="start-link">Start Presentation →</a>
        <div class="slide-grid">
${slideLinks}
        </div>
    </div>
</body>
</html>`;
}

// ─── Generate root index page ───────────────────────────────────────────────

function generateRootIndex(decks) {
  const deckLinks = decks
    .map((d) => {
      const href = `decks/${d.name}/index.html`;
      const badge =
        d.deck.engine === "open-slide"
          ? `<span class="badge">open-slide</span>`
          : "";
      return `        <a href="${href}" class="card"><h4>${d.deck.title}${badge}</h4><p>${d.deck.slides.length} slides</p></a>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mastra Presentations</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0a0a0a; --bg-card: #16161e; --text-primary: #e0e0e0;
            --text-secondary: #a0a0a0; --accent: #6366f1; --accent-hover: #818cf8;
            --border: rgba(255,255,255,0.06); --border-light: rgba(255,255,255,0.1);
            --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: var(--font-sans); background: var(--bg-primary); color: var(--text-primary); display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .index-wrapper { text-align: center; max-width: 900px; padding: 2rem; }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .subtitle { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 2.5rem; }
        .deck-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; text-align: left; }
        .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: border-color 0.2s, transform 0.2s; }
        .card:hover { border-color: var(--accent); transform: translateY(-2px); }
        .card h4 { color: var(--text-primary); font-size: 1.1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .card p { color: var(--text-secondary); font-size: 0.9rem; }
        .badge { font-size: 0.65rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--accent); border: 1px solid var(--accent-dim, rgba(99,102,241,0.3)); padding: 0.15rem 0.5rem; border-radius: 999px; }
    </style>
</head>
<body>
    <div class="index-wrapper">
        <h1>Mastra Presentations</h1>
        <p class="subtitle">Company presentation hub</p>
        <div class="deck-grid">
${deckLinks}
        </div>
    </div>
</body>
</html>`;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  console.log("🔨 Flattening decks...\n");

  const deckDirs = fs
    .readdirSync(DECKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const allDecks = [];

  for (const name of deckDirs) {
    const deckDir = path.join(DECKS_DIR, name);
    const deckJsonPath = path.join(deckDir, "deck.json");
    if (!fs.existsSync(deckJsonPath)) {
      console.warn(`  ⚠ Skipping ${name} — no deck.json`);
      continue;
    }

    const deck = JSON.parse(readFile(deckJsonPath));
    console.log(`  📦 ${name} (${deck.slides.length} slides)`);
    allDecks.push({ name, deck });

    // open-slide decks are React apps run via `pnpm dev`; skip the HTML flatten
    // pipeline and leave the deck's launcher index.html untouched.
    if (deck.engine === "open-slide") {
      console.log(`    ✓ open-slide deck (run \`pnpm dev\` in decks/${name})\n`);
      continue;
    }

    // Process each slide in-place
    let flattened = 0;
    for (const slide of deck.slides) {
      const slidePath = path.join(deckDir, slide.file);
      if (!fs.existsSync(slidePath)) {
        console.warn(`    ⚠ Missing: ${slide.file}`);
        continue;
      }
      const html = readFile(slidePath);

      // Skip if already flattened (no partial markers)
      if (!html.includes("<!-- partial:")) {
        // Still regenerate topnav in case deck.json changed
        const topnavRegex = /<nav class="topnav">[\s\S]*?<\/nav>/;
        const newTopnav = generateTopnav(deck);
        if (topnavRegex.test(html)) {
          const updated = html.replace(topnavRegex, newTopnav);
          if (updated !== html) {
            writeFile(slidePath, updated);
            console.log(`    ✓ ${slide.file} (topnav refreshed)`);
          } else {
            console.log(`    ✓ ${slide.file} (already flattened)`);
          }
        } else {
          console.log(`    ✓ ${slide.file} (already flattened)`);
        }
        continue;
      }

      const processed = processSlide(html, deck, slide.file);
      writeFile(slidePath, processed);
      flattened++;
      console.log(`    ✓ ${slide.file}`);
    }

    // Copy shared assets into the deck directory
    const sharedCssSrc = path.join(SHARED_DIR, "shared.css");
    const sharedJsSrc = path.join(SHARED_DIR, "shared.js");
    const sharedCssDest = path.join(deckDir, "shared.css");
    const sharedJsDest = path.join(deckDir, "shared.js");

    fs.copyFileSync(sharedCssSrc, sharedCssDest);
    fs.copyFileSync(sharedJsSrc, sharedJsDest);
    console.log(`    ✓ shared.css, shared.js copied`);

    // Generate deck index page
    const indexPath = path.join(deckDir, "index.html");
    writeFile(indexPath, generateDeckIndex(deck));
    console.log(`    ✓ index.html generated`);

    console.log(`    ${flattened} slides flattened\n`);
  }

  // Generate root index
  const rootIndex = generateRootIndex(allDecks);
  writeFile(path.join(__dirname, "index.html"), rootIndex);
  console.log(`✅ Root index.html generated`);
  console.log(`\n✨ Done! Open index.html in your browser.`);
}

main();
