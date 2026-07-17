"""CrewAI agent for reading Mastra release changelogs."""

from __future__ import annotations

import os
from typing import Any

os.environ.setdefault("CREWAI_DISABLE_TELEMETRY", "true")

import requests
from crewai import Agent, Crew, Process, Task
from crewai.a2a import A2AServerConfig
from crewai.tools import tool

GITHUB_RELEASES_API_URL = "https://api.github.com/repos/mastra-ai/mastra/releases"
GITHUB_RELEASES_PAGE_URL = "https://github.com/mastra-ai/mastra/releases"
DEFAULT_RELEASE_LIMIT = 10
MAX_RELEASE_LIMIT = 25
DEFAULT_A2A_URL = "http://localhost:8000"
DEFAULT_LLM_MODEL = "gpt-4o-mini"


def _release_excerpt(body: str, max_chars: int = 4000) -> str:
    cleaned = body.strip() if body else "No changelog body provided."
    if len(cleaned) <= max_chars:
        return cleaned
    return f"{cleaned[:max_chars].rstrip()}\n..."


@tool("read_mastra_release_changelogs")
def read_mastra_release_changelogs(limit: int = DEFAULT_RELEASE_LIMIT) -> str:
    """Read recent Mastra release changelogs from the GitHub releases API."""
    release_limit = max(1, min(int(limit), MAX_RELEASE_LIMIT))

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "mastra-crewai-release-agent",
    }
    github_token = os.getenv("GITHUB_TOKEN")
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"

    response = requests.get(
        GITHUB_RELEASES_API_URL,
        headers=headers,
        params={"per_page": release_limit},
        timeout=20,
    )
    response.raise_for_status()

    releases: list[dict[str, Any]] = response.json()
    if not releases:
        return f"No Mastra releases were returned from {GITHUB_RELEASES_PAGE_URL}."

    sections = [
        f"Mastra release changelogs from {GITHUB_RELEASES_PAGE_URL}",
        f"Returned releases: {len(releases)}",
    ]

    for index, release in enumerate(releases, start=1):
        name = release.get("name") or release.get("tag_name") or "Unnamed release"
        tag = release.get("tag_name") or "unknown-tag"
        published_at = release.get("published_at") or release.get("created_at") or "unknown-date"
        html_url = release.get("html_url") or GITHUB_RELEASES_PAGE_URL
        body = _release_excerpt(release.get("body") or "")

        sections.append(
            "\n".join(
                [
                    f"## {index}. {name}",
                    f"- Tag: {tag}",
                    f"- Published: {published_at}",
                    f"- URL: {html_url}",
                    "- Changelog:",
                    body,
                ]
            )
        )

    return "\n\n".join(sections)


mastra_release_changelog_agent = Agent(
    role="Mastra Release Changelog Reader",
    goal=(
        "Read recent Mastra release changelogs from GitHub and summarize the most "
        "important changes with clear release references."
    ),
    backstory=(
        "You are a focused release-notes analyst. You only use the provided changelog "
        "reader tool to inspect Mastra releases and you preserve release tags, dates, "
        "and URLs when summarizing."
    ),
    tools=[read_mastra_release_changelogs],
    llm=os.getenv("CREWAI_LLM_MODEL", DEFAULT_LLM_MODEL),
    a2a=A2AServerConfig(url=os.getenv("A2A_PUBLIC_URL", DEFAULT_A2A_URL)),
    verbose=True,
)


def summarize_latest_releases(limit: int = DEFAULT_RELEASE_LIMIT) -> str:
    """Run the CrewAI agent once from the command line."""
    task = Task(
        description=(
            f"Use the read_mastra_release_changelogs tool to read the latest {limit} "
            "Mastra releases. Summarize the notable changelog themes, call out release "
            "tags and dates, and include links for follow-up."
        ),
        expected_output=(
            "A concise markdown summary of recent Mastra release changelogs with tags, "
            "dates, links, and notable changes."
        ),
        agent=mastra_release_changelog_agent,
    )
    crew = Crew(
        agents=[mastra_release_changelog_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff(inputs={"limit": limit})
    return str(result)


if __name__ == "__main__":
    print(summarize_latest_releases())
