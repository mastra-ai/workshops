import assert from "node:assert/strict";
import test from "node:test";
import { StateLane } from "../src/mastra/state-lane.ts";
import { ShopLane } from "../src/mastra/shop.ts";
import {
  startWorkItem,
  setStatus,
  setReview,
  nextPr,
  workHistory,
  workLane,
} from "../src/mastra/work-item.ts";

// These are direct processor unit tests, not model or Core runtime simulations.
const context = (
  threadId = "thread",
  lastSnapshot,
  deltasSinceSnapshot = [],
  hasSnapshot = !!lastSnapshot,
) => ({
  threadId,
  lastSnapshot,
  deltasSinceSnapshot,
  contextWindow: { hasSnapshot },
});

const lane = () =>
  new StateLane("example", { snapshot: "example", delta: "example-update" });

test("unknown threads emit no state", () => {
  assert.equal(lane().computeStateSignal(context()), undefined);
  assert.equal(new ShopLane().computeStateSignal(context()), undefined);
});

test("lane sends snapshot, delta, then nothing once the delta is seen", () => {
  const l = lane();
  l.set("thread", "status", "todo");
  const first = l.computeStateSignal(context());
  assert.equal(first.mode, "snapshot");
  assert.equal(first.contents, "status: todo");
  l.set("thread", "status", "done");
  const delta = l.computeStateSignal(context("thread", first));
  assert.equal(delta.mode, "delta");
  assert.match(delta.contents, /todo → done/);
  assert.equal(
    l.computeStateSignal(context("thread", first, [delta])),
    undefined,
  );
});

test("a snapshot is re-emitted when the context window lost it", () => {
  const l = lane();
  l.set("thread", "status", "ready");
  const first = l.computeStateSignal(context());
  assert.equal(
    l.computeStateSignal(context("thread", first, [], false)).mode,
    "snapshot",
  );
});

test("lanes isolate threads and protect returned state from mutation", () => {
  const l = lane();
  l.set("thread", "status", "ready");
  l.get("thread").status = "changed";
  assert.equal(l.get("thread").status, "ready");
  assert.deepEqual(l.get("other"), {});
});

test("shop tracks cart quantities, sale prices, removals and context re-snapshot", () => {
  const shop = new ShopLane();
  shop.change("thread", "oat-milk", 2);
  const first = shop.computeStateSignal(context());
  assert.equal(first.mode, "snapshot");
  assert.equal(shop.view("thread").subtotal, 9);
  shop.putOnSale("thread", "oat-milk", 30);
  const sale = shop.computeStateSignal(context("thread", first));
  assert.match(sale.contents, /3.15/);
  shop.remove("thread", "oat-milk");
  const removal = shop.computeStateSignal(context("thread", first, [sale]));
  assert.match(removal.contents, /− Oat milk/);
  assert.equal(
    shop.computeStateSignal(context("thread", first, [sale, removal])),
    undefined,
  );
  assert.equal(
    shop.computeStateSignal(context("thread", first, [], false)).mode,
    "snapshot",
  );
});

test("checkout edits return to browsing; ordered carts stay fixed", () => {
  const shop = new ShopLane();
  shop.change("thread", "coffee", 1);
  shop.setStatus("thread", "checking out");
  shop.change("thread", "coffee", 1);
  assert.equal(shop.view("thread").status, "browsing");
  assert.equal(shop.view("thread").lines[0].qty, 2);
  shop.setStatus("thread", "ordered");
  shop.remove("thread", "coffee");
  shop.change("thread", "coffee", 1);
  assert.equal(shop.view("thread").lines[0].qty, 2);
});

test("work item publishes the shared review cycle to both threads and resets", () => {
  startWorkItem("builder-thread", "reviewer-thread");
  assert.equal(nextPr(), "PR #12");
  setStatus("in review");
  setReview("changes requested: validate input");
  setStatus("changes requested");
  assert.equal(nextPr(), "PR #13");
  setStatus("in review");
  setStatus("approved");
  assert.deepEqual(workHistory(), [
    "todo",
    "in review",
    "changes requested",
    "in review",
    "approved",
  ]);
  assert.deepEqual(
    workLane.get("builder-thread"),
    workLane.get("reviewer-thread"),
  );
  startWorkItem("next-builder", "next-reviewer");
  assert.deepEqual(workHistory(), ["todo"]);
  assert.equal(nextPr(), "PR #12");
});
