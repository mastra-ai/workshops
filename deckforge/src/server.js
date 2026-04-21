/**
 * Dev Server (Component 4)
 *
 * Watches the source markdown file, auto-rebuilds on change,
 * copies theme assets, and serves the deck with hot-reload via WebSocket.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { WebSocketServer } from 'ws';
import { build } from './generator.js';
import { organize } from './organizer.js';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/**
 * Copy theme assets (shared.css, shared.js) into the output directory.
 */
function copyThemeAssets(themeDir, outputDir) {
  for (const file of ['shared.css', 'shared.js']) {
    const src = path.join(themeDir, file);
    const dest = path.join(outputDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }
}

/**
 * Inject the dev-mode flag into shared.js so the client connects to the WS.
 */
function injectDevFlag(outputDir) {
  const jsPath = path.join(outputDir, 'shared.js');
  if (fs.existsSync(jsPath)) {
    let content = fs.readFileSync(jsPath, 'utf-8');
    const flag = 'window.__DECKFORGE_DEV__ = true;';
    if (!content.startsWith(flag)) {
      content = flag + '\n' + content;
    }
    fs.writeFileSync(jsPath, content);
  }
}

/**
 * Full rebuild: generate slides, copy theme, organize nav.
 */
function fullBuild(mdPath, outputDir, themeDir) {
  const start = Date.now();
  try {
    const manifest = build(mdPath, outputDir, { mode: 'dev' });
    copyThemeAssets(themeDir, outputDir);
    injectDevFlag(outputDir);
    organize(outputDir);
    const elapsed = Date.now() - start;
    console.log(`  ✓ Built ${manifest.slides.length} slides in ${elapsed}ms`);
    return true;
  } catch (err) {
    console.error(`  ✗ Build error: ${err.message}`);
    return false;
  }
}

/**
 * Start the dev server.
 */
export function startDevServer(mdPath, options = {}) {
  const port = options.port || 3000;
  const wsPort = port + 1;
  const themeDir = options.themeDir || path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'theme');
  const outputDir = options.outputDir || path.join(path.dirname(mdPath), '.deckforge-output');

  console.log(`\n  DeckForge Dev Server`);
  console.log(`  ────────────────────`);
  console.log(`  Source:  ${mdPath}`);
  console.log(`  Output:  ${outputDir}`);
  console.log(`  Theme:   ${themeDir}`);
  console.log('');

  // Initial build
  fullBuild(mdPath, outputDir, themeDir);

  // --- HTTP server ---
  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';

    const filePath = path.join(outputDir, urlPath);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  });

  server.listen(port, () => {
    console.log(`  → http://localhost:${port}`);
    console.log(`  → Watching for changes...\n`);
  });

  // --- WebSocket server for hot-reload ---
  const wss = new WebSocketServer({ port: wsPort });
  const clients = new Set();
  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
  });

  function notifyReload() {
    for (const ws of clients) {
      try { ws.send('reload'); } catch {}
    }
  }

  // --- File watcher ---
  let debounceTimer = null;
  let isBuilding = false;
  const rebuildPaths = [mdPath];

  // Also watch for theme changes during development
  if (fs.existsSync(themeDir)) {
    for (const f of fs.readdirSync(themeDir)) {
      rebuildPaths.push(path.join(themeDir, f));
    }
  }

  // Sources that trigger a full rebuild (markdown + theme)
  for (const watchPath of rebuildPaths) {
    fs.watch(watchPath, { persistent: true }, () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        console.log(`  ↻ Change detected, rebuilding...`);
        isBuilding = true;
        const ok = fullBuild(mdPath, outputDir, themeDir);
        // Release the build guard on the next tick so any watcher events
        // fired by our own writes are ignored first.
        setTimeout(() => { isBuilding = false; }, 100);
        if (ok) notifyReload();
      }, 200);
    });
  }

  // Hand-edits to generated HTML hot-reload without rebuilding.
  // The enhancement workflow in CLAUDE.md edits these files directly.
  let outputDebounce = null;
  if (fs.existsSync(outputDir)) {
    fs.watch(outputDir, { persistent: true }, (eventType, filename) => {
      if (!filename || !filename.endsWith('.html')) return;
      if (isBuilding) return;
      if (outputDebounce) clearTimeout(outputDebounce);
      outputDebounce = setTimeout(() => {
        console.log(`  ↻ Slide edited: ${filename}`);
        notifyReload();
      }, 100);
    });
  }

  return { server, wss };
}

/**
 * Production build (no server).
 */
export function buildDeck(mdPath, options = {}) {
  const themeDir = options.themeDir || path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'theme');
  const outputDir = options.outputDir || path.join(path.dirname(mdPath), path.basename(mdPath, '.md'));

  console.log(`\n  DeckForge Build`);
  console.log(`  ────────────────`);
  console.log(`  Source:  ${mdPath}`);
  console.log(`  Output:  ${outputDir}\n`);

  let manifest;
  try {
    manifest = build(mdPath, outputDir, { mode: 'build' });
  } catch (err) {
    console.error(`  ✗ Build error: ${err.message}`);
    process.exit(1);
  }
  copyThemeAssets(themeDir, outputDir);
  organize(outputDir);

  console.log(`  ✓ Built ${manifest.slides.length} slides → ${outputDir}\n`);
  return manifest;
}
