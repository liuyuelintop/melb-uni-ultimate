"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: string;
  priority: "low" | "medium" | "high";
  isPublished: boolean;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/announcements?published=true");

      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      } else {
        setError("Failed to fetch announcements");
      }
    } catch (error) {
      setError("Network error while fetching announcements");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Club Announcements</h1>
        <div className="text-center">Loading announcements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Club Announcements</h1>
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Club Announcements</h1>

      {announcements.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No announcements available at the moment.</p>
          <p className="text-sm mt-2">Check back later for updates!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{announcement.title}</h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    announcement.priority
                  )}`}
                >
                  {announcement.priority.charAt(0).toUpperCase() +
                    announcement.priority.slice(1)}{" "}
                  Priority
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {announcement.content.length > 200
                  ? `${announcement.content.substring(0, 200)}...`
                  : announcement.content}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>By: {announcement.author}</span>
                <span>
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/announcements/${announcement._id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Read More
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
