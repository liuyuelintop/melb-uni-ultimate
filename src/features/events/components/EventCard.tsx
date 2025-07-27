import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, Clock, ChevronRight } from "lucide-react";
import type { Event } from "@shared/types/event";

export function EventCard({
  event,
  className,
}: {
  event: Event;
  className?: string;
}) {
  const getTypeConfig = (type: string) => {
    const configs = {
      practice: {
        bg: "bg-gradient-to-r from-blue-50 to-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-500",
        icon: "🏃",
      },
      tournament: {
        bg: "bg-gradient-to-r from-yellow-50 to-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
        icon: "🏆",
      },
      social: {
        bg: "bg-gradient-to-r from-green-50 to-emerald-100",
        text: "text-green-700",
        border: "border-green-200",
        dot: "bg-green-500",
        icon: "🎉",
      },
      training: {
        bg: "bg-gradient-to-r from-red-50 to-red-100",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
        icon: "💪",
      },
    };
    return (
      configs[type as keyof typeof configs] || {
        bg: "bg-gradient-to-r from-gray-50 to-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
        dot: "bg-gray-500",
        icon: "📅",
      }
    );
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      upcoming: {
        bg: "bg-gradient-to-r from-emerald-50 to-green-100",
        text: "text-green-700",
        border: "border-green-200",
        dot: "bg-green-500",
      },
      ongoing: {
        bg: "bg-gradient-to-r from-blue-50 to-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-500",
      },
      completed: {
        bg: "bg-gradient-to-r from-gray-50 to-gray-100",
        text: "text-gray-600",
        border: "border-gray-200",
        dot: "bg-gray-400",
      },
    };
    return configs[status as keyof typeof configs] || configs.completed;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRegistrationDeadline = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const typeConfig = getTypeConfig(event.type);
  const statusConfig = getStatusConfig(event.status);

  return (
    <Link
      href={`/events/${event._id}`}
      className={`group relative block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden ${
        className ?? ""
      }`}
    >
      {/* Type indicator bar */}
      <div className={`h-1 ${typeConfig.bg}`} />

      <div className="p-6">
        {/* Header with badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border} border`}
          >
            <span>{typeConfig.icon}</span>
            <span>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}
          >
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-blue-700 transition-colors duration-200">
          {event.title}
        </h2>

        {/* Description */}
        {event.description && (
          <div className="text-gray-700 leading-relaxed mb-4">
            <p className="line-clamp-2">{event.description}</p>
          </div>
        )}

        {/* Event details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="font-medium">{formatDate(event.startDate)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{event.location}</span>
          </div>

          {typeof event.currentParticipants === "number" && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="w-4 h-4 shrink-0" />
              <span>{event.currentParticipants} participants</span>
            </div>
          )}

          {event.registrationDeadline && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 shrink-0" />
              <span>
                Registration deadline:{" "}
                <span className="font-medium">
                  {formatRegistrationDeadline(event.registrationDeadline)}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Action indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-500">View event details</span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}
