"""A2A server entrypoint for the Mastra release changelog CrewAI agent."""

from __future__ import annotations

import asyncio
import os
import re

from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.apps import A2AStarletteApplication
from a2a.server.events import EventQueue
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore, TaskUpdater
from a2a.utils import new_agent_text_message

from release_changelog_agent import (
    DEFAULT_A2A_URL,
    DEFAULT_RELEASE_LIMIT,
    MAX_RELEASE_LIMIT,
    mastra_release_changelog_agent,
    summarize_latest_releases,
)


def _release_limit_from_prompt(prompt: str) -> int:
    latest_count = re.search(r"latest\s+(\d+)", prompt, re.IGNORECASE)
    first_number = re.search(r"\b(\d+)\b", prompt)
    match = latest_count or first_number
    if not match:
        return DEFAULT_RELEASE_LIMIT
    return max(1, min(int(match.group(1)), MAX_RELEASE_LIMIT))


class MastraReleaseChangelogExecutor(AgentExecutor):
    """A2A adapter that runs the CrewAI release changelog task."""

    async def execute(self, context: RequestContext, event_queue: EventQueue) -> None:
        updater = TaskUpdater(event_queue, context.task_id, context.context_id)
        prompt = context.get_user_input()
        limit = _release_limit_from_prompt(prompt)

        await updater.start_work(
            new_agent_text_message(
                f"Reading the latest {limit} Mastra release changelogs.",
                context.context_id,
                context.task_id,
            )
        )

        try:
            result = await asyncio.to_thread(summarize_latest_releases, limit=limit)
        except Exception as exc:
            await updater.failed(
                new_agent_text_message(
                    f"Failed to summarize Mastra releases: {exc}",
                    context.context_id,
                    context.task_id,
                )
            )
            return

        await updater.complete(
            new_agent_text_message(result, context.context_id, context.task_id)
        )

    async def cancel(self, context: RequestContext, event_queue: EventQueue) -> None:
        updater = TaskUpdater(event_queue, context.task_id, context.context_id)
        await updater.cancel(
            new_agent_text_message(
                "Mastra release changelog task canceled.",
                context.context_id,
                context.task_id,
            )
        )


agent_card = mastra_release_changelog_agent.to_agent_card(
    os.getenv("A2A_PUBLIC_URL", DEFAULT_A2A_URL)
)

request_handler = DefaultRequestHandler(
    agent_executor=MastraReleaseChangelogExecutor(),
    task_store=InMemoryTaskStore(),
)

app = A2AStarletteApplication(
    agent_card=agent_card,
    http_handler=request_handler,
).build()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
