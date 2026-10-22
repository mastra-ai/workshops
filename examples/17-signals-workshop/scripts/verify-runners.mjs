// Run only against a server the operator has already started. Never kill processes or erase data.
import { spawnSync } from "node:child_process";

if (!process.env.BASE) {
  console.error(
    "Set BASE to your dedicated rehearsal server (for example http://localhost:4112). Start it yourself first.",
  );
  process.exit(2);
}

for (const demo of ["demo1", "demo2", "demo3", "demo4"]) {
  for (let n = 1; n <= 2; n++) {
    console.log(`\n===== ${demo} (${n}/2) =====`);
    const result = spawnSync("pnpm", ["run", demo, "--auto", "--no-open"], {
      stdio: "inherit",
      env: { ...process.env, NO_OPEN: "1" },
    });
    if (result.error) console.error(result.error.message);
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}
