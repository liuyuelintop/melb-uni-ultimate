import { useState, useMemo } from "react";
import { useApi } from "./useApi";
import type { Event } from "@/types/event";

export function usePublicEvents() {
  const [filter, setFilter] = useState<"all" | "active" | "completed">(
    "active"
  );
  const api = useApi<Event[]>("/api/events?public=true");

  const filteredEvents = useMemo(() => {
    const activeEvents = api.data.filter(
      (e) => e.status === "upcoming" || e.status === "ongoing"
    );
    const completedEvents = api.data.filter((e) => e.status === "completed");

    return filter === "all"
      ? api.data
      : filter === "active"
      ? activeEvents
      : completedEvents;
  }, [api.data, filter]);

  return {
    ...api,
    filteredEvents,
    filter,
    setFilter,
  };
}
