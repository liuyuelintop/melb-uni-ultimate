import type { Announcement } from "@/types/announcement";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getPriorityIcon(priority: string) {
  switch (priority) {
    case "high":
      return "🔴";
    case "medium":
      return "🟡";
    case "low":
      return "🟢";
    default:
      return "⚪";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AnnouncementDetailHeader({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/announcements"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Announcements
        </Link>
      </div>
      {/* Announcement Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {announcement.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Published: {formatDate(announcement.publishedAt)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Updated: {formatDate(announcement.updatedAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                announcement.priority
              )}`}
            >
              {getPriorityIcon(announcement.priority)}{" "}
              {announcement.priority.charAt(0).toUpperCase() +
                announcement.priority.slice(1)}{" "}
              Priority
            </span>
          </div>
        </div>
        {/* Author Info */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Posted by:</span>{" "}
            {announcement.author}
          </p>
        </div>
      </div>
    </>
  );
}
