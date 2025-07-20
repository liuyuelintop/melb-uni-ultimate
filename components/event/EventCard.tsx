import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";

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

interface EventCardProps {
  event: Event;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const getTypeVariant = (type: string) => {
    switch (type) {
      case "practice":
        return "primary";
      case "tournament":
        return "secondary";
      case "social":
        return "success";
      case "training":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "success";
      case "ongoing":
        return "primary";
      case "completed":
        return "default";
      case "cancelled":
        return "danger";
      default:
        return "default";
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

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant={getTypeVariant(event.type)}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
          <Badge variant={getStatusVariant(event.status)}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
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
              ⏰ Registration deadline: {formatDate(event.registrationDeadline)}
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
      </CardContent>
    </Card>
  );
};

export { EventCard };
export type { Event };
