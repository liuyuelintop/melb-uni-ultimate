import React from "react";
import { Event } from "@shared/types/admin";
import { Button } from "@shared/components/ui/Button";
import { Card } from "@shared/components/ui/Card";
import { Badge } from "@shared/components/ui/Badge";

interface EventListItemProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventListItem: React.FC<EventListItemProps> = ({
  event,
  onEdit,
  onDelete,
}) => (
  <Card className="flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-lg">{event.title}</h3>
          <Badge
            color={
              event.status === "upcoming"
                ? "green"
                : event.status === "ongoing"
                ? "blue"
                : event.status === "completed"
                ? "gray"
                : "red"
            }
          >
            {event.status
              ? event.status.charAt(0).toUpperCase() + event.status.slice(1)
              : "Unknown"}
          </Badge>
        </div>
        {event.description && (
          <p className="text-gray-600 text-sm mt-1 mb-2">{event.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <span>Type: {event.type}</span>
          <span>Date: {new Date(event.startDate).toLocaleDateString()}</span>
          <span>Location: {event.location}</span>
          <span>Participants: {event.currentParticipants}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 ml-4 min-w-[90px]">
        <Button size="sm" variant="secondary" onClick={() => onEdit(event)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(event._id)}
        >
          Delete
        </Button>
      </div>
    </div>
  </Card>
);

export default EventListItem;
