/**
 * Legislative Council Workflows
 *
 * This file defines two Mastra workflows that implement the **council multi-agent pattern**:
 *
 * 1. `legislativeCouncilWorkflow` — Basic council:
 *    Legislation → 6 parallel committee reviews → synthesizer → unified report
 *
 * 2. `legislativeCouncilWithDeliberationWorkflow` — Council with deliberation:
 *    Legislation → 6 parallel reviews → 6 parallel deliberations → synthesizer → unified report
 *
 * The deliberation variant adds a second round where each committee agent reviews
 * the other five committees' findings and responds with agreements, counter-arguments,
 * and revised positions before the synthesizer produces the final report.
 *
 * ## Mastra workflow concepts used:
 *
 * - `createStep()` — Defines a discrete unit of work with typed input/output schemas (Zod).
 *   Each step's `execute()` function receives validated `inputData` and a `mastra` context
 *   for accessing registered agents.
 *
 * - `createWorkflow()` — Composes steps into a DAG. Steps can run sequentially (`.then()`)
 *   or in parallel (`.parallel()`). Mastra automatically routes outputs from previous steps
 *   as inputs to subsequent steps, matching by step ID.
 *
 * - `.parallel([steps])` — Runs an array of steps concurrently. All steps in a parallel
 *   group receive the same input (from the prior step or workflow input). Their outputs
 *   are collected into an object keyed by step ID (e.g., `{ "fiscalAnalyst-review": {...} }`).
 *
 * - `.then(step)` — Runs a step after the previous step/group completes. The step receives
 *   the merged outputs from all prior parallel steps.
 *
 * - `.commit()` — Finalizes the workflow definition, making it ready for execution.
 *
 * ## Data flow:
 *
 * Workflow input (title + text)
 *   ↓
 * [parallel] 6× createCommitteeStep → each produces `analysisOutput`
 *   ↓ (outputs keyed by step ID into `allAnalysesSchema`)
 * [then] synthesizeReports → reads all 6 analyses, produces unified report
 *   ↓
 * Workflow output (report + committees array + usage + timing)
 *
 * For the deliberation variant, an additional parallel group is inserted:
 *
 * [parallel] 6× createDeliberationStep → each reads all 6 analyses, produces `deliberationOutput`
 *   ↓
 * [then] synthesizeWithDeliberation → reads all 6 deliberations (which contain initial analyses)
 */
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Zod schemas — define the typed contracts between workflow steps
// ---------------------------------------------------------------------------

/** Input schema for the entire workflow: the legislation to analyze. */
const legislationInput = z.object({
  title: z.string().describe('Title of the legislation or policy proposal'),
  text: z.string().describe('Full text or detailed summary of the proposed legislation'),
});

/**
 * Token usage tracking schema.
 * Maps to AI SDK v5's `LanguageModelUsage` shape (inputTokens/outputTokens),
 * NOT the v4 shape (promptTokens/completionTokens).
 */
const tokenUsage = z.object({
  inputTokens: z.number(),
  outputTokens: z.number(),
  totalTokens: z.number(),
});

/**
 * Output schema for a single committee's initial analysis.
 * Produced by `parseAnalysis()` from the agent's freeform markdown response.
 *
 * Fields:
 *   - domain: The committee's policy domain name (e.g., "Fiscal & Economic Policy")
 *   - summary: Extracted "Summary of Impact" section text
 *   - benefits/risks/recommendations: Extracted bullet-point arrays
 *   - impactRating: One of HIGHLY POSITIVE | POSITIVE | NEUTRAL | NEGATIVE | HIGHLY NEGATIVE
 *   - usage: Token counts for this agent call
 *   - durationMs: Wall-clock time for this agent call
 */
const analysisOutput = z.object({
  domain: z.string(),
  summary: z.string(),
  benefits: z.array(z.string()),
  risks: z.array(z.string()),
  recommendations: z.array(z.string()),
  impactRating: z.string(),
  usage: tokenUsage,
  durationMs: z.number(),
});

/**
 * Output schema for a committee's deliberation response (second round).
 * Includes the original analysis (carried forward) plus the committee's
 * response to other committees' findings.
 */
const deliberationOutput = z.object({
  domain: z.string(),
  /** The committee's initial analysis, carried forward for reference. */
  initialAnalysis: analysisOutput,
  /** Points where this committee agrees with other committees' findings. */
  agreements: z.array(z.string()),
  /** Points where this committee disagrees with or challenges other committees. */
  counterArguments: z.array(z.string()),
  /** Updated recommendations after considering cross-committee perspectives. */
  revisedRecommendations: z.array(z.string()),
  /** Possibly revised impact rating after deliberation. */
  revisedImpactRating: z.string(),
  usage: tokenUsage,
  durationMs: z.number(),
});

// ---------------------------------------------------------------------------
// Step factories — create reusable step definitions for each committee
// ---------------------------------------------------------------------------

/**
 * Creates a workflow step that runs a single committee agent's initial analysis.
 *
 * Each committee step:
 *   1. Retrieves its agent from the Mastra context by `agentId`
 *   2. Sends the legislation text to the agent via `agent.generate()`
 *   3. Parses the agent's freeform markdown response into structured fields
 *   4. Returns the structured analysis with token usage and timing
 *
 * The step ID follows the pattern `{agentId}-review` (e.g., "fiscalAnalyst-review"),
 * which is how Mastra keys the output when multiple steps run in parallel.
 *
 * @param agentId - The agent's registration key in the Mastra instance (e.g., "fiscalAnalyst")
 * @param committeeName - Human-readable committee name (e.g., "Fiscal & Economic Policy")
 */
function createCommitteeStep(agentId: string, committeeName: string) {
  return createStep({
    id: `${agentId}-review`,
    description: `${committeeName} reviews the legislation`,
    inputSchema: legislationInput,
    outputSchema: analysisOutput,
    execute: async ({ inputData, mastra }) => {
      const agent = mastra?.getAgent(agentId);
      if (!agent) throw new Error(`Agent ${agentId} not found`);

      const start = Date.now();
      const { text, usage } = await agent.generate([
        {
          role: 'user',
          content: `Please analyze the following proposed legislation:

**Title:** ${inputData.title}

**Full Text:**
${inputData.text}

Provide your expert analysis from your domain perspective.`,
        },
      ]);
      const durationMs = Date.now() - start;

      return parseAnalysis(text, committeeName, usage, durationMs);
    },
  });
}

/**
 * Parses an agent's freeform markdown response into the structured `analysisOutput` shape.
 *
 * The agents are prompted to produce sections with headers like "**Summary of Impact**",
 * "**Benefits**", "**Risks & Concerns**", etc. This function splits the text on markdown
 * headers and categorizes each section by keyword matching.
 *
 * Parsing strategy:
 *   - Split on lines that start with `**` or `#` headers
 *   - For each section, check the lowercase header text for keywords
 *   - Extract bullet points (lines starting with `-` or `*`)
 *   - Extract the impact rating by matching the exact rating strings
 *
 * Fallback behavior:
 *   - If no summary section is found, uses the first 300 chars of the raw text
 *   - If no bullets are found for a category, returns `['See full analysis']`
 *   - If no impact rating is found, defaults to `'NEUTRAL'`
 *
 * @param text - The agent's raw markdown response
 * @param domain - The committee's domain name (passed through to output)
 * @param usage - Token usage from the AI SDK (values may be undefined in v5)
 * @param durationMs - Wall-clock time for the agent call
 */
function parseAnalysis(text: string, domain: string, usage: { inputTokens?: number; outputTokens?: number; totalTokens?: number }, durationMs: number) {
  // Split on lines that begin with markdown headers (** bold or ### headers)
  const sections = text.split(/\n(?=\*\*|#{1,3}\s)/);
  const benefits: string[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];
  let summary = '';
  let impactRating = 'NEUTRAL';

  for (const section of sections) {
    const lower = section.toLowerCase();

    // Extract bullet points from the section (lines starting with - or *)
    const bullets = section
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[\s\-*]+/, '').trim())
      .filter(Boolean);

    // Categorize sections by keyword matching on the header text
    if (lower.includes('summary of impact') || lower.includes('summary')) {
      // Strip bold markers and header prefixes to get clean summary text
      summary = section.replace(/\*\*.*?\*\*:?\s*/g, '').replace(/#{1,3}\s.*\n/, '').trim();
    } else if (lower.includes('benefit') || lower.includes('positive')) {
      benefits.push(...bullets);
    } else if (lower.includes('risk') || lower.includes('concern') || lower.includes('negative')) {
      risks.push(...bullets);
    } else if (lower.includes('recommend') || lower.includes('amendment')) {
      recommendations.push(...bullets);
    }

    // Look for the impact rating anywhere in the section
    const ratingMatch = section.match(/\b(HIGHLY POSITIVE|HIGHLY NEGATIVE|POSITIVE|NEGATIVE|NEUTRAL)\b/);
    if (ratingMatch) {
      impactRating = ratingMatch[1];
    }
  }

  // Fallback: if no summary section was identified, use the start of the raw response
  if (!summary) {
    summary = text.slice(0, 300);
  }

  return {
    domain,
    summary,
    benefits: benefits.length > 0 ? benefits : ['See full analysis'],
    risks: risks.length > 0 ? risks : ['See full analysis'],
    recommendations: recommendations.length > 0 ? recommendations : ['See full analysis'],
    impactRating,
    // Default undefined usage values to 0 (AI SDK v5 may return undefined)
    usage: {
      inputTokens: usage.inputTokens ?? 0,
      outputTokens: usage.outputTokens ?? 0,
      totalTokens: usage.totalTokens ?? 0,
    },
    durationMs,
  };
}

/**
 * Schema for the collected outputs of all six parallel committee review steps.
 *
 * When Mastra runs steps in `.parallel()`, it collects their outputs into an object
 * keyed by each step's `id`. So after the parallel review group completes, the next
 * step receives an object shaped like this schema — one entry per committee.
 */
const allAnalysesSchema = z.object({
  'fiscalAnalyst-review': analysisOutput,
  'healthAnalyst-review': analysisOutput,
  'defenseAnalyst-review': analysisOutput,
  'technologyAnalyst-review': analysisOutput,
  'civilRightsAnalyst-review': analysisOutput,
  'environmentalAnalyst-review': analysisOutput,
});

/**
 * Parses an agent's deliberation response into the structured `deliberationOutput` shape.
 *
 * Similar to `parseAnalysis()` but for the second-round deliberation, where each committee
 * reviews the other committees' findings and responds with:
 *   - Agreements: points that reinforce their own analysis
 *   - Counter-arguments: points they disagree with
 *   - Revised recommendations: updated position after cross-committee discussion
 *   - Revised impact rating: may differ from their initial rating
 *
 * @param text - The agent's raw deliberation response
 * @param domain - The committee's domain name
 * @param initialAnalysis - The committee's original analysis (carried forward in output)
 * @param usage - Token usage from the AI SDK
 * @param durationMs - Wall-clock time for the agent call
 */
function parseDeliberation(text: string, domain: string, initialAnalysis: z.infer<typeof analysisOutput>, usage: { inputTokens?: number; outputTokens?: number; totalTokens?: number }, durationMs: number) {
  const sections = text.split(/\n(?=\*\*|#{1,3}\s)/);
  const agreements: string[] = [];
  const counterArguments: string[] = [];
  const revisedRecommendations: string[] = [];
  let revisedImpactRating = initialAnalysis.impactRating;

  for (const section of sections) {
    const lower = section.toLowerCase();
    const bullets = section
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[\s\-*]+/, '').trim())
      .filter(Boolean);

    // Categorize deliberation sections by keyword matching
    if (lower.includes('agree') || lower.includes('concur') || lower.includes('support')) {
      agreements.push(...bullets);
    } else if (lower.includes('counter') || lower.includes('disagree') || lower.includes('challenge') || lower.includes('concern') || lower.includes('rebut')) {
      counterArguments.push(...bullets);
    } else if (lower.includes('revised') || lower.includes('recommend') || lower.includes('amend')) {
      revisedRecommendations.push(...bullets);
    }

    const ratingMatch = section.match(/\b(HIGHLY POSITIVE|HIGHLY NEGATIVE|POSITIVE|NEGATIVE|NEUTRAL)\b/);
    if (ratingMatch) {
      revisedImpactRating = ratingMatch[1];
    }
  }

  return {
    domain,
    initialAnalysis,
    agreements: agreements.length > 0 ? agreements : ['No specific agreements noted'],
    counterArguments: counterArguments.length > 0 ? counterArguments : ['No counter-arguments raised'],
    revisedRecommendations: revisedRecommendations.length > 0 ? revisedRecommendations : ['See initial recommendations'],
    revisedImpactRating,
    usage: {
      inputTokens: usage.inputTokens ?? 0,
      outputTokens: usage.outputTokens ?? 0,
      totalTokens: usage.totalTokens ?? 0,
    },
    durationMs,
  };
}

/**
 * Creates a workflow step for the deliberation round (second pass).
 *
 * Each deliberation step:
 *   1. Receives all six committees' initial analyses (via `allAnalysesSchema` input)
 *   2. Finds its own analysis and the other five committees' analyses
 *   3. Constructs a prompt showing the committee its initial position plus all
 *      other committees' summaries, benefits, risks, and recommendations
 *   4. Asks the agent to respond with agreements, counter-arguments, revised
 *      recommendations, and a potentially revised impact rating
 *   5. Parses the response and returns it with the original analysis carried forward
 *
 * @param agentId - The same agent ID used in the initial review step
 * @param committeeName - Human-readable committee name for prompt construction
 */
function createDeliberationStep(agentId: string, committeeName: string) {
  return createStep({
    id: `${agentId}-deliberation`,
    description: `${committeeName} reviews other committees' findings and responds`,
    inputSchema: allAnalysesSchema,
    outputSchema: deliberationOutput,
    execute: async ({ inputData, mastra }) => {
      const agent = mastra?.getAgent(agentId);
      if (!agent) throw new Error(`Agent ${agentId} not found`);

      // Separate this committee's own analysis from the others
      const allAnalyses = Object.values(inputData);
      const ownAnalysis = allAnalyses.find(a => a.domain === committeeName);
      const otherAnalyses = allAnalyses.filter(a => a.domain !== committeeName);

      // Format the other committees' findings into a readable markdown summary
      const otherSummaries = otherAnalyses
        .map(
          a => `### ${a.domain} (Rating: ${a.impactRating})
**Summary:** ${a.summary}
**Benefits:** ${a.benefits.map(b => `- ${b}`).join('\n')}
**Risks:** ${a.risks.map(r => `- ${r}`).join('\n')}
**Recommendations:** ${a.recommendations.map(r => `- ${r}`).join('\n')}`,
        )
        .join('\n\n');

      const start = Date.now();
      const { text, usage } = await agent.generate([
        {
          role: 'user',
          content: `You previously analyzed this legislation and provided your assessment. Now the other five expert committees have also completed their analyses.

## Your Initial Assessment (${committeeName})
**Impact Rating:** ${ownAnalysis?.impactRating || 'N/A'}
**Summary:** ${ownAnalysis?.summary || 'N/A'}

## Other Committees' Findings

${otherSummaries}

---

Now, as the ${committeeName} expert, please respond to the other committees' findings. Your deliberation MUST include:

1. **Agreements**: Points from other committees that reinforce or support your analysis (bullet points, cite which committee)
2. **Counter-Arguments**: Points you disagree with or want to challenge from other committees, with your reasoning (bullet points, cite which committee)
3. **Revised Recommendations**: Updated recommendations considering the cross-committee discussion — have any of your initial positions changed? (bullet points)
4. **Revised Impact Rating**: After seeing all perspectives, rate the overall impact on your domain as HIGHLY POSITIVE, POSITIVE, NEUTRAL, NEGATIVE, or HIGHLY NEGATIVE (this may or may not differ from your initial rating)

Be specific and reference other committees by name when agreeing or disagreeing.`,
        },
      ]);
      const durationMs = Date.now() - start;

      return parseDeliberation(text, committeeName, ownAnalysis!, usage, durationMs);
    },
  });
}

// ---------------------------------------------------------------------------
// Step instances — one review + one deliberation step per committee
// ---------------------------------------------------------------------------

// Initial review steps (run in parallel as the first workflow stage)
const fiscalReview = createCommitteeStep('fiscalAnalyst', 'Fiscal & Economic Policy');
const healthReview = createCommitteeStep('healthAnalyst', 'Public Health & Human Services');
const defenseReview = createCommitteeStep('defenseAnalyst', 'National Security & Defense');
const technologyReview = createCommitteeStep('technologyAnalyst', 'Technology & Innovation');
const civilRightsReview = createCommitteeStep('civilRightsAnalyst', 'Civil Rights & Social Impact');
const environmentalReview = createCommitteeStep('environmentalAnalyst', 'Environmental & Energy Policy');

// Deliberation steps (run in parallel as the second stage, only in the deliberation workflow)
const fiscalDeliberation = createDeliberationStep('fiscalAnalyst', 'Fiscal & Economic Policy');
const healthDeliberation = createDeliberationStep('healthAnalyst', 'Public Health & Human Services');
const defenseDeliberation = createDeliberationStep('defenseAnalyst', 'National Security & Defense');
const technologyDeliberation = createDeliberationStep('technologyAnalyst', 'Technology & Innovation');
const civilRightsDeliberation = createDeliberationStep('civilRightsAnalyst', 'Civil Rights & Social Impact');
const environmentalDeliberation = createDeliberationStep('environmentalAnalyst', 'Environmental & Energy Policy');

// ---------------------------------------------------------------------------
// Synthesis helpers and steps
// ---------------------------------------------------------------------------

/**
 * Formats an array of committee analyses into a readable markdown document
 * for the synthesizer agent's prompt. Used by both synthesis steps.
 */
function formatCommitteeSummaries(committees: z.infer<typeof analysisOutput>[]) {
  return committees
    .map(
      c => `## ${c.domain}
**Impact Rating:** ${c.impactRating}

**Summary:** ${c.summary}

**Benefits:**
${c.benefits.map(b => `- ${b}`).join('\n')}

**Risks & Concerns:**
${c.risks.map(r => `- ${r}`).join('\n')}

**Recommendations:**
${c.recommendations.map(r => `- ${r}`).join('\n')}`,
    )
    .join('\n\n---\n\n');
}

/**
 * Synthesis step for the basic (non-deliberation) workflow.
 *
 * Receives all six committees' analyses (via `allAnalysesSchema`), formats them
 * into a single prompt, and sends them to the synthesizer agent to produce a
 * unified CRS-style legislative report.
 *
 * The output includes the raw report text, the structured committee data (for the
 * UI to display individual cards), and the synthesizer's own token usage and timing.
 */
const synthesizeReports = createStep({
  id: 'synthesize-reports',
  description: 'CRS synthesizer compiles all committee findings into a unified legislative report',
  inputSchema: allAnalysesSchema,
  outputSchema: z.object({
    report: z.string(),
    committees: z.array(analysisOutput),
    usage: tokenUsage,
    durationMs: z.number(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('synthesizer');
    if (!agent) throw new Error('Synthesizer agent not found');

    // Convert the keyed object into an array for formatting
    const committees = Object.values(inputData);

    const start = Date.now();
    const { text, usage } = await agent.generate([
      {
        role: 'user',
        content: `You have received analyses from six expert policy committees reviewing the same piece of legislation. Please synthesize these into a comprehensive legislative report.

# Committee Reports

${formatCommitteeSummaries(committees)}

Please produce your unified CRS-style legislative analysis report.`,
      },
    ]);
    const durationMs = Date.now() - start;

    return { report: text, committees, usage: { inputTokens: usage.inputTokens ?? 0, outputTokens: usage.outputTokens ?? 0, totalTokens: usage.totalTokens ?? 0 }, durationMs };
  },
});

/**
 * Synthesis step for the deliberation workflow variant.
 *
 * Receives all six committees' deliberation outputs (which each contain
 * the original analysis as `initialAnalysis`). The prompt includes both
 * the initial committee reports AND the deliberation responses, asking the
 * synthesizer to pay special attention to how positions changed, where
 * consensus was reached, and where disagreements persist.
 */
const synthesizeWithDeliberation = createStep({
  id: 'synthesize-with-deliberation',
  description: 'CRS synthesizer compiles all committee findings and deliberation into a unified legislative report',
  inputSchema: z.object({
    'fiscalAnalyst-deliberation': deliberationOutput,
    'healthAnalyst-deliberation': deliberationOutput,
    'defenseAnalyst-deliberation': deliberationOutput,
    'technologyAnalyst-deliberation': deliberationOutput,
    'civilRightsAnalyst-deliberation': deliberationOutput,
    'environmentalAnalyst-deliberation': deliberationOutput,
  }),
  outputSchema: z.object({
    report: z.string(),
    committees: z.array(analysisOutput),
    deliberations: z.array(deliberationOutput),
    usage: tokenUsage,
    durationMs: z.number(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('synthesizer');
    if (!agent) throw new Error('Synthesizer agent not found');

    // Extract deliberations and their embedded initial analyses
    const deliberations = Object.values(inputData);
    const committees = deliberations.map(d => d.initialAnalysis);

    // Format deliberation responses for the synthesis prompt
    const deliberationSummaries = deliberations
      .map(
        d => `## ${d.domain} — Deliberation Response
**Revised Impact Rating:** ${d.revisedImpactRating}

**Agreements with Other Committees:**
${d.agreements.map(a => `- ${a}`).join('\n')}

**Counter-Arguments:**
${d.counterArguments.map(c => `- ${c}`).join('\n')}

**Revised Recommendations:**
${d.revisedRecommendations.map(r => `- ${r}`).join('\n')}`,
      )
      .join('\n\n---\n\n');

    const start = Date.now();
    const { text, usage } = await agent.generate([
      {
        role: 'user',
        content: `You have received analyses from six expert policy committees reviewing the same piece of legislation, followed by a deliberation round where each committee reviewed the others' findings and responded with agreements, counter-arguments, and revised positions.

# Initial Committee Reports

${formatCommitteeSummaries(committees)}

---

# Deliberation Round — Committee Responses

${deliberationSummaries}

---

Please produce your unified CRS-style legislative analysis report. Pay special attention to:
- Where committees changed their positions after deliberation
- Counter-arguments that were raised and whether they were addressed
- Areas where committees reached consensus vs. persistent disagreements
- How the deliberation round refined or changed the overall assessment`,
      },
    ]);
    const durationMs = Date.now() - start;

    return { report: text, committees, deliberations, usage: { inputTokens: usage.inputTokens ?? 0, outputTokens: usage.outputTokens ?? 0, totalTokens: usage.totalTokens ?? 0 }, durationMs };
  },
});

// ---------------------------------------------------------------------------
// Workflow definitions
// ---------------------------------------------------------------------------

/** All six committee review steps, run as a parallel group. */
const parallelReviews = [fiscalReview, healthReview, defenseReview, technologyReview, civilRightsReview, environmentalReview] as const;

/** All six deliberation steps, run as a parallel group (deliberation workflow only). */
const parallelDeliberations = [fiscalDeliberation, healthDeliberation, defenseDeliberation, technologyDeliberation, civilRightsDeliberation, environmentalDeliberation] as const;

/**
 * Basic legislative council workflow (no deliberation).
 *
 * Pipeline: input → 6 parallel reviews → synthesize → output
 *
 * Total agent calls: 7 (6 reviewers + 1 synthesizer)
 */
export const legislativeCouncilWorkflow = createWorkflow({
  id: 'legislative-council',
  description:
    'Council pattern: six expert committees analyze legislation in parallel, then a synthesizer produces a unified report',
  inputSchema: legislationInput,
  outputSchema: z.object({
    report: z.string(),
    committees: z.array(analysisOutput),
    usage: tokenUsage,
    durationMs: z.number(),
  }),
})
  .parallel([...parallelReviews])
  .then(synthesizeReports)
  .commit();

/**
 * Legislative council workflow with deliberation (second round).
 *
 * Pipeline: input → 6 parallel reviews → 6 parallel deliberations → synthesize → output
 *
 * The deliberation round gives each committee a chance to review the other committees'
 * findings, raise counter-arguments, and revise their positions before the final synthesis.
 * This produces a richer, more nuanced report at the cost of additional API calls and latency.
 *
 * Total agent calls: 13 (6 reviewers + 6 deliberators + 1 synthesizer)
 */
export const legislativeCouncilWithDeliberationWorkflow = createWorkflow({
  id: 'legislative-council-with-deliberation',
  description:
    'Council pattern: six expert committees analyze legislation in parallel, deliberate on each others findings, then a synthesizer produces a unified report',
  inputSchema: legislationInput,
  outputSchema: z.object({
    report: z.string(),
    committees: z.array(analysisOutput),
    deliberations: z.array(deliberationOutput),
    usage: tokenUsage,
    durationMs: z.number(),
  }),
})
  .parallel([...parallelReviews])
  .parallel([...parallelDeliberations])
  .then(synthesizeWithDeliberation)
  .commit();
