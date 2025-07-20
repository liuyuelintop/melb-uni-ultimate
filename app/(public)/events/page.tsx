"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Section,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { EventCard, type Event } from "@/components/event/EventCard";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events?public=true");

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        setError("Failed to fetch events");
      }
    } catch (error) {
      setError("Network error while fetching events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Section>
          <PageHeader title="Events Calendar" />
          <LoadingSpinner text="Loading events..." />
        </Section>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Section>
          <PageHeader title="Events Calendar" />
          <ErrorMessage message={error} />
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <PageHeader title="Events Calendar" />

        {events.length === 0 ? (
          <EmptyState
            title="No events scheduled at the moment."
            description="Check back later for upcoming events!"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </Section>
    </Container>
  );
}
