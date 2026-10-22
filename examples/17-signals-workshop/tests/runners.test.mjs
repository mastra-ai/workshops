import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cwd = fileURLToPath(new URL("..", import.meta.url));

test("rehearsal refuses an implicit default server", () => {
  const env = { ...process.env };
  delete env.BASE;
  const r = spawnSync(process.execPath, ["scripts/verify-runners.mjs"], {
    cwd,
    env,
    encoding: "utf8",
  });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /Set BASE/);
});

for (const demo of ["demo1", "demo2", "demo3", "demo4"]) {
  test(`${demo} starts and fails clearly without a running server`, () => {
    const r = spawnSync(
      process.execPath,
      ["--import", "tsx", "scripts/demo.ts", demo, "--auto", "--no-open"],
      {
        cwd,
        encoding: "utf8",
        timeout: 10000,
        // Port 1 is rejected by fetch, so these tests never reach an existing Studio.
        env: {
          ...process.env,
          BASE: "http://127.0.0.1:1",
          NO_OPEN: "1",
          DEMO_LOCK_FILE: fileURLToPath(
            new URL("./no-such-dev.lock", import.meta.url),
          ),
        },
      },
    );
    assert.equal(r.status, 1, r.stderr);
    assert.match(r.stdout + r.stderr, /Start Studio first: pnpm dev/);
  });
}
