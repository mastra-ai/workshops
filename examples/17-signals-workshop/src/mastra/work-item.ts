// Demo 4's shared work item. The app writes plain values here; a StateLane (an input processor) shows them to
// both agents as a <work-item> snapshot first, then <work-item-update> deltas, so each agent always sees the
// current status without being told. Nothing here talks to a model.
import { StateLane } from "./state-lane";

export const workLane = new StateLane("work-item", {
  snapshot: "work-item",
  delta: "work-item-update",
});

const threads = { builder: "", reviewer: "" };
const history: string[] = [];
let submissions = 0;

const publish = (key: string, value: string) => {
  for (const t of [threads.builder, threads.reviewer])
    if (t) workLane.set(t, key, value);
};

export const workThreads = () => ({ ...threads });
export const workHistory = () => [...history];
export const currentStatus = () => history[history.length - 1] ?? "todo";

export function startWorkItem(builderThread: string, reviewerThread: string) {
  threads.builder = builderThread;
  threads.reviewer = reviewerThread;
  submissions = 0;
  history.length = 0;
  setStatus("todo");
  publish("submission", "none yet");
  publish("review", "none yet");
}

export function setStatus(status: string) {
  history.push(status);
  publish("WI-7", `countdown timer · status: ${status}`);
}
export const setSubmission = (text: string) => publish("submission", text);
export const setReview = (text: string) => publish("review", text);
export const nextPr = () => `PR #${12 + submissions++}`;
