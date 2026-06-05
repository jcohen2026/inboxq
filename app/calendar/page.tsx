import { PageHeading } from "@/components/page-heading";
import { CalendarAgenda } from "@/components/calendar-agenda";
import { getDemoContext } from "@/lib/demo-data";

export default function CalendarPage() {
  const context = getDemoContext();

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading eyebrow="Calendar" title="Today's agenda">
        {context.calendarEvents.length} events synced from {context.calendars.length} calendars.
      </PageHeading>
      <CalendarAgenda context={context} />
    </div>
  );
}
