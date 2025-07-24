import { useState, useEffect } from "react";
import type { Event } from "@/types/event";

export function usePublicEvents() {
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

  return { events, filteredEvents, loading, error, filter, setFilter };
}
