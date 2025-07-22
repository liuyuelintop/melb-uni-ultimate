import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Event } from "@/types/admin";

export function useEvents() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch("/api/events");
        if (res.ok) setEvents(await res.json());
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const addEvent = async (form: Omit<Event, "_id" | "createdAt">) => {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        maxParticipants:
          typeof form.maxParticipants === "string" && form.maxParticipants
            ? parseInt(form.maxParticipants)
            : undefined,
        registrationDeadline: form.registrationDeadline || undefined,
      }),
    });
    if (response.ok) {
      const newEvent = await response.json();
      setEvents((prev) => [newEvent, ...prev]);
      return { success: true };
    }
    return { success: false, error: "Failed to create event" };
  };

  const deleteEvent = async (id: string) => {
    const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (response.ok) {
      setEvents((prev) => prev.filter((e) => e._id !== id));
      return { success: true };
    }
    return { success: false, error: "Failed to delete event" };
  };

  const updateEvent = async (
    id: string,
    form: Omit<Event, "_id" | "createdAt">
  ) => {
    const response = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        maxParticipants:
          typeof form.maxParticipants === "string" && form.maxParticipants
            ? parseInt(form.maxParticipants)
            : undefined,
        registrationDeadline: form.registrationDeadline || undefined,
      }),
    });
    if (response.ok) {
      const updatedEvent = await response.json();
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? updatedEvent.event : e))
      );
      return { success: true };
    }
    return { success: false, error: "Failed to update event" };
  };

  return {
    events,
    loading,
    addEvent,
    deleteEvent,
    updateEvent,
  };
}
