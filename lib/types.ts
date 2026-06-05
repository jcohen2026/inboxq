export type Provider = "google" | "slack" | "rss";
export type AccountCapability = "gmail" | "calendar" | "slack" | "rss";
export type WorkItemStatus = "todo" | "in_progress" | "waiting" | "done";
export type WorkItemPriority = "low" | "medium" | "high" | "urgent";
export type SourceType = "email" | "calendar" | "slack" | "manual";
export type ProjectHealth = "healthy" | "watch" | "at_risk";
export type InsightType =
  | "priority"
  | "risk"
  | "opportunity"
  | "follow_up"
  | "deadline"
  | "waiting_on_me"
  | "waiting_on_others"
  | "schedule"
  | "relationship";

export interface ConnectedAccount {
  id: string;
  userId: string;
  provider: Provider;
  providerAccountId: string;
  displayName: string;
  email: string;
  color: string;
  scopes: AccountCapability[];
  status: "connected" | "needs_reauth" | "stubbed";
  createdAt: string;
  providerMetadata: Record<string, unknown>;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  accountIds: string[];
  relationshipHealth: "strong" | "steady" | "needs_attention";
  lastInteractionAt: string;
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  health: ProjectHealth;
  status: "planning" | "active" | "paused" | "complete";
  nextAction: string;
  dueDate: string;
  relatedPersonIds: string[];
  color: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  sourceAccountId: string;
  fromPersonId: string;
  toPersonIds: string[];
  sentAt: string;
  snippet: string;
  bodyPreview: string;
  providerMetadata: Record<string, unknown>;
}

export interface EmailThread {
  id: string;
  sourceAccountId: string;
  subject: string;
  snippet: string;
  lastMessageAt: string;
  unread: boolean;
  important: boolean;
  labels: string[];
  aiSummary: string;
  needsResponse: boolean;
  waitingOnMe: boolean;
  waitingOnOthers: boolean;
  possibleCommitment: boolean;
  replySuggested: boolean;
  followUpSuggested: boolean;
  projectId?: string;
  personIds: string[];
  messages: EmailMessage[];
  providerMetadata: Record<string, unknown>;
}

export interface CalendarSource {
  id: string;
  sourceAccountId: string;
  providerCalendarId: string;
  name: string;
  color: string;
  timezone: string;
  selected: boolean;
  providerMetadata: Record<string, unknown>;
}

export interface CalendarEvent {
  id: string;
  sourceAccountId: string;
  calendarId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  location?: string;
  attendeePersonIds: string[];
  status: "confirmed" | "tentative" | "cancelled";
  projectId?: string;
  descriptionPreview?: string;
  providerMetadata: Record<string, unknown>;
}

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  dueDate?: string;
  sourceType: SourceType;
  sourceId?: string;
  sourceAccountId?: string;
  relatedPersonId?: string;
  relatedProjectId?: string;
  confidenceScore?: number;
  createdByAi: boolean;
}

export interface AiInsight {
  id: string;
  type: InsightType;
  title: string;
  body: string;
  priority: WorkItemPriority;
  sourceIds: string[];
  createdAt: string;
}

export interface AiBriefing {
  id: string;
  generatedAt: string;
  greeting: string;
  narrative: string;
  topPriorities: string[];
  risks: string[];
  opportunities: string[];
  followUps: string[];
  deadlines: string[];
  waitingOnMe: string[];
  waitingOnOthers: string[];
  scheduleAdjustments: string[];
  relationshipRecommendations: string[];
}

export interface RssSource {
  id: string;
  title: string;
  url: string;
  category: string;
  latestItems: Array<{
    id: string;
    title: string;
    source: string;
    publishedAt: string;
  }>;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type:
    | "briefing"
    | "priorities"
    | "calendar"
    | "availability"
    | "email"
    | "waiting"
    | "deadlines"
    | "weather"
    | "rss"
    | "sports"
    | "links";
  position: number;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface SyncLog {
  id: string;
  sourceAccountId: string;
  provider: Provider;
  syncType: AccountCapability;
  status: "success" | "warning" | "error";
  startedAt: string;
  completedAt: string;
  itemCount: number;
  message: string;
}

export interface DemoContext {
  user: {
    id: string;
    name: string;
    timezone: string;
  };
  connectedAccounts: ConnectedAccount[];
  people: Person[];
  projects: Project[];
  emailThreads: EmailThread[];
  calendars: CalendarSource[];
  calendarEvents: CalendarEvent[];
  workItems: WorkItem[];
  aiBriefing: AiBriefing;
  aiInsights: AiInsight[];
  rssSources: RssSource[];
  dashboardWidgets: DashboardWidget[];
  syncLogs: SyncLog[];
  quickLinks: Array<{
    id: string;
    label: string;
    href: string;
    category: string;
  }>;
}
