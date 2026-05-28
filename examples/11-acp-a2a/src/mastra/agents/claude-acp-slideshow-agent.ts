import { AcpAgent } from '@mastra/acp';

const claudeAcpArgs = process.env.CLAUDE_ACP_ARGS?.split(' ').filter(Boolean) ?? [
  '-y',
  '@agentclientprotocol/claude-agent-acp',
];

export const claudeAcpSlideshowAgent = new AcpAgent({
  id: 'claude-acp-slideshow-agent',
  name: 'Claude ACP Slideshow Agent',
  description: `Claude ACP slideshow specialist for Mastra release presentations.

Use this agent as the final slideshow drafting step after release changelogs have been retrieved and normalized.
It should use only the normalized release research it receives, never invent release facts, dates, tags, or source URLs, and return markdown with:

## Slideshow outline
List the slide sequence with one short purpose statement per slide.

## Slides
For each slide, include:
- Slide title
- 3-5 on-slide bullets
- Speaker notes
- Suggested visual direction

## Assumptions and gaps
List missing release data or presentation assumptions that should be resolved before producing final slides.`,
  command: process.env.CLAUDE_ACP_COMMAND ?? 'npx',
  args: claudeAcpArgs,
  cwd: process.cwd(),
  persistSession: true,
  ...(process.env.CLAUDE_ACP_MODEL ? { model: process.env.CLAUDE_ACP_MODEL } : {}),
});
