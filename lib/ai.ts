import OpenAI from "openai";
import type { AiBriefing, DemoContext, EmailThread, WorkItem } from "./types.ts";
import { getEmailsNeedingResponse, getTopWorkItems, getUpcomingDeadlines } from "./commitments.ts";

export interface ExtractedCommitment {
  title: string;
  dueDate?: string;
  priority: WorkItem["priority"];
  confidenceScore: number;
  relatedPerson?: string;
}

export async function generateMorningBriefing(context: DemoContext): Promise<AiBriefing> {
  if (!process.env.OPENAI_API_KEY) {
    return context.aiBriefing;
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const compactContext = {
    priorities: getTopWorkItems(context.workItems).map((item) => ({
      title: item.title,
      priority: item.priority,
      dueDate: item.dueDate
    })),
    emails: getEmailsNeedingResponse(context.emailThreads).map((thread) => ({
      subject: thread.subject,
      summary: thread.aiSummary,
      labels: thread.labels
    })),
    deadlines: getUpcomingDeadlines(context.workItems).map((item) => ({
      title: item.title,
      dueDate: item.dueDate
    })),
    events: context.calendarEvents.slice(0, 8).map((event) => ({
      title: event.title,
      startsAt: event.startsAt,
      endsAt: event.endsAt
    }))
  };

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You produce concise private morning briefings. Return JSON with greeting, narrative, topPriorities, risks, opportunities, followUps, deadlines, waitingOnMe, waitingOnOthers, scheduleAdjustments, relationshipRecommendations. Do not invent sensitive details."
      },
      {
        role: "user",
        content: JSON.stringify(compactContext)
      }
    ]
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    return context.aiBriefing;
  }

  const parsed = JSON.parse(content) as Omit<AiBriefing, "id" | "generatedAt">;
  return {
    id: `briefing-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    ...parsed
  };
}

export async function summarizeEmailThread(thread: EmailThread): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return thread.aiSummary;
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const snippets = thread.messages.map((message) => ({
    sentAt: message.sentAt,
    snippet: message.bodyPreview
  }));

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "Summarize this email thread in one short sentence. Use only the provided snippets."
      },
      { role: "user", content: JSON.stringify(snippets) }
    ]
  });

  return response.choices[0]?.message.content?.trim() || thread.aiSummary;
}

export function extractCommitmentsFromThread(thread: EmailThread): ExtractedCommitment[] {
  if (!thread.possibleCommitment) {
    return [];
  }

  return [
    {
      title: thread.subject.replace(/^Re:\s*/i, ""),
      priority: thread.important ? "high" : "medium",
      confidenceScore: 0.78,
      relatedPerson: thread.personIds[0]
    }
  ];
}

export function shouldSuggestFollowUp(thread: EmailThread, baseDate = new Date()): boolean {
  const elapsedDays = (baseDate.getTime() - new Date(thread.lastMessageAt).getTime()) / (24 * 60 * 60 * 1000);
  return thread.followUpSuggested || (thread.waitingOnOthers && elapsedDays >= 3);
}
