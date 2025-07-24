import React from "react";
import { Announcement } from "../../types/admin";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface AnnouncementListItemProps {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onTogglePublish: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnnouncementListItem: React.FC<AnnouncementListItemProps> = ({
  announcement,
  onEdit,
  onTogglePublish,
  onDelete,
}) => (
  <Card className="flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-lg">{announcement.title}</h3>
          <Badge
            color={
              announcement.priority === "low"
                ? "green"
                : announcement.priority === "medium"
                ? "yellow"
                : "red"
            }
          >
            {announcement.priority.charAt(0).toUpperCase() +
              announcement.priority.slice(1)}
          </Badge>
          {announcement.isPublished ? (
            <Badge color="green">Published</Badge>
          ) : (
            <Badge color="gray">Draft</Badge>
          )}
        </div>
        <p className="text-gray-600 text-sm mt-1 mb-2">
          {announcement.content}
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <span>By: {announcement.author}</span>
          <span>
            Created: {new Date(announcement.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 ml-4 min-w-[90px]">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onEdit(announcement)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant={announcement.isPublished ? "primary" : "secondary"}
          onClick={() => onTogglePublish(announcement._id)}
        >
          {announcement.isPublished ? "Unpublish" : "Publish"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(announcement._id)}
        >
          Delete
        </Button>
      </div>
    </div>
  </Card>
);

export default AnnouncementListItem;
