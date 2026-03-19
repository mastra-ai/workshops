import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const searchSlack = createTool({
  id: "search_slack",
  description: "Search Slack messages for a given query",
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant Slack messages"),
  }),
  outputSchema: z.object({
    messages: z.string().describe("Formatted Slack messages matching the query"),
  }),
  execute: async (inputData) => {
    const query = inputData.query.toLowerCase();

    if (query.includes("pemberton")) {
      return {
        messages: `#sales-team | 3 days ago
@sophie: Heads up on Pemberton - the decision maker is James Thornton, not his boss Catherine Wells. Made that mistake last quarter 😅

@tom: Good to know. Also FYI their budget just got approved for £85k

@sophie: One more thing - they had an awful experience with Nexus Solutions last year. James gets visibly annoyed if anyone brings them up. Absolute landmine`,
      };
    }

    return {
      messages: "No messages found matching your query.",
    };
  },
});
