"use client";

import { useState, useEffect } from "react";
import {
  Container,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { EventCard, type Event } from "@/components/event/EventCard";
import { clsx } from "clsx";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">(
    "active"
  );

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

  // Group/filter events
  const activeEvents = events.filter(
    (e) => e.status === "upcoming" || e.status === "ongoing"
  );
  const completedEvents = events.filter((e) => e.status === "completed");
  const filteredEvents =
    filter === "all"
      ? events
      : filter === "active"
      ? activeEvents
      : completedEvents;

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <PageHeader title="Events Calendar" />
          <LoadingSpinner text="Loading events..." />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">
          <PageHeader title="Events Calendar" />
          <ErrorMessage message={error} />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <PageHeader title="Events Calendar" />
        <div className="flex gap-2 mb-6">
          <button
            className={clsx(
              "px-4 py-2 rounded-full border text-sm font-medium",
              filter === "active"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
            onClick={() => setFilter("active")}
          >
            Upcoming & Ongoing
          </button>
          <button
            className={clsx(
              "px-4 py-2 rounded-full border text-sm font-medium",
              filter === "completed"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={clsx(
              "px-4 py-2 rounded-full border text-sm font-medium",
              filter === "all"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>
        {filteredEvents.length === 0 ? (
          <EmptyState
            title="No events found."
            description="Try a different filter or check back later!"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
