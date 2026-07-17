# Council Legislative Analysis

Multi-agent legislative analysis using the **council pattern** — six specialist AI agents analyze proposed legislation in parallel, optionally deliberate on each other's findings, then a synthesizer agent produces a unified nonpartisan report.

This example is modeled after how the US Congress reviews bills: standing committees each evaluate legislation through their domain lens, and the Congressional Research Service (CRS) compiles a nonpartisan summary.

## How It Works

### Agents (Committee Experts)

Six domain-specialist agents review legislation in parallel, each modeled after a real congressional committee:

| Agent | Domain | Modeled After |
| --- | --- | --- |
| Fiscal Analyst | Budget, taxes, GDP, trade | Senate Finance Committee / CBO |
| Health Analyst | Healthcare, Medicare, public health | Senate HELP Committee |
| Defense Analyst | Military, cybersecurity, intelligence | Senate Armed Services Committee |
| Technology Analyst | AI regulation, broadband, data privacy | Senate Commerce Committee |
| Civil Rights Analyst | Constitutional rights, equity, justice | Senate Judiciary Committee |
| Environmental Analyst | Climate, energy, conservation | Senate Environment & Public Works Committee |

A seventh agent — the **Legislative Synthesizer** — acts as the CRS, compiling all committee findings into a unified report.

### Workflows

**Basic workflow** (`legislativeCouncilWorkflow`):
1. All six committee agents analyze the legislation **in parallel**
2. The synthesizer compiles a unified report

**Deliberation workflow** (`legislativeCouncilWithDeliberationWorkflow`):
1. All six committee agents analyze the legislation **in parallel**
2. Each committee reviews the other five committees' findings and responds with agreements, counter-arguments, and revised positions **in parallel**
3. The synthesizer compiles a report incorporating both initial analyses and deliberation outcomes

Each committee agent produces a structured assessment including:
- Summary of impact on their domain
- Benefits and risks (bullet points)
- Specific recommendations
- Impact rating (HIGHLY POSITIVE → HIGHLY NEGATIVE)

### Input Sources

The web UI accepts:
- **URLs** — fetches and extracts text from any webpage. Congress.gov URLs are detected automatically and use the Congress API for reliable bill text retrieval.
- **Pasted text** — paste legislation or policy text directly into the textarea.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- An OpenAI API key

### Setup

```bash
cd examples/council-legislative-analysis
pnpm install --ignore-workspace
```

Create a `.env` file (or set the environment variable):

```
OPENAI_API_KEY=sk-...
```

### Run the Web UI

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Paste a URL or legislation text, optionally enable the **Deliberation** checkbox, and click **Analyze**.

### Run from the CLI

```bash
pnpm cli
```

This runs the basic council workflow against a sample bill (the "American Innovation and Digital Infrastructure Act of 2026") and prints the unified report to the terminal.

## Project Structure

```
src/
├── mastra/
│   ├── index.ts              # Mastra instance with all agents and workflows
│   ├── agents/index.ts       # Seven agent definitions (six committees + synthesizer)
│   └── workflows/index.ts    # Two workflow definitions (basic + deliberation)
├── app/
│   ├── layout.tsx            # Next.js root layout
│   ├── page.tsx              # Web UI (SSE-powered, committee cards, report viewer)
│   ├── globals.css           # Tailwind + custom styles
│   └── api/analyze/route.ts  # API route — fetches documents, runs workflows, streams SSE
└── index.ts                  # CLI entry point
```

## Key Mastra Concepts Demonstrated

- **Multi-agent orchestration** — seven agents coordinated via workflows
- **Parallel execution** — committee reviews run concurrently using `.parallel()`
- **Sequential chaining** — parallel results feed into the synthesizer via `.then()`
- **Council pattern** — independent expert analysis → optional deliberation → synthesis
- **Structured output parsing** — agent text responses parsed into typed Zod schemas
