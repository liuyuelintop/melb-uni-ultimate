"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  type: "practice" | "tournament" | "social" | "training";
  startDate: string;
  endDate: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  currentParticipants: number;
  maxParticipants?: number;
  registrationDeadline?: string;
  isPublic: boolean;
}

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "practice":
        return "bg-blue-100 text-blue-800";
      case "tournament":
        return "bg-purple-100 text-purple-800";
      case "social":
        return "bg-green-100 text-green-800";
      case "training":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Events Calendar</h1>
        <div className="text-center">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Events Calendar</h1>
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Events Calendar</h1>

      {events.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No events scheduled at the moment.</p>
          <p className="text-sm mt-2">Check back later for upcoming events!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm ${getTypeColor(
                    event.type
                  )}`}
                >
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                <span
                  className={`text-sm ${getStatusColor(
                    event.status
                  )} px-2 py-1 rounded-full`}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              {event.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description.length > 120
                    ? `${event.description.substring(0, 120)}...`
                    : event.description}
                </p>
              )}
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div>📅 {formatDate(event.startDate)}</div>
                <div>📍 {event.location}</div>
                <div>
                  👥 {event.currentParticipants}/{event.maxParticipants || "∞"}{" "}
                  participants
                </div>
                {event.registrationDeadline && (
                  <div>
                    ⏰ Registration deadline:{" "}
                    {formatDate(event.registrationDeadline)}
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/events/${event._id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
