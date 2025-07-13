import { Button } from "@/components/ui/button";

interface Event {
  title: string;
  date: string;
  time: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
      {events.map((event) => (
        <div key={event.title} className="border p-3 sm:p-4 rounded-lg">
          <div className="text-sm sm:text-base font-medium">{event.title}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            {event.date} • {event.time}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-xs sm:text-sm w-full sm:w-auto">
            Add to Calendar
          </Button>
        </div>
      ))}
    </div>
  );
}
