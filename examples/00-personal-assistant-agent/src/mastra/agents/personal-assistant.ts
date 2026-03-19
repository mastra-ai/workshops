import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { searchSlack } from "../tools/slack-tool";
import { createCalendarEvent } from "../tools/calendar-tool";
import { weatherTool } from "../tools/weather-tool";
import { searchMeetingNotes } from "../tools/meeting-notes-tool";

export const personalAssistant = new Agent({
  id: "personal-assistant",
  name: "Personal Assistant",
  instructions:
    "You are a helpful personal assistant. Be concise. Do not offer further assistance or ask follow-up questions unless necessary. The user is located in London, UK (GMT/BST timezone).",
  model: "openrouter/openai/gpt-5.2",
  tools: {
    searchSlack,
    createCalendarEvent,
    weatherTool,
    searchMeetingNotes,
  },
  memory: new Memory({
    options: {
      observationalMemory: {
        model: "openrouter/google/gemini-2.5-flash",
        observation: {
          messageTokens: 1000,
          bufferTokens: false,
        },
        reflection: {
          observationTokens: 500,
        },
      },
    },
  }),
});
