import React, { memo } from "react";
import { Calendar, MapPin, Users, Edit, Trash2 } from "lucide-react";
import { Event } from "@shared/types/admin";
import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";
import { Card, CardContent } from "@shared/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  upcoming: {
    variant: "default" as const,
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  },
  ongoing: {
    variant: "secondary" as const,
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  completed: {
    variant: "outline" as const,
    className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
  },
  cancelled: {
    variant: "destructive" as const,
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  },
  default: {
    variant: "secondary" as const,
    className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
  },
};

const EventRow = memo(
  ({
    event,
    onEdit,
    onDelete,
  }: {
    event: Event;
    onEdit: (event: Event) => void;
    onDelete: (id: string) => void;
  }) => {
    const statusBadge =
      statusConfig[event.status as keyof typeof statusConfig] ||
      statusConfig.default;

    return (
      <TableRow className="hover:bg-gray-50/50">
        <TableCell className="px-6 py-4">
          <div className="font-medium text-gray-900">{event.title}</div>
        </TableCell>

        <TableCell className="px-6 py-4">
          <div className="text-sm text-gray-900 capitalize">{event.type}</div>
        </TableCell>

        <TableCell className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {new Date(event.startDate).toLocaleDateString()}
            </span>
          </div>
        </TableCell>

        <TableCell className="px-6 py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">{event.location}</span>
          </div>
        </TableCell>

        <TableCell className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">
              {event.currentParticipants}
            </span>
          </div>
        </TableCell>

        <TableCell className="px-6 py-4">
          <Badge
            variant="outline"
            className={`${statusBadge.className} text-xs font-medium`}
          >
            {event.status
              ? event.status.charAt(0).toUpperCase() + event.status.slice(1)
              : "Unknown"}
          </Badge>
        </TableCell>

        <TableCell className="px-6 py-4 text-right">
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(event)}
              className="h-8 px-3"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(event._id)}
              className="h-8 px-3"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }
);

EventRow.displayName = "EventRow";

const EventTable: React.FC<EventTableProps> = memo(
  ({ events, onEdit, onDelete }) => (
    <Card className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <EventRow
                  key={event._id}
                  event={event}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
);

EventTable.displayName = "EventTable";

export default EventTable;
