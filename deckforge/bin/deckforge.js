#!/usr/bin/env node

/**
 * DeckForge CLI
 *
 * Usage:
 *   deckforge dev <file.md>              Start dev server with hot-reload
 *   deckforge build <file.md> [outdir]   Build slides to a directory
 *
 * Options:
 *   --port <n>    Dev server port (default: 3000)
 *   --out <dir>   Output directory
 */

import path from 'path';
import { startDevServer, buildDeck } from '../src/server.js';

const args = process.argv.slice(2);
const command = args[0];

function usage() {
  console.log(`
  DeckForge — Markdown-driven presentations

  Usage:
    deckforge dev <file.md>              Start dev server with hot-reload
    deckforge build <file.md> [outdir]   Build slides to a directory

  Options:
    --port <n>    Dev server port (default: 3000)
    --out <dir>   Output directory

  Markdown format:
    # Group Title        → Group header slide (horizontal nav)
    ## Slide Title        → Slide within group (vertical nav)
    ### Subsection        → Subsection within a slide

  Navigation (in browser):
    →  / ←               Next / previous slide
    Shift+→  / Shift+←   Jump to next / previous group
  `);
}

function getFlag(name) {
  const idx = args.indexOf(name);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return null;
}

if (!command || command === '--help' || command === '-h') {
  usage();
  process.exit(0);
}

// Find the markdown file (first non-flag argument after command)
const mdFile = args.find((a, i) => i > 0 && !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')));

if (!mdFile) {
  console.error('  Error: No markdown file specified.\n');
  usage();
  process.exit(1);
}

const mdPath = path.resolve(mdFile);

if (command === 'dev') {
  const port = parseInt(getFlag('--port')) || 3000;
  const outputDir = getFlag('--out') || undefined;

  startDevServer(mdPath, { port, outputDir });

} else if (command === 'build') {
  const outputDir = getFlag('--out') || args[2];
  const resolvedOut = outputDir ? path.resolve(outputDir) : undefined;

  buildDeck(mdPath, { outputDir: resolvedOut });

} else {
  console.error(`  Unknown command: ${command}\n`);
  usage();
  process.exit(1);
}
