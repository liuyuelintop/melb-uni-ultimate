import type { Event } from "@shared/types/event";
import { EventCard } from "@features/events/components/EventCard";

export function EventList({ events }: { events: Event[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
