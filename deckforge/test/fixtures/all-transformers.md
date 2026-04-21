# All Transformers

A deck that exercises every v1 transformer for integration snapshotting.

## Callouts

A slide with four callouts to verify color variants coexist.

<!-- df: callout -->
> Default accent callout — baseline.

<!-- df: callout color=green -->
> Positive callout.

<!-- df: callout color=yellow -->
> Warning callout.

<!-- df: callout color=orange -->
> Alert callout.

## Card Grid

<!-- df: card-grid -->
- **Admissions** — triage, flag anomalies, draft summaries
- **Advising** — proactive outreach when students fall behind
- **Compliance** — monitor IRB submissions and flag issues

## Stat Grid

<!-- df: stat-grid -->
- **70%** of advising load automated
- **$2.4M** annual operational savings
- **3×** faster application processing

## Demo Card Grid

<!-- df: demo-card-grid -->
- **Triage** — classify incoming applications in under two seconds
- **Draft** — produce a reviewer-ready summary
- **Escalate** — flag edge cases to a human reviewer
- **Archive** — file the decision trail for audit

## TUI Windows

Two windows on one slide to verify CSS dedup (single `<style>` block).

<!-- df: tui-window title="session one" -->
```bash
$ npm install
$ npm test
```

<!-- df: tui-window title="session two" -->
```bash
$ deckforge build deck.md
```

## Mode Toggle

Two toggles on one slide to verify JS dedup (single `<script>` block).

<!-- df: mode-toggle -->
- Supervised
  - agent drafts, human approves
  - ideal for admissions decisions
- Autonomous
  - agent acts within strict guardrails
  - ideal for scheduling and FAQs
- Collaborative
  - agent and human work side-by-side
  - ideal for research assistance

<!-- df: mode-toggle -->
- Development
  - hot reload on save
  - error panel on bad directive
- Production
  - strict build, exits non-zero on error
