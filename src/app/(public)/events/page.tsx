"use client";

import { Container } from "@shared/components/ui/Container";
import { PageHeader } from "@shared/components/layout/PageHeader";
import { usePublicEvents } from "@shared/hooks/usePublicEvents";
import { EventList } from "@features/events/components/EventList";
import { EventEmptyState } from "@features/events/components/EventEmptyState";
import { EventErrorState } from "@features/events/components/EventErrorState";
import { EventLoadingState } from "@features/events/components/EventLoadingState";
import { EventFilterBar } from "@features/events/components/EventFilterBar";

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
