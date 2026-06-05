import type { EmailThread, WorkItem } from "./types.ts";

const priorityWeight: Record<WorkItem["priority"], number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1
};

export function getTopWorkItems(workItems: WorkItem[], limit = 5): WorkItem[] {
  return [...workItems]
    .filter((item) => item.status !== "done")
    .sort((a, b) => {
      const priorityDelta = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return aDue - bDue;
    })
    .slice(0, limit);
}

export function getEmailsNeedingResponse(threads: EmailThread[]): EmailThread[] {
  return threads
    .filter((thread) => thread.needsResponse || thread.waitingOnMe)
    .sort((a, b) => Number(b.important) - Number(a.important) || new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export function getWaitingOnOthers(threads: EmailThread[], workItems: WorkItem[]): Array<EmailThread | WorkItem> {
  const threadsWaiting = threads.filter((thread) => thread.waitingOnOthers || thread.followUpSuggested);
  const workWaiting = workItems.filter((item) => item.status === "waiting");
  return [...threadsWaiting, ...workWaiting];
}

export function getUpcomingDeadlines(workItems: WorkItem[], limit = 6): WorkItem[] {
  return [...workItems]
    .filter((item) => item.status !== "done" && item.dueDate)
    .sort((a, b) => new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime())
    .slice(0, limit);
}

export function detectUnansweredThreads(threads: EmailThread[], afterDays = 3, baseDate = new Date()): EmailThread[] {
  const threshold = afterDays * 24 * 60 * 60 * 1000;
  return threads.filter((thread) => {
    if (!thread.waitingOnOthers && !thread.followUpSuggested) {
      return false;
    }

    return baseDate.getTime() - new Date(thread.lastMessageAt).getTime() >= threshold;
  });
}
