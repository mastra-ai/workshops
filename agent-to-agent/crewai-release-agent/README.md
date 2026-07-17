# CrewAI Mastra Release Changelog Agent

A standalone Python/CrewAI example that reads Mastra release changelogs from GitHub and summarizes the latest releases.

The agent has exactly one CrewAI tool: `read_mastra_release_changelogs`. The tool reads release data from the GitHub API for [`mastra-ai/mastra`](https://github.com/mastra-ai/mastra/releases).

## Setup

Use Python 3.10 or newer. On systems where `python3` is older, replace it below with `python3.11` or another Python 3.10+ binary.

From the repository root:

```bash
cd agent-to-agent/crewai-release-agent
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Set the model provider key used by CrewAI. Telemetry is disabled by default in code, and you can also export it explicitly for the shell session:

```bash
export OPENAI_API_KEY="your-api-key"
export CREWAI_DISABLE_TELEMETRY="true"
```

Optional: set `GITHUB_TOKEN` to raise GitHub API rate limits. The tool works without it for normal unauthenticated usage.

```bash
export GITHUB_TOKEN="github-token-with-public-read-access"
```

## Run the CLI agent

```bash
python release_changelog_agent.py
```

This runs a single CrewAI task asking the agent to read and summarize the latest 10 Mastra release changelogs.

## Run as an A2A server

The agent is configured with CrewAI's `A2AServerConfig`. `a2a_server.py` exposes it with CrewAI's generated `to_agent_card()` metadata and the official A2A SDK Starlette server adapter:

```bash
uvicorn a2a_server:app --host 0.0.0.0 --port 8000
```

You can also run the module directly:

```bash
python a2a_server.py
```

The advertised A2A URL defaults to `http://localhost:8000`. Override it if the server is reachable elsewhere:

```bash
export A2A_PUBLIC_URL="https://your-public-a2a-host.example"
```

## Files

- `release_changelog_agent.py` - CrewAI tool, agent, and CLI task runner.
- `a2a_server.py` - A2A SDK Starlette server entrypoint using the CrewAI-generated agent card.
- `requirements.txt` - isolated Python dependencies for the local virtualenv.
