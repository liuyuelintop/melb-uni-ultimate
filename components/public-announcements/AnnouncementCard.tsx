import React from "react";
import Link from "next/link";
import { Calendar, User, ChevronRight } from "lucide-react";
import type { Announcement } from "@/types/announcement";

export function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: {
        bg: "bg-gradient-to-r from-red-50 to-red-100",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
        label: "High Priority",
      },
      medium: {
        bg: "bg-gradient-to-r from-amber-50 to-yellow-100",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
        label: "Medium Priority",
      },
      low: {
        bg: "bg-gradient-to-r from-green-50 to-emerald-100",
        text: "text-green-700",
        border: "border-green-200",
        dot: "bg-green-500",
        label: "Low Priority",
      },
    };
    return configs[priority as keyof typeof configs] || configs.low;
  };

  const priorityConfig = getPriorityConfig(announcement.priority);

  return (
    <Link
      href={`/announcements/${announcement._id}`}
      className="group relative block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
    >
      {/* Priority indicator bar */}
      <div className={`h-1 ${priorityConfig.bg}`} />

      <div className="p-6">
        {/* Header with priority badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-xl font-bold text-gray-900 leading-tight flex-1 group-hover:text-blue-700 transition-colors duration-200">
            {announcement.title}
          </h2>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border} border shrink-0`}
          >
            <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`} />
            {priorityConfig.label}
          </div>
        </div>

        {/* Meta information */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span className="font-medium">{announcement.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(announcement.publishedAt)}</span>
          </div>
        </div>

        {/* Content preview */}
        <div className="text-gray-700 leading-relaxed mb-4">
          <p className="line-clamp-3">{announcement.content}</p>
        </div>

        {/* Action indicator */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Click to read more</span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}
