import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { StagehandBrowser } from '@mastra/stagehand';
import { z } from 'zod';
import { createSlackAdapter } from '@chat-adapter/slack';

const storage = new LibSQLStore({
  id: 'libsql',
  url: 'file:memory.db',
});

const memory = new Memory();

// A real-money action — gated behind requireApproval so the agent can't fire
// it on its own. In a Channels deployment, this renders as an Approve / Deny
// card in Slack; outside of Slack, the agent suspends until you resume it.
const bookFlightTool = createTool({
  id: 'book-flight',
  description:
    'Book a flight. Call this only after you have read the booking page in the ' +
    'browser and confirmed the flight details. Charges the card on file — ' +
    'requires explicit human approval.',
  inputSchema: z.object({
    airline: z.string().describe('Airline name as shown on the booking page'),
    flightNumber: z.string().describe('Flight number, e.g. "UA 234"'),
    origin: z.string().describe('Origin airport code, e.g. "SFO"'),
    destination: z.string().describe('Destination airport code, e.g. "JFK"'),
    departureDate: z.string().describe('Departure date in YYYY-MM-DD'),
    priceUsd: z.number().describe('Total price in USD as shown on the page'),
  }),
  outputSchema: z.object({
    confirmationCode: z.string(),
    bookedAt: z.string(),
  }),
  requireApproval: true,
  execute: async () => {
    // Demo only — would hit a real booking API in production.
    return {
      confirmationCode: `CONF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      bookedAt: new Date().toISOString(),
    };
  },
});

const browser = new StagehandBrowser({
  env: 'LOCAL',
  model: 'openai/gpt-5.4',
  headless: true,
  verbose: 1,
  screencast: {
    format: 'jpeg',
    quality: 80,
    maxWidth: 1280,
    maxHeight: 720,
  },
});

const flightSearchAgent = new Agent({
  id: 'flight-search-agent',
  name: 'flight-search-agent',
  instructions: `You help users with flights. You can:

1. Search for flights on Google Flights when given a trip (origin, destination, dates):
   - Navigate to https://www.google.com/travel/flights.
   - Fill in the origin, destination, and dates.
   - Run the search.
   - Extract the flight options (airline, price, duration, stops).
   - Report back the cheapest option and a couple of alternatives.

2. Book a flight when the user gives you a Google Flights (or airline) URL:
   - Navigate to that URL in the browser.
   - Read the page to confirm the flight details (airline, flight number,
     origin, destination, departure date, total price).
   - Call the book-flight tool with what you read off the page.
   - The tool requires approval — it will surface as an Approve / Deny card in
     Slack. Do NOT pretend a booking happened until you receive a confirmation
     code from the tool. If a detail isn't visible on the page, ask the user
     instead of guessing.`,
  model: 'openai/gpt-5.5',
  memory,
  browser,
  tools: {
    'book-flight': bookFlightTool,
  },
  // Uncomment to make this agent reachable from Slack.
  // Requires SLACK_SIGNING_SECRET + SLACK_BOT_TOKEN in .env and a tunnel
  // (ngrok / cloudflared) pointing at the Mastra server's webhook route.
  channels: {
    adapters: {
      slack: createSlackAdapter(),
    },
  },
  defaultOptions: {
    maxSteps: 100,
  },
});

export const mastra = new Mastra({
  agents: { 'flight-search-agent': flightSearchAgent },
  storage,
  server: {
    port: 4118,
  },
});
