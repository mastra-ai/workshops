# MastraCode Presentation Plan

## Audience

Consulting crew evaluating where agentic coding tools fit in their delivery practice.

## Goal

Give the team a practical mental model for MastraCode: how it compares with Codex, Claude CLI, and similar tools; when to use each; and how observational memory changes the way agent work compounds over time.

## Format

Presentation only. No hands-on exercises or code examples.

Target length: 30–45 minutes, plus discussion.

## Core narrative

1. **Why coding agents are splitting into categories**
   - IDE copilots: inline completion and local edits.
   - CLI coding agents: repo-aware execution with tool access.
   - Platform-native agents: reusable workflows, memory, evals, and production handoff.

2. **Comparison: MastraCode vs Codex vs Claude CLI vs others**
   - Codex: general coding agent focused on completing software tasks in a repo.
   - Claude CLI: conversational coding loop with strong iteration and broad ecosystem familiarity.
   - MastraCode: coding agent experience connected to Mastra’s agent/workflow primitives, memory model, and production-oriented patterns.
   - Others: useful to frame the wider category, but avoid turning the talk into a benchmark shootout.

3. **How to compare them fairly**
   - Execution model: chat, CLI, IDE, or framework-integrated.
   - Context model: current prompt, repo context, persistent memory, or team knowledge.
   - Governance: approvals, review flow, auditability, and safety boundaries.
   - Output path: one-off code change vs reusable agent capability.

4. **What makes MastraCode worth discussing**
   - Treats software work as a loop: understand, change, verify, prove.
   - Fits naturally with Mastra concepts consultants may use in client delivery.
   - Helps connect prototype work to durable agent systems.
   - Gives teams a language for standardizing agent-assisted delivery.

5. **Models: choosing the right intelligence for the work**
   - Different models have different strengths: planning, coding, reasoning, speed, and cost.
   - The agent experience is shaped by both the model and the surrounding tools/context.
   - For consulting teams, model choice should be tied to task risk, latency needs, budget, and review expectations.

6. **Observational memory: the 3 bullets**
   - **Observe** — capture what happened: user intent, important context, tool results, and state changes.
   - **Reflect** — compress observations into lessons, preferences, constraints, and reusable patterns.
   - **Recall** — bring the right context back later so the team does not restart from zero.

7. **Consulting implications**
   - Where coding agents fit: discovery, implementation, QA, maintenance, enablement.
   - What needs governance: client data, approvals, secrets, review, and audit trails.
   - What to standardize: prompts, task boundaries, verification expectations, handoff artifacts.
   - What to measure: cycle time, review quality, defect rate, onboarding speed, repeatability.

## Proposed slide outline

1. Title: MastraCode for consulting teams
2. Why coding agents matter now
3. The landscape: Codex, Claude CLI, MastraCode, and others
4. Models: choosing the right intelligence for the work
5. Observational memory in three bullets: Observe, Reflect, Recall
6. Skills and commands: turning context into repeatable action
7. The agentic software loop: understand → change → verify → prove
8. What this means for consulting delivery
9. Recommended adoption path for teams
10. Discussion prompts
11. Next steps

## Open decisions before creating slides

- Tone: neutral landscape overview or MastraCode-led positioning.
- Depth: executive overview or practitioner-oriented technical talk.
- Duration: 30, 45, or 60 minutes.
