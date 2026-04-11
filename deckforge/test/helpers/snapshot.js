import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const SNAPSHOT_ROOT = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  '..',
  'snapshots',
);

/**
 * Compare `actual` against `snapshots/<name>.txt`.
 * - First run: writes the file and passes.
 * - `UPDATE_SNAPSHOTS=1`: overwrites the file and passes.
 * - Otherwise: diffs byte-for-byte and throws on mismatch.
 */
export function assertSnapshot(name, actual) {
  const file = path.join(SNAPSHOT_ROOT, `${name}.txt`);
  fs.mkdirSync(path.dirname(file), { recursive: true });

  if (process.env.UPDATE_SNAPSHOTS === '1' || !fs.existsSync(file)) {
    fs.writeFileSync(file, actual);
    return;
  }

  const expected = fs.readFileSync(file, 'utf-8');
  assert.equal(actual, expected, `snapshot mismatch for ${name}`);
}

/**
 * Compare every file in `actualDir` to its twin in `snapshots/<name>/`.
 * Used by the integration test to enforce the byte-compat guarantee.
 */
export function assertDirSnapshot(name, actualDir) {
  const snapDir = path.join(SNAPSHOT_ROOT, name);
  if (process.env.UPDATE_SNAPSHOTS === '1' || !fs.existsSync(snapDir)) {
    fs.mkdirSync(snapDir, { recursive: true });
    for (const file of fs.readdirSync(actualDir)) {
      fs.copyFileSync(path.join(actualDir, file), path.join(snapDir, file));
    }
    return;
  }

  const expectedFiles = fs.readdirSync(snapDir).sort();
  const actualFiles = fs.readdirSync(actualDir).sort();
  assert.deepEqual(actualFiles, expectedFiles, `file list mismatch in ${name}`);
  for (const file of expectedFiles) {
    const a = fs.readFileSync(path.join(actualDir, file), 'utf-8');
    const b = fs.readFileSync(path.join(snapDir, file), 'utf-8');
    assert.equal(a, b, `snapshot mismatch: ${name}/${file}`);
  }
}
