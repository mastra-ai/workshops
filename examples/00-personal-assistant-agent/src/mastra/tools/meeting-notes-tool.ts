import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const searchMeetingNotes = createTool({
  id: "search_meeting_notes",
  description: "Search past meeting notes and summaries",
  inputSchema: z.object({
    query: z
      .string()
      .describe("The search query to find relevant meeting notes"),
  }),
  outputSchema: z.object({
    notes: z.string().describe("Meeting notes matching the query"),
  }),
  execute: async (inputData) => {
    const query = inputData.query.toLowerCase();

    if (query.includes("pemberton") || query.includes("thornton")) {
      return {
        notes: `**Discovery Call - Pemberton Industries**
Date: 12 January 2025
Attendees: James Thornton (Pemberton), Sarah Chen (Us)

Key Points:
- Pemberton currently using legacy on-prem solution, keen to move to cloud
- James mentioned they've been burned by vendors who over-promise - values honesty over flashy demos
- Timeline: Want to go live before end of Q2 (hard deadline due to their fiscal year)
- James prefers concise presentations - "15 minutes max, then Q&A"
- He specifically asked about our data migration support - this is a pain point from their Nexus experience

Action Items:
- Send case study from Morrison & Partners migration (similar scale)
- Prepare 15-min pitch deck focused on migration support`,
      };
    }

    return {
      notes: "No meeting notes found matching your query.",
    };
  },
});
