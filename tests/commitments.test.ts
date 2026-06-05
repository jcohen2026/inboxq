import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectUnansweredThreads, getTopWorkItems } from "../lib/commitments.ts";
import type { EmailThread, WorkItem } from "../lib/types.ts";

function workItem(id: string, priority: WorkItem["priority"], dueDate?: string): WorkItem {
  return {
    id,
    title: id,
    description: id,
    status: "todo",
    priority,
    dueDate,
    sourceType: "manual",
    createdByAi: false
  };
}

function thread(id: string, lastMessageAt: string, waitingOnOthers: boolean): EmailThread {
  return {
    id,
    sourceAccountId: "acct",
    subject: id,
    snippet: id,
    lastMessageAt,
    unread: false,
    important: false,
    labels: [],
    aiSummary: id,
    needsResponse: false,
    waitingOnMe: false,
    waitingOnOthers,
    possibleCommitment: false,
    replySuggested: false,
    followUpSuggested: waitingOnOthers,
    personIds: [],
    messages: [],
    providerMetadata: {}
  };
}

describe("commitment utilities", () => {
  it("sorts top work items by priority and due date", () => {
    const items = getTopWorkItems([
      workItem("medium-soon", "medium", "2026-06-03T15:00:00.000Z"),
      workItem("urgent-later", "urgent", "2026-06-04T15:00:00.000Z"),
      workItem("high-now", "high", "2026-06-03T13:00:00.000Z")
    ]);

    assert.deepEqual(items.map((item) => item.id), ["urgent-later", "high-now", "medium-soon"]);
  });

  it("finds stale waiting-on-others threads", () => {
    const stale = detectUnansweredThreads(
      [
        thread("old", "2026-05-28T12:00:00.000Z", true),
        thread("new", "2026-06-02T12:00:00.000Z", true),
        thread("mine", "2026-05-28T12:00:00.000Z", false)
      ],
      3,
      new Date("2026-06-03T12:00:00.000Z")
    );

    assert.deepEqual(stale.map((item) => item.id), ["old"]);
  });
});
