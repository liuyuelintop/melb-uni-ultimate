"use client";

import { Container } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import { EventList } from "@/components/public-events/EventList";
import { EventEmptyState } from "@/components/public-events/EventEmptyState";
import { EventErrorState } from "@/components/public-events/EventErrorState";
import { EventLoadingState } from "@/components/public-events/EventLoadingState";
import { EventFilterBar } from "@/components/public-events/EventFilterBar";

export default function EventsPage() {
  const { filteredEvents, loading, error, filter, setFilter } =
    usePublicEvents();

  return (
    <Container>
      <div className="py-8">
        <PageHeader title="Events Calendar" />
        <EventFilterBar filter={filter} setFilter={setFilter} />
        {loading ? (
          <EventLoadingState />
        ) : error ? (
          <EventErrorState message={error} />
        ) : filteredEvents.length === 0 ? (
          <EventEmptyState />
        ) : (
          <EventList events={filteredEvents} />
        )}
      </div>
    </Container>
  );
}
