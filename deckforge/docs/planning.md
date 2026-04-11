# Planning — the ExecPlan workflow

Non-trivial work in DeckForge is planned as **ExecPlans**: single self-contained markdown files that describe a deliverable well enough that a novice agent with only the file and the worktree can implement it end to end.

## Where plans live

- `plans/<timestamp>-<slug>.md` — active plans
- `plans/done/` — plans whose Linear issue has shipped
- `plans/abandoned/` — plans the team decided not to pursue

`<timestamp>` is `YYYYMMDD-HHmm` local time at the moment the plan is created (e.g. `20260411-1400`). The slug is a short kebab-case description.

## Anatomy of an ExecPlan

Every plan file includes, in order:

1. **Purpose** — one paragraph on why the work matters. What can someone do after this change that they couldn't before?
2. **Context** — the Linear issue ID, dependencies on other plans/PRs, external blockers.
3. **Scope** — detailed deliverables: exact file paths, types and interfaces to define, test requirements, any schema or grammar references.
4. **Existing code context** — what's already in the tree that the plan touches, with file paths and line ranges where useful.
5. **Conventions** — the rules from `AGENTS.md` that apply, called out explicitly so the agent doesn't have to rediscover them.
6. **Verification** — exact commands to run and the expected outputs. "It builds" is not verification; "`node --test` reports 34 passed, 0 failed" is.
7. **Instructions** — the agent's runbook. The plan is self-contained: the agent does not wait for human feedback.
8. **Open questions** — anything intentionally left for the agent to decide or escalate.
9. **Decision log** — filled as questions are resolved during execution.
10. **Progress** — milestone checkboxes.
11. **Outcomes & retrospective** — filled at closeout.

## Non-negotiable rules

- **Fully self-contained.** A novice agent with only the worktree and the plan file must be able to implement the feature end to end. No "as discussed," no "see the usual pattern."
- **Every term of art is defined or not used.** If the plan says "shell," define shell. If it says "hydration," don't use it.
- **Every plan produces demonstrably working behavior.** Not just code changes. A refactor counts only if it has a behavior to verify.
- **Every plan references `AGENTS.md` conventions** by name in the Conventions section.
- **Living document.** Update the plan file as progress is made, questions are resolved, or the approach changes. Each revision must still be self-contained.

## Workflow

1. **Discovery.** Read the design doc (`plans/01-transformer-architecture.md`), `AGENTS.md`, `docs/architecture.md`, and any relevant prior plans.
2. **Clarification.** If the work has open questions that the plan author cannot decide alone, resolve them with the human before drafting. Record the decisions in the plan's Decision Log.
3. **Draft.** Fill the skeleton end to end.
4. **Approval gate.** Present the draft for human approval. Do not publish to Linear until approved.
5. **Publish.** Create a Linear issue in team `iam` with the Scope + Existing Code Context + Conventions + Verification + Instructions sections as the description. Create a matching Superset task. Cross-link both IDs back into the plan file.
6. **Commit.** Commit the plan file to `main` with a `docs(plans): ...` message referencing the Linear issue.
7. **Execute.** An agent picks up the Linear issue, runs the Instructions, and updates the Progress section as it goes.
8. **Closeout.** When the PR merges, move the file from `plans/` to `plans/done/`, fill in Outcomes & Retrospective, and commit.

## Common failure modes

- **Undefined jargon.** Using terms like "hydration" or "middleware" without defining them.
- **Letter-of-the-law implementations.** Code that technically meets the spec but does nothing meaningful.
- **Outsourcing key decisions.** "Choose an appropriate library" instead of being prescriptive.
- **Assuming context.** "As we discussed" or "the usual pattern" without spelling it out.
- **Validation theater.** "Verify it works" without specifying the exact command and expected output.
