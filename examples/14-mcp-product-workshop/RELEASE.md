# Release checklist and handoff

**MCP is so back! Build Tools for the Agents Your Users Already Use**  
**Daniel Lew and Alex Booker**

## Status and scope

Development content is complete subject to the verification record in [proof/README.md](proof/README.md). **Release blocked:** the MCP v2 stack is unmerged and stable `@mastra/mcp@^2.0.0` is not yet available. A local overlay is explicitly approved for development; it is not registry-only release proof. Do not publish or announce until every gate below passes.

- Delivery: 90 minutes (25 presentation/setup, 60 uninterrupted demo, 5 recap), optional 30-minute extension.
- Deck: `slides/mcp-product-workshop/index.tsx` from repository root; twelve setup slides plus closing.
- Runnable project: this directory. Run sheet: [FACILITATOR.md](FACILITATOR.md). Setup, five-minute reviewer path and troubleshooting: [README.md](README.md).
- Prerequisites: Node 22.13+, pnpm, git, curl; installed/built MCP worktree for development. No LLM key for core demos. Cursor needs a signed-in host and explicit local approval.
- Large evidence: repository `.mastracode/proof/mcp-product-workshop/`; [proof index](proof/README.md) maps local filenames to committed assertions. Recordings are automated rehearsals, not a human-approved timed workshop.

## Exact development boundary

| Component | Verified dependency |
| --- | --- |
| Committed registry MCP baseline | 1.17.3 (manifest `^1.17.3`) |
| Active MCP implementation | Local source commit `a5019083edc3d147f35692fcb0c94099abbf2251`; its manifest still reports 1.17.3, **not** a published 2.0.0 |
| Core | 1.64.0 |
| CLI / published Studio baseline | mastra 1.27.3 |
| Independent MCP SDK client | 2.0.0 |
| Zod | 4.5.4 |
| TypeScript / Vitest / tsx | 5.9.3 / 3.2.7 / 4.23.13 |
| Example pnpm | 10.27.0 |

`pnpm setup:local-v2` prints the source realpath/commit, checks the peer range and proves unchanged manifests. Set `MASTRA_MCP_V2_PATH` in your shell; never write a personal source path into the manifest. This overlay does not update CLI/Studio assets.

## Development verification

```bash
pnpm install --frozen-lockfile
pnpm setup:local-v2
for round in 1 2; do
  pnpm reset
  pnpm typecheck
  pnpm test
  pnpm build
  pnpm demo:surfaces
  pnpm demo:discover
  pnpm demo:workflow
  pnpm demo:v2
  pnpm demo:failures
done
pnpm demo:inspector
```

Run `pnpm install --frozen-lockfile && pnpm build` separately from repository `open-slide/`. Do not run interactive dev and build simultaneously. Each automated demo creates fresh state and closes its own listener.

## Known limitations and fallback

- Published CLI 1.27.3 shows the outdated SSE card for modern servers. Local stack Studio assets pass; **repeat the visual gate with coordinated released CLI assets before launch**. Streamable HTTP remains the participant transport; SSE is legacy comparison only.
- Persistence is intentionally process-local. `pnpm reset` cannot reset an already-running server: stop/restart it. REST/CLI/MCP share business code, not a production database.
- Generated workflow tools return staged final results. `processReturnWithProgress` is an explicit wrapper using public MCP helpers and an ephemeral application-owned callback; it is not suitable for durable suspension/resumption. Modern logs require client opt-in; legacy log display depends on the client's logging-level configuration. Progress requires a progress token.
- Subscription membership is not tenant authorization. Broadcasts are restricted to public policy, never order state.
- Local bearer fixtures are a teaching boundary, not production OAuth. Consult [production.md](docs/production.md) before deployment.
- If Cursor/login or Inspector is unavailable, use the programmatic client; if a live harness fails, show `proof/expected/` as clearly labeled recorded evidence. Drop optional prompt and Cursor mutation first, never modern wire/failure chapters.
- To undo the development overlay, stop owned servers and reinstall into a new checkout with the committed lockfile. That restores **1.x baseline**, not a modern-feature fallback. Never substitute that baseline while claiming v2 behavior.

## Blocking public-launch checklist

### MCP release owners

- [ ] Stack CI green; required major-version approval recorded.
- [ ] MCP v2 stack merged, with coordinated client/CLI/Studio changes.
- [ ] Stable `@mastra/mcp@^2.0.0` publicly installable; exact peer-compatible core and CLI versions recorded.
- [ ] Launch wording jointly approved: modern 2026 behavior is now default; native 2026 support existed before v2.

### Registry-only conversion (after publication)

1. Work in the isolated workshop branch. Stop its interactive processes. From this example, run `pnpm add '@mastra/mcp@^2.0.0'` to update package.json and regenerate pnpm-lock.yaml from the registry. Select and install the coordinated core/CLI releases satisfying MCP's published peer range. Record their exact resolved versions in this file.
2. Remove `setup:local-v2` from package scripts and delete its development-only script. Remove overlay/source-path instructions from the participant setup and facilitator preflight; retain historical evidence labeled as such. Do not commit generated node_modules or tarballs.
3. Commit the manifest/lockfile and instructions, then clone that commit into a **new empty checkout**, with no existing node_modules. Do not reuse a symlinked install. In the example run `pnpm install --frozen-lockfile`. Confirm MCP resolves inside that checkout's package-manager store, not the source worktree, and `pnpm list --depth 0` reports released 2.x. No overlay or `MASTRA_STUDIO_PATH` override may be active.
4. Run the entire two-round verification sequence above, **omitting `setup:local-v2`**, then Inspector and the deck build. Regenerate safe captures with `PROOF_DIR=proof/expected pnpm demo:v2`; scan before committing. Repeat modern/legacy Studio text assertions with released assets.
5. Repeat the adversarial review against the final registry-only branch diff; resolve every must-fix. Keep the full fresh-install transcript and package versions in the proof package.

### Human checks (not satisfied by automation)

- [ ] Signed-in Cursor visibly discovers tools, performs one read and one bounded mutation; owner saves sanitized recording and checked host version.
- [ ] A second person completes the five-minute README path without verbal help; save name/date/result and any corrections.
- [ ] Daniel/Alex review a full timed rehearsal recording and approve timing/content. The scripted `demo.cast` and slide traversal video are not this approval.
- [ ] All final automated/review gates green; publication explicitly authorized after npm availability.

Until these are recorded, status remains **content complete / release blocked**, never ship complete.
