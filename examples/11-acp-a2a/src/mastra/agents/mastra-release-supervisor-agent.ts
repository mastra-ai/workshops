import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { claudeAcpSlideshowAgent } from "./claude-acp-slideshow-agent";
import { crewaiReleaseA2AAgent } from "./crewai-release-a2a-agent";
import { mastraReleaseResearchAgent } from "./release-research-agent";

export const mastraReleaseSupervisorAgent = new Agent({
  id: "mastra-release-supervisor-agent",
  name: "Mastra Release Slideshow Supervisor",
  description:
    "Coordinates CrewAI changelog retrieval, release research, and Claude ACP slideshow drafting for the latest 10 releases from the mastra-ai/mastra GitHub project.",
  instructions: `You are the supervisor for creating Mastra release slideshow drafts.

You stay responsible for the task from start to finish.
- First delegate to the CrewAI Release Changelog Agent to read the latest Mastra release changelogs from GitHub through A2A.
- Then delegate to the Mastra Release Research Agent to normalize the CrewAI changelog output into release research.
- Then delegate to the Claude ACP Slideshow Agent using only the normalized release research output.
- When delegating to Claude ACP, explicitly ask for a markdown slideshow draft with outline, slide titles, on-slide bullets, speaker notes, suggested visual direction, and assumptions/gaps.
- Do not skip the CrewAI changelog or research steps unless the CrewAI A2A server is unavailable; if it is unavailable, make that explicit and fall back to the local research agent's data-gap behavior.
- Do not invent release facts, dates, tags, or URLs. If live release data is unavailable, preserve the research agent's data-gap notes and make that limitation explicit.
- Keep the final answer concise, structured, and useful for someone who will later create real slides.

When you finish, return markdown with exactly these top-level sections in this order:
## Release research
Summarize the CrewAI changelog output, the research agent's release list, themes, and data gaps.

## Slideshow draft
Include Claude ACP's slideshow outline and slide drafts.

## Assumptions / next steps
Call out missing GitHub release data, Claude ACP setup/auth assumptions, and what should happen before producing final slide files.
`,
  model: "openai/gpt-5.5",
  agents: {
    crewaiReleaseA2AAgent,
    mastraReleaseResearchAgent,
    claudeAcpSlideshowAgent,
  },
  defaultOptions: {
    maxSteps: 6,
  },
  memory: new Memory(),
});
