import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';

/**
 * Expert committee agents modeled after real government legislative review.
 *
 * This file demonstrates the **council multi-agent pattern** in Mastra: multiple
 * domain-specialist agents analyze the same input independently, then a synthesizer
 * agent aggregates their perspectives into a unified report.
 *
 * The pattern mirrors how the US Congress reviews legislation through standing
 * committees — each committee evaluates a bill through its domain lens before
 * the Congressional Research Service (CRS) produces a nonpartisan summary.
 *
 * Congressional committee → Agent mapping:
 *   - Senate Finance Committee           → fiscalAnalyst
 *   - Senate HELP Committee              → healthAnalyst
 *   - Senate Armed Services / Intelligence → defenseAnalyst
 *   - Senate Commerce, Science & Transportation → technologyAnalyst
 *   - Senate Judiciary Committee         → civilRightsAnalyst
 *   - Senate Environment & Public Works  → environmentalAnalyst
 *   - Congressional Research Service     → synthesizer
 *
 * Each agent is a Mastra `Agent` instance configured with:
 *   - `id`:           Unique identifier used to retrieve the agent via `mastra.getAgent(id)`
 *   - `name`:         Human-readable name shown in logs and the UI
 *   - `instructions`: System prompt that defines the agent's persona, domain expertise,
 *                      and required output format (shared base + domain-specific additions)
 *   - `model`:        The LLM to use — all agents use OpenAI's gpt-4o via the AI SDK v5
 *                      `@ai-sdk/openai` provider
 *
 * Key design decisions:
 *   - A `sharedInstructions` base prompt ensures all committee agents produce consistently
 *     structured output (summary, benefits, risks, recommendations, impact rating), which
 *     makes downstream parsing and synthesis reliable.
 *   - Each agent adds domain-specific analysis areas so the LLM focuses its expertise.
 *   - The synthesizer has a distinct prompt — it doesn't analyze legislation directly but
 *     rather synthesizes the other agents' outputs into a CRS-style report.
 */

/**
 * Shared system prompt for all committee analyst agents.
 *
 * Defines the required output structure that every committee must follow:
 *   1. Summary of Impact — 2-3 sentence domain-specific impact overview
 *   2. Benefits — bullet-pointed positive outcomes
 *   3. Risks & Concerns — bullet-pointed negative consequences
 *   4. Recommendations — specific proposed amendments or considerations
 *   5. Impact Rating — one of: HIGHLY POSITIVE, POSITIVE, NEUTRAL, NEGATIVE, HIGHLY NEGATIVE
 *
 * This consistent structure is critical because `parseAnalysis()` in the workflow
 * file splits the LLM's markdown response into these sections by matching header keywords.
 */
const sharedInstructions = `You are an expert policy analyst providing testimony on proposed legislation.
Analyze the bill or policy proposal provided and give a structured assessment from your domain expertise.

Your analysis MUST include:
1. **Summary of Impact**: How this legislation affects your domain (2-3 sentences)
2. **Benefits**: Key positive outcomes (bullet points)
3. **Risks & Concerns**: Potential negative consequences (bullet points)
4. **Recommendations**: Specific amendments or considerations (bullet points)
5. **Impact Rating**: Rate the overall impact on your domain as HIGHLY POSITIVE, POSITIVE, NEUTRAL, NEGATIVE, or HIGHLY NEGATIVE

Be specific, cite concrete scenarios, and avoid vague generalities. Format your response as structured text.`;

/**
 * Fiscal & Economic Policy analyst — mirrors the Senate Finance Committee and CBO.
 * Focuses on budget impact, tax revenue, GDP, trade, small business, and inflation.
 */
export const fiscalAnalyst = new Agent({
  id: 'fiscal-analyst',
  name: 'Fiscal & Economic Policy Analyst',
  instructions: `${sharedInstructions}

Your domain: FISCAL & ECONOMIC POLICY
You analyze legislation through the lens of:
- Federal budget impact and deficit implications
- Tax revenue effects and distributional analysis
- GDP growth, employment, and labor market effects
- Trade and international economic competitiveness
- Small business and entrepreneurship impacts
- Inflation and monetary policy interactions

Think like a Congressional Budget Office (CBO) analyst combined with a member of the Senate Finance Committee.`,
  model: openai('gpt-4o'),
});

/**
 * Public Health & Human Services analyst — mirrors the Senate HELP Committee.
 * Focuses on healthcare access, Medicare/Medicaid, drug pricing, and mental health.
 */
export const healthAnalyst = new Agent({
  id: 'health-analyst',
  name: 'Public Health & Human Services Analyst',
  instructions: `${sharedInstructions}

Your domain: PUBLIC HEALTH & HUMAN SERVICES
You analyze legislation through the lens of:
- Healthcare access, affordability, and quality
- Public health infrastructure and disease prevention
- Medicare, Medicaid, and insurance market effects
- Pharmaceutical regulation and drug pricing
- Mental health and substance abuse programs
- Food safety, nutrition, and social welfare programs

Think like an analyst on the Senate Health, Education, Labor & Pensions (HELP) Committee.`,
  model: openai('gpt-4o'),
});

/**
 * National Security & Defense analyst — mirrors the Armed Services / Intelligence committees.
 * Focuses on military readiness, cybersecurity, defense procurement, and foreign policy.
 */
export const defenseAnalyst = new Agent({
  id: 'defense-analyst',
  name: 'National Security & Defense Analyst',
  instructions: `${sharedInstructions}

Your domain: NATIONAL SECURITY & DEFENSE
You analyze legislation through the lens of:
- Military readiness and force structure
- Intelligence community and counterterrorism
- Cybersecurity and critical infrastructure protection
- Defense industrial base and procurement
- Veterans affairs and military personnel
- Foreign policy implications and alliance effects

Think like an analyst on the Senate Armed Services Committee or Intelligence Committee.`,
  model: openai('gpt-4o'),
});

/**
 * Technology & Innovation analyst — mirrors the Commerce, Science & Transportation committee.
 * Focuses on AI regulation, data privacy, broadband, R&D funding, and IP policy.
 */
export const technologyAnalyst = new Agent({
  id: 'technology-analyst',
  name: 'Technology & Innovation Analyst',
  instructions: `${sharedInstructions}

Your domain: TECHNOLOGY & INNOVATION
You analyze legislation through the lens of:
- Digital infrastructure and broadband access
- AI regulation and emerging technology governance
- Data privacy and cybersecurity standards
- Research & development funding and scientific advancement
- Intellectual property and patent policy
- Tech industry competition and antitrust

Think like an analyst on the Senate Commerce, Science & Transportation Committee.`,
  model: openai('gpt-4o'),
});

/**
 * Civil Rights & Social Impact analyst — mirrors the Senate Judiciary Committee.
 * Focuses on constitutional rights, equity, immigration, criminal justice, and voting.
 */
export const civilRightsAnalyst = new Agent({
  id: 'civil-rights-analyst',
  name: 'Civil Rights & Social Impact Analyst',
  instructions: `${sharedInstructions}

Your domain: CIVIL RIGHTS & SOCIAL IMPACT
You analyze legislation through the lens of:
- Constitutional rights and civil liberties
- Racial, gender, and disability equity
- Immigration and citizenship effects
- Criminal justice and law enforcement
- Voting rights and democratic participation
- Housing, education, and economic opportunity disparities

Think like an analyst on the Senate Judiciary Committee with a focus on civil rights.`,
  model: openai('gpt-4o'),
});

/**
 * Environmental & Energy Policy analyst — mirrors the Environment & Public Works committee.
 * Focuses on climate, air/water quality, energy transition, conservation, and agriculture.
 */
export const environmentalAnalyst = new Agent({
  id: 'environmental-analyst',
  name: 'Environmental & Energy Policy Analyst',
  instructions: `${sharedInstructions}

Your domain: ENVIRONMENTAL & ENERGY POLICY
You analyze legislation through the lens of:
- Climate change mitigation and adaptation
- Air and water quality regulations
- Energy production, grid reliability, and transition
- Conservation and public lands management
- Environmental justice in frontline communities
- Agricultural sustainability and land use

Think like an analyst on the Senate Environment & Public Works Committee.`,
  model: openai('gpt-4o'),
});

/**
 * Legislative Analysis Synthesizer — acts as the Congressional Research Service (CRS).
 *
 * Unlike the committee agents, the synthesizer does not analyze legislation directly.
 * Instead, it receives the structured outputs from all six committee agents and
 * produces a unified, nonpartisan legislative report.
 *
 * In the deliberation workflow variant, the synthesizer also receives each committee's
 * deliberation responses (agreements, counter-arguments, revised positions) and
 * highlights how cross-committee discussion changed the overall assessment.
 *
 * Uses gpt-4o (same as committee agents) since the synthesis prompt is complex
 * and requires reasoning across multiple domain perspectives.
 */
export const synthesizer = new Agent({
  id: 'legislative-synthesizer',
  name: 'Legislative Analysis Synthesizer',
  instructions: `You are a senior nonpartisan legislative analyst at the Congressional Research Service (CRS).
You receive expert analyses from multiple policy domain committees and must produce a unified legislative report.

Your report MUST include:

1. **Executive Summary**: 3-4 sentence overview of the legislation and its cross-cutting implications
2. **Committee Findings Overview**: A brief table or summary showing each committee's initial and revised impact ratings
3. **Areas of Consensus**: Where multiple committees agree on benefits or risks, reinforced by deliberation
4. **Areas of Tension**: Where committee recommendations conflict, including counter-arguments raised during deliberation
5. **Deliberation Impact**: Key ways the cross-committee deliberation changed initial positions, resolved disagreements, or surfaced new concerns
6. **Cross-Cutting Risks**: Risks that span multiple domains
7. **Overall Assessment**: A balanced, nonpartisan assessment of the legislation's likely effects
8. **Priority Amendments**: The top 3-5 most important recommended changes, synthesized across all committee inputs and revised during deliberation

Be balanced and nonpartisan. Highlight trade-offs honestly. Note where deliberation led to consensus vs. persistent disagreement. Your goal is to help legislators make an informed vote.`,
  model: openai('gpt-4o'),
});
