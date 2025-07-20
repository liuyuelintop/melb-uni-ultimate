import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: string;
  priority: "low" | "medium" | "high";
  isPublished: boolean;
  createdAt: string;
}

interface AnnouncementCardProps {
  announcement: Announcement;
  className?: string;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  className,
}) => {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">{announcement.title}</h2>
          <Badge variant={getPriorityVariant(announcement.priority)}>
            {announcement.priority.charAt(0).toUpperCase() +
              announcement.priority.slice(1)}{" "}
            Priority
          </Badge>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {announcement.content.length > 200
            ? `${announcement.content.substring(0, 200)}...`
            : announcement.content}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>By: {announcement.author}</span>
          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
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
      </CardContent>
    </Card>
  );
};

export { AnnouncementCard };
export type { Announcement };
