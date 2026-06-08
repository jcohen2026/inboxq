import type {
  AiBriefing,
  AiInsight,
  CalendarEvent,
  CalendarSource,
  ConnectedAccount,
  DashboardWidget,
  DemoContext,
  EmailThread,
  Person,
  Project,
  RssSource,
  SyncLog,
  WorkItem
} from "./types.ts";
import { atTime, minutesFromNow } from "./time.ts";

const now = new Date();
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const connectedAccounts: ConnectedAccount[] = [
  {
    id: "acct-personal",
    userId: "user-demo",
    provider: "google",
    providerAccountId: "google-personal-001",
    displayName: "Personal",
    email: "jordan.home@example.com",
    color: "#3868d6",
    scopes: ["gmail", "calendar"],
    status: "connected",
    createdAt: atTime(8, 0, -14, now),
    providerMetadata: { avatarInitials: "JH", sourceLabel: "Home" }
  },
  {
    id: "acct-studio",
    userId: "user-demo",
    provider: "google",
    providerAccountId: "google-studio-002",
    displayName: "Studio",
    email: "jordan@northstar.studio",
    color: "#4b9b74",
    scopes: ["gmail", "calendar"],
    status: "connected",
    createdAt: atTime(9, 0, -12, now),
    providerMetadata: { avatarInitials: "NS", sourceLabel: "Studio" }
  },
  {
    id: "acct-consulting",
    userId: "user-demo",
    provider: "google",
    providerAccountId: "google-consulting-003",
    displayName: "Consulting",
    email: "jordan@atlas-advisory.example",
    color: "#b55d3b",
    scopes: ["gmail", "calendar"],
    status: "connected",
    createdAt: atTime(9, 15, -8, now),
    providerMetadata: { avatarInitials: "AA", sourceLabel: "Consulting" }
  },
  {
    id: "acct-slack",
    userId: "user-demo",
    provider: "slack",
    providerAccountId: "slack-stub-001",
    displayName: "Studio Slack",
    email: "northstar.slack",
    color: "#6b5b95",
    scopes: ["slack"],
    status: "stubbed",
    createdAt: atTime(10, 0, -5, now),
    providerMetadata: { workspace: "Northstar" }
  }
];

export const people: Person[] = [
  {
    id: "person-maya",
    name: "Maya Chen",
    email: "maya@lucenthealth.example",
    role: "VP Product",
    company: "Lucent Health",
    accountIds: ["acct-studio", "acct-consulting"],
    relationshipHealth: "strong",
    lastInteractionAt: minutesFromNow(-55, now),
    notes: "Prefers crisp agenda bullets and Friday recaps."
  },
  {
    id: "person-diego",
    name: "Diego Alvarez",
    email: "diego@mapleandmain.example",
    role: "Founder",
    company: "Maple & Main",
    accountIds: ["acct-studio"],
    relationshipHealth: "needs_attention",
    lastInteractionAt: atTime(15, 40, -6, now),
    notes: "Waiting for a proposal revision and pricing appendix."
  },
  {
    id: "person-nina",
    name: "Nina Patel",
    email: "nina@family.example",
    role: "Family",
    company: "Home",
    accountIds: ["acct-personal"],
    relationshipHealth: "steady",
    lastInteractionAt: atTime(20, 10, -1, now),
    notes: "Shared travel planning and weekend logistics."
  },
  {
    id: "person-sam",
    name: "Sam Okafor",
    email: "sam@northstar.studio",
    role: "Design Lead",
    company: "Northstar Studio",
    accountIds: ["acct-studio", "acct-slack"],
    relationshipHealth: "strong",
    lastInteractionAt: minutesFromNow(-25, now),
    notes: "Owns design QA and launch creative."
  },
  {
    id: "person-rachel",
    name: "Rachel Kim",
    email: "rachel@atlas-advisory.example",
    role: "Operations Partner",
    company: "Atlas Advisory",
    accountIds: ["acct-consulting"],
    relationshipHealth: "steady",
    lastInteractionAt: atTime(11, 30, -1, now),
    notes: "Coordinates consulting pipeline and finance reviews."
  }
];

export const projects: Project[] = [
  {
    id: "project-lucent",
    name: "Lucent Launch Brief",
    client: "Lucent Health",
    health: "watch",
    status: "active",
    nextAction: "Send revised executive narrative before Maya's 3:00 PM review.",
    dueDate: atTime(16, 0, 0, now),
    relatedPersonIds: ["person-maya", "person-sam"],
    color: "#3868d6"
  },
  {
    id: "project-maple",
    name: "Maple & Main Proposal",
    client: "Maple & Main",
    health: "at_risk",
    status: "active",
    nextAction: "Confirm budget assumptions and reply to Diego with the new scope.",
    dueDate: atTime(12, 0, 1, now),
    relatedPersonIds: ["person-diego", "person-rachel"],
    color: "#b55d3b"
  },
  {
    id: "project-home",
    name: "June Personal Reset",
    client: "Personal",
    health: "healthy",
    status: "planning",
    nextAction: "Pick the weekend travel window after checking Nina's schedule.",
    dueDate: atTime(18, 0, 2, now),
    relatedPersonIds: ["person-nina"],
    color: "#4b9b74"
  }
];

export const emailThreads: EmailThread[] = [
  {
    id: "thread-lucent-review",
    sourceAccountId: "acct-studio",
    subject: "Lucent launch narrative: final gaps",
    snippet: "Maya asked for the risk paragraph and customer proof points before the 3 PM review.",
    lastMessageAt: minutesFromNow(-46, now),
    unread: true,
    important: true,
    labels: ["Client", "Launch", "Needs reply"],
    aiSummary: "Maya needs a tightened risk paragraph and two customer proof points ahead of today's review.",
    needsResponse: true,
    waitingOnMe: true,
    waitingOnOthers: false,
    possibleCommitment: true,
    replySuggested: true,
    followUpSuggested: false,
    projectId: "project-lucent",
    personIds: ["person-maya"],
    messages: [
      {
        id: "msg-lucent-1",
        threadId: "thread-lucent-review",
        sourceAccountId: "acct-studio",
        fromPersonId: "person-maya",
        toPersonIds: ["person-sam"],
        sentAt: minutesFromNow(-46, now),
        snippet: "Can you add the risk paragraph and proof points before 3?",
        bodyPreview: "We are close. The board version needs one stronger risk paragraph and proof points before the afternoon review.",
        providerMetadata: { gmailMessageId: "demo-lucent-001", labels: ["IMPORTANT"] }
      }
    ],
    providerMetadata: { gmailThreadId: "demo-thread-lucent-review", historyId: "9101" }
  },
  {
    id: "thread-maple-scope",
    sourceAccountId: "acct-consulting",
    subject: "Re: Updated scope and numbers",
    snippet: "Diego has not responded since last week. Budget approval may slip without a nudge.",
    lastMessageAt: atTime(15, 40, -6, now),
    unread: false,
    important: true,
    labels: ["Proposal", "Follow up"],
    aiSummary: "You sent updated pricing six days ago. A short follow-up is likely useful today.",
    needsResponse: false,
    waitingOnMe: false,
    waitingOnOthers: true,
    possibleCommitment: false,
    replySuggested: false,
    followUpSuggested: true,
    projectId: "project-maple",
    personIds: ["person-diego"],
    messages: [
      {
        id: "msg-maple-1",
        threadId: "thread-maple-scope",
        sourceAccountId: "acct-consulting",
        fromPersonId: "person-diego",
        toPersonIds: ["person-rachel"],
        sentAt: atTime(10, 15, -7, now),
        snippet: "Can you send a narrower version with the same outcomes?",
        bodyPreview: "The original version is useful, but I need a narrower package with the same outcomes before I can approve it.",
        providerMetadata: { gmailMessageId: "demo-maple-001" }
      }
    ],
    providerMetadata: { gmailThreadId: "demo-thread-maple-scope", historyId: "8892" }
  },
  {
    id: "thread-travel-weekend",
    sourceAccountId: "acct-personal",
    subject: "Weekend travel window",
    snippet: "Nina suggested leaving Saturday morning, but the calendar has a Friday evening opening.",
    lastMessageAt: atTime(20, 10, -1, now),
    unread: true,
    important: false,
    labels: ["Personal", "Travel"],
    aiSummary: "Nina prefers Saturday morning travel. Friday evening may be easier if you wrap client work by 4 PM.",
    needsResponse: true,
    waitingOnMe: true,
    waitingOnOthers: false,
    possibleCommitment: true,
    replySuggested: true,
    followUpSuggested: false,
    projectId: "project-home",
    personIds: ["person-nina"],
    messages: [
      {
        id: "msg-travel-1",
        threadId: "thread-travel-weekend",
        sourceAccountId: "acct-personal",
        fromPersonId: "person-nina",
        toPersonIds: [],
        sentAt: atTime(20, 10, -1, now),
        snippet: "Saturday morning is easiest for me, but Friday could work.",
        bodyPreview: "Saturday morning is easiest for me, but Friday could work if your afternoon clears.",
        providerMetadata: { gmailMessageId: "demo-travel-001" }
      }
    ],
    providerMetadata: { gmailThreadId: "demo-thread-travel", historyId: "9137" }
  },
  {
    id: "thread-ops-retainer",
    sourceAccountId: "acct-consulting",
    subject: "Retainer renewal checklist",
    snippet: "Rachel sent the renewal checklist and asked you to approve the draft invoice.",
    lastMessageAt: atTime(11, 30, -1, now),
    unread: false,
    important: false,
    labels: ["Finance", "Admin"],
    aiSummary: "Approve Rachel's draft invoice and confirm whether the Lucent retainer renewal should include design QA.",
    needsResponse: true,
    waitingOnMe: true,
    waitingOnOthers: false,
    possibleCommitment: true,
    replySuggested: true,
    followUpSuggested: false,
    projectId: "project-lucent",
    personIds: ["person-rachel"],
    messages: [
      {
        id: "msg-ops-1",
        threadId: "thread-ops-retainer",
        sourceAccountId: "acct-consulting",
        fromPersonId: "person-rachel",
        toPersonIds: [],
        sentAt: atTime(11, 30, -1, now),
        snippet: "Please approve the invoice draft today if this still looks right.",
        bodyPreview: "The invoice draft is ready. Please approve it today if this still looks right.",
        providerMetadata: { gmailMessageId: "demo-ops-001" }
      }
    ],
    providerMetadata: { gmailThreadId: "demo-thread-ops", historyId: "9170" }
  }
];

export const calendars: CalendarSource[] = [
  {
    id: "cal-personal-primary",
    sourceAccountId: "acct-personal",
    providerCalendarId: "primary",
    name: "Personal",
    color: "#3868d6",
    timezone: "America/New_York",
    selected: true,
    providerMetadata: { accessRole: "owner" }
  },
  {
    id: "cal-studio-client",
    sourceAccountId: "acct-studio",
    providerCalendarId: "studio-client",
    name: "Studio Client",
    color: "#4b9b74",
    timezone: "America/New_York",
    selected: true,
    providerMetadata: { accessRole: "owner" }
  },
  {
    id: "cal-consulting",
    sourceAccountId: "acct-consulting",
    providerCalendarId: "consulting-main",
    name: "Consulting",
    color: "#b55d3b",
    timezone: "America/New_York",
    selected: true,
    providerMetadata: { accessRole: "owner" }
  }
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "event-standup",
    sourceAccountId: "acct-studio",
    calendarId: "cal-studio-client",
    title: "Studio standup",
    startsAt: atTime(9, 15, 0, now),
    endsAt: atTime(9, 45, 0, now),
    attendeePersonIds: ["person-sam"],
    status: "confirmed",
    projectId: "project-lucent",
    descriptionPreview: "Launch tasks and QA blockers.",
    providerMetadata: { googleEventId: "evt-standup" }
  },
  {
    id: "event-lucent-prep",
    sourceAccountId: "acct-studio",
    calendarId: "cal-studio-client",
    title: "Lucent prep block",
    startsAt: atTime(10, 0, 0, now),
    endsAt: atTime(11, 30, 0, now),
    attendeePersonIds: [],
    status: "confirmed",
    projectId: "project-lucent",
    descriptionPreview: "Finish board narrative and source proof points.",
    providerMetadata: { googleEventId: "evt-lucent-prep" }
  },
  {
    id: "event-rachel",
    sourceAccountId: "acct-consulting",
    calendarId: "cal-consulting",
    title: "Ops review with Rachel",
    startsAt: atTime(11, 0, 0, now),
    endsAt: atTime(11, 45, 0, now),
    attendeePersonIds: ["person-rachel"],
    status: "confirmed",
    projectId: "project-lucent",
    descriptionPreview: "Retainer renewal, invoice approvals, pipeline.",
    providerMetadata: { googleEventId: "evt-rachel-review" }
  },
  {
    id: "event-maple",
    sourceAccountId: "acct-consulting",
    calendarId: "cal-consulting",
    title: "Maple & Main pricing review",
    startsAt: atTime(13, 30, 0, now),
    endsAt: atTime(14, 15, 0, now),
    attendeePersonIds: ["person-diego", "person-rachel"],
    status: "tentative",
    projectId: "project-maple",
    descriptionPreview: "Narrowed package and timeline assumptions.",
    providerMetadata: { googleEventId: "evt-maple-review" }
  },
  {
    id: "event-lucent-review",
    sourceAccountId: "acct-studio",
    calendarId: "cal-studio-client",
    title: "Lucent executive review",
    startsAt: atTime(15, 0, 0, now),
    endsAt: atTime(16, 0, 0, now),
    attendeePersonIds: ["person-maya", "person-sam"],
    status: "confirmed",
    projectId: "project-lucent",
    descriptionPreview: "Board-level narrative review.",
    providerMetadata: { googleEventId: "evt-lucent-review" }
  },
  {
    id: "event-personal-errand",
    sourceAccountId: "acct-personal",
    calendarId: "cal-personal-primary",
    title: "School pickup window",
    startsAt: atTime(16, 30, 0, now),
    endsAt: atTime(17, 15, 0, now),
    attendeePersonIds: ["person-nina"],
    status: "confirmed",
    projectId: "project-home",
    descriptionPreview: "Personal logistics.",
    providerMetadata: { googleEventId: "evt-personal-pickup" }
  },
  {
    id: "event-tomorrow-design",
    sourceAccountId: "acct-studio",
    calendarId: "cal-studio-client",
    title: "Design QA signoff",
    startsAt: atTime(10, 30, 1, now),
    endsAt: atTime(11, 30, 1, now),
    attendeePersonIds: ["person-sam"],
    status: "confirmed",
    projectId: "project-lucent",
    descriptionPreview: "Final QA review.",
    providerMetadata: { googleEventId: "evt-design-signoff" }
  }
];

export const workItems: WorkItem[] = [
  {
    id: "work-lucent-proof",
    title: "Add customer proof points to Lucent narrative",
    description: "Pull two proof points from the launch packet and send to Maya before review.",
    status: "todo",
    priority: "urgent",
    dueDate: atTime(14, 30, 0, now),
    sourceType: "email",
    sourceId: "thread-lucent-review",
    sourceAccountId: "acct-studio",
    relatedPersonId: "person-maya",
    relatedProjectId: "project-lucent",
    confidenceScore: 0.94,
    createdByAi: true
  },
  {
    id: "work-maple-followup",
    title: "Nudge Diego on narrowed proposal",
    description: "Send a concise follow-up with budget assumptions and one decision question.",
    status: "waiting",
    priority: "high",
    dueDate: atTime(12, 0, 0, now),
    sourceType: "email",
    sourceId: "thread-maple-scope",
    sourceAccountId: "acct-consulting",
    relatedPersonId: "person-diego",
    relatedProjectId: "project-maple",
    confidenceScore: 0.82,
    createdByAi: true
  },
  {
    id: "work-invoice",
    title: "Approve retainer invoice draft",
    description: "Confirm Rachel's invoice draft and renewal scope.",
    status: "todo",
    priority: "medium",
    dueDate: atTime(17, 0, 0, now),
    sourceType: "email",
    sourceId: "thread-ops-retainer",
    sourceAccountId: "acct-consulting",
    relatedPersonId: "person-rachel",
    relatedProjectId: "project-lucent",
    confidenceScore: 0.88,
    createdByAi: true
  },
  {
    id: "work-travel",
    title: "Confirm weekend travel plan with Nina",
    description: "Choose Friday evening or Saturday morning based on client wrap-up.",
    status: "todo",
    priority: "medium",
    dueDate: atTime(20, 0, 0, now),
    sourceType: "email",
    sourceId: "thread-travel-weekend",
    sourceAccountId: "acct-personal",
    relatedPersonId: "person-nina",
    relatedProjectId: "project-home",
    confidenceScore: 0.9,
    createdByAi: true
  },
  {
    id: "work-focus",
    title: "Protect a 90-minute focus block",
    description: "Use the morning opening to finish narrative edits before reactive work starts.",
    status: "in_progress",
    priority: "high",
    dueDate: atTime(11, 30, 0, now),
    sourceType: "calendar",
    sourceId: "event-lucent-prep",
    sourceAccountId: "acct-studio",
    relatedProjectId: "project-lucent",
    confidenceScore: 0.76,
    createdByAi: true
  }
];

export const aiBriefing: AiBriefing = {
  id: "briefing-demo",
  generatedAt: minutesFromNow(-12, now),
  greeting: "Good morning, Jordan.",
  narrative:
    "Today is client-heavy but manageable if you protect the Lucent prep block and send two replies before noon. The main risk is letting the Maple proposal linger while Lucent takes the day.",
  topPriorities: [
    "Finish and send Lucent customer proof points before the 3:00 PM review.",
    "Follow up with Diego on Maple & Main pricing assumptions.",
    "Approve Rachel's retainer invoice draft.",
    "Confirm the weekend travel window with Nina.",
    "Keep 4:00-4:30 PM open as a recovery buffer."
  ],
  risks: [
    "Lucent prep overlaps with the Ops review by 30 minutes.",
    "Maple & Main has gone six days without a reply.",
    "Personal logistics become tight after the 4:30 PM pickup window."
  ],
  opportunities: [
    "The 11:45 AM opening is a good reply sprint.",
    "A short Maple follow-up could unlock tomorrow's proposal decision.",
    "Sam can own design QA if you send crisp acceptance criteria."
  ],
  followUps: [
    "Maya Chen: send proof points and risk paragraph.",
    "Diego Alvarez: ask whether the narrowed package is approved.",
    "Nina Patel: confirm Friday or Saturday travel."
  ],
  deadlines: [
    "Lucent narrative update due by 2:30 PM.",
    "Retainer invoice approval due by end of day.",
    "Maple narrowed proposal decision due tomorrow."
  ],
  waitingOnMe: [
    "Maya is waiting on the launch narrative edits.",
    "Rachel is waiting on invoice approval.",
    "Nina is waiting on travel confirmation."
  ],
  waitingOnOthers: [
    "Diego is holding the Maple proposal decision.",
    "Sam owes design QA notes after tomorrow's signoff."
  ],
  scheduleAdjustments: [
    "Move Ops review to 11:45 AM or shorten Lucent prep by 15 minutes.",
    "Keep 2:15-2:45 PM for final Lucent polish.",
    "Avoid adding calls after 4:00 PM."
  ],
  relationshipRecommendations: [
    "Send Diego a warm, specific nudge today.",
    "Give Maya confidence by naming the exact changes before the meeting.",
    "Reply to Nina before evening so travel plans do not drift."
  ]
};

export const aiInsights: AiInsight[] = [
  {
    id: "insight-lucent-risk",
    type: "risk",
    title: "Lucent review prep is the day anchor",
    body: "Two email commitments and one prep block point to the same deadline before 3:00 PM.",
    priority: "urgent",
    sourceIds: ["thread-lucent-review", "event-lucent-review", "work-lucent-proof"],
    createdAt: aiBriefing.generatedAt
  },
  {
    id: "insight-maple-followup",
    type: "follow_up",
    title: "Maple follow-up is overdue",
    body: "The proposal thread is quiet for six days and tomorrow's deadline is still active.",
    priority: "high",
    sourceIds: ["thread-maple-scope", "work-maple-followup"],
    createdAt: aiBriefing.generatedAt
  },
  {
    id: "insight-focus",
    type: "schedule",
    title: "Best focus window is late morning",
    body: "Your cleanest uninterrupted block is after standup and before the Ops review overlap.",
    priority: "high",
    sourceIds: ["event-lucent-prep"],
    createdAt: aiBriefing.generatedAt
  }
];

export const rssSources: RssSource[] = [
  {
    id: "rss-product",
    title: "Product and AI",
    url: "https://example.com/product-ai.xml",
    category: "Work",
    latestItems: [
      {
        id: "rss-1",
        title: "How founders are using lightweight AI agents in daily planning",
        source: "Product Notes",
        publishedAt: atTime(7, 15, 0, now)
      },
      {
        id: "rss-2",
        title: "Calendar-first workflows for client teams",
        source: "Ops Weekly",
        publishedAt: atTime(6, 45, 0, now)
      }
    ]
  }
];

export const dashboardWidgets: DashboardWidget[] = [
  { id: "widget-briefing", title: "AI Morning Briefing", type: "briefing", position: 1, enabled: true, config: {} },
  { id: "widget-priorities", title: "Today's Priorities", type: "priorities", position: 2, enabled: true, config: {} },
  { id: "widget-calendar", title: "Calendar Snapshot", type: "calendar", position: 3, enabled: true, config: {} },
  { id: "widget-availability", title: "Open Focus Windows", type: "availability", position: 4, enabled: true, config: {} },
  { id: "widget-email", title: "Emails Needing Response", type: "email", position: 5, enabled: true, config: {} },
  { id: "widget-waiting-me", title: "Waiting On Me", type: "waiting", position: 6, enabled: true, config: { side: "me" } },
  { id: "widget-waiting-others", title: "Waiting On Others", type: "waiting", position: 7, enabled: true, config: { side: "others" } },
  { id: "widget-deadlines", title: "Upcoming Deadlines", type: "deadlines", position: 8, enabled: true, config: {} },
  { id: "widget-weather", title: "Weather", type: "weather", position: 9, enabled: true, config: {} },
  { id: "widget-rss", title: "RSS / News", type: "rss", position: 10, enabled: true, config: {} },
  { id: "widget-sports", title: "Sports", type: "sports", position: 11, enabled: true, config: {} },
  { id: "widget-links", title: "Quick Links", type: "links", position: 12, enabled: true, config: {} }
];

export const syncLogs: SyncLog[] = [
  {
    id: "sync-studio-gmail",
    sourceAccountId: "acct-studio",
    provider: "google",
    syncType: "gmail",
    status: "success",
    startedAt: minutesFromNow(-18, now),
    completedAt: minutesFromNow(-17, now),
    itemCount: 42,
    message: "Demo Gmail sync completed."
  },
  {
    id: "sync-consulting-calendar",
    sourceAccountId: "acct-consulting",
    provider: "google",
    syncType: "calendar",
    status: "success",
    startedAt: minutesFromNow(-16, now),
    completedAt: minutesFromNow(-15, now),
    itemCount: 11,
    message: "Demo calendar sync completed."
  },
  {
    id: "sync-slack",
    sourceAccountId: "acct-slack",
    provider: "slack",
    syncType: "slack",
    status: "warning",
    startedAt: minutesFromNow(-14, now),
    completedAt: minutesFromNow(-14, now),
    itemCount: 0,
    message: "Slack workspace is stubbed in demo mode."
  }
];

export const quickLinks = [
  { id: "link-drive", label: "Drive", href: "https://drive.google.com", category: "Google" },
  { id: "link-docs", label: "Docs", href: "https://docs.google.com", category: "Google" },
  { id: "link-linear", label: "Linear", href: "https://linear.app", category: "Work" },
  { id: "link-notion", label: "Notion", href: "https://notion.so", category: "Work" },
  { id: "link-bank", label: "Bank", href: "https://example.com", category: "Personal" },
  { id: "link-family", label: "Family Hub", href: "https://example.com", category: "Personal" }
];

export function getDemoContext(): DemoContext {
  if (!demoMode) {
    return getEmptyBetaContext();
  }

  return {
    user: {
      id: "user-demo",
      name: "Jordan",
      timezone: "America/New_York"
    },
    connectedAccounts,
    people,
    projects,
    emailThreads,
    calendars,
    calendarEvents,
    workItems,
    aiBriefing,
    aiInsights,
    rssSources,
    dashboardWidgets,
    syncLogs,
    quickLinks
  };
}

function getEmptyBetaContext(): DemoContext {
  return {
    user: {
      id: "user-beta",
      name: "You",
      timezone: "America/New_York"
    },
    connectedAccounts: [],
    people: [],
    projects: [],
    emailThreads: [],
    calendars: [],
    calendarEvents: [],
    workItems: [],
    aiBriefing: {
      id: "briefing-empty",
      generatedAt: new Date().toISOString(),
      greeting: "Ready when your accounts are connected.",
      narrative:
        "Connect Google from Settings to start syncing your inboxes and calendars. Until live sync is enabled, this private beta state stays empty instead of showing demo accounts.",
      topPriorities: [],
      risks: [],
      opportunities: [],
      followUps: [],
      deadlines: [],
      waitingOnMe: [],
      waitingOnOthers: [],
      scheduleAdjustments: [],
      relationshipRecommendations: []
    },
    aiInsights: [],
    rssSources: [],
    dashboardWidgets,
    syncLogs: [],
    quickLinks: []
  };
}
