import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const createCalendarEvent = createTool({
  id: "create_calendar_event",
  description: "Create a calendar event or check availability for a meeting",
  inputSchema: z.object({
    title: z.string().describe("The title of the meeting"),
    attendee: z.string().describe("The person to meet with"),
    preferredDate: z.string().describe("The preferred date for the meeting"),
    preferredTime: z
      .string()
      .optional()
      .describe("The preferred time for the meeting"),
    duration: z
      .string()
      .optional()
      .describe("The duration of the meeting (e.g. 30 minutes, 1 hour)"),
  }),
  outputSchema: z.object({
    status: z.string().describe("The status of the calendar operation"),
    message: z.string().describe("Details about the calendar operation"),
  }),
  execute: async (inputData) => {
    const time = inputData.preferredTime || "";

    if (time.includes("9")) {
      return {
        status: "conflict",
        message: `Unable to book "${inputData.title}" with ${inputData.attendee} at 9:00 AM - you have a conflict with "Q1 Planning Review". However, you're free at 10:30 AM or 3:00 PM on that day. Would you like me to book one of those slots instead?`,
      };
    }

    return {
      status: "confirmed",
      message: `Meeting "${inputData.title}" with ${inputData.attendee} has been booked for ${inputData.preferredTime || inputData.preferredDate}${inputData.duration ? ` (${inputData.duration})` : ""} and calendar invites have been sent. A Teams link has been automatically added to the invite.`,
    };
  },
});
