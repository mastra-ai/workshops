import { A2AAgent } from '@mastra/core/a2a';

export const crewaiReleaseA2AAgent = new A2AAgent({
  id: 'crewai-release-changelog-agent',
  name: 'CrewAI Release Changelog Agent',
  description:
    'Remote CrewAI A2A agent that reads Mastra release changelogs from GitHub using its release changelog tool.',
  url: process.env.CREWAI_RELEASE_A2A_AGENT_CARD_URL ?? 'http://localhost:8000/.well-known/agent-card.json',
  retries: 2,
  backoffMs: 250,
  maxBackoffMs: 1000,
  timeoutMs: 30_000,
});
