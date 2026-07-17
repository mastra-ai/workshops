# Agent-to-Agent with Mastra

Welcome to your new [Mastra](https://mastra.ai/) project! We're excited to see what you'll build.

## Getting Started

Start the development server:

```shell
pnpm run dev
```

Open [http://localhost:4111](http://localhost:4111) in your browser to access [Mastra Studio](https://mastra.ai/docs/studio/overview). It provides an interactive UI for building and testing your agents, along with a REST API that exposes your Mastra application as a local service. This lets you start building without worrying about integration right away.

You can start editing files inside the `src/mastra` directory. The development server will automatically reload whenever you make changes.


## Mastra release slideshow supervisor

This example includes `mastra-release-supervisor-agent`, which delegates to:

1. A remote CrewAI A2A changelog agent in `crewai-release-agent/`
2. A local Mastra release research agent
3. A Claude-backed ACP slideshow drafting agent

Start the CrewAI A2A server first in one terminal:

```shell
cd crewai-release-agent
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python a2a_server.py
```

Then start Mastra in another terminal:

```shell
pnpm run dev
```

By default Mastra reads the CrewAI agent card from `http://localhost:8000/.well-known/agent-card.json`. Override it if your CrewAI server is exposed somewhere else:

```shell
CREWAI_RELEASE_A2A_AGENT_CARD_URL=http://localhost:8000/.well-known/agent-card.json pnpm run dev
```

The final slideshow step uses `claude-acp-slideshow-agent`, an ACP subagent backed by Claude. The default command is:

```shell
npx -y @agentclientprotocol/claude-agent-acp
```

Make sure Claude authentication is configured for the selected ACP adapter before invoking the supervisor. You can override the ACP runtime if needed:

```shell
CLAUDE_ACP_COMMAND=claude CLAUDE_ACP_ARGS="--acp" pnpm run dev
```

Optional Claude ACP environment variables:

- `CLAUDE_ACP_COMMAND`: command to spawn, defaults to `npx`
- `CLAUDE_ACP_ARGS`: space-separated args, defaults to `-y @agentclientprotocol/claude-agent-acp`
- `CLAUDE_ACP_MODEL`: optional Claude model passed to the ACP agent

## Learn more

To learn more about Mastra, visit our [documentation](https://mastra.ai/docs/). Your bootstrapped project includes example code for [agents](https://mastra.ai/docs/agents/overview), [tools](https://mastra.ai/docs/agents/using-tools), [workflows](https://mastra.ai/docs/workflows/overview), [scorers](https://mastra.ai/docs/evals/overview), and [observability](https://mastra.ai/docs/observability/overview).

If you're new to AI agents, check out our [course](https://mastra.ai/learn) and [YouTube videos](https://youtube.com/@mastra-ai). You can also join our [Discord](https://discord.gg/BTYqqHKUrf) community to get help and share your projects.

## Deploy to the Mastra platform

The [Mastra platform](https://projects.mastra.ai) provides two products for deploying and managing AI applications built with the Mastra framework:

- **Studio**: A hosted visual environment for testing agents, running workflows, and inspecting traces
- **Server**: A production deployment target that runs your Mastra application as an API server

Learn more in the [Mastra platform documentation](https://mastra.ai/docs/mastra-platform/overview).
