import React, { memo } from "react";
import {
  Calendar,
  User,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Announcement } from "../../types/admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AnnouncementTableProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  low: {
    variant: "default" as const,
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    icon: CheckCircle,
  },
  medium: {
    variant: "secondary" as const,
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
    icon: Clock,
  },
  high: {
    variant: "destructive" as const,
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    icon: AlertCircle,
  },
};

const statusConfig = {
  published: {
    variant: "default" as const,
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  },
  draft: {
    variant: "secondary" as const,
    className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
  },
};

const AnnouncementRow = memo(
  ({
    announcement,
    onEdit,
    onDelete,
  }: {
    announcement: Announcement;
    onEdit: (announcement: Announcement) => void;
    onDelete: (id: string) => void;
  }) => {
    const priorityBadge =
      priorityConfig[announcement.priority as keyof typeof priorityConfig];
    const statusBadge = announcement.isPublished
      ? statusConfig.published
      : statusConfig.draft;
    const PriorityIcon = priorityBadge?.icon;

    return (
      <TableRow className="hover:bg-gray-50/50">
        <TableCell className="px-6 py-4">
          <div className="font-medium text-gray-900">{announcement.title}</div>
        </TableCell>

        <TableCell className="px-6 py-4">
          <Badge
            variant="outline"
            className={`${priorityBadge?.className} text-xs font-medium`}
          >
            {PriorityIcon && <PriorityIcon className="h-3 w-3 mr-1" />}
            {announcement.priority.charAt(0).toUpperCase() +
              announcement.priority.slice(1)}
          </Badge>
        </TableCell>

        <TableCell className="px-6 py-4">
          <Badge
            variant="outline"
            className={`${statusBadge.className} text-xs font-medium`}
          >
            {announcement.isPublished ? "Published" : "Draft"}
          </Badge>
        </TableCell>

        <TableCell className="px-6 py-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">{announcement.author}</span>
          </div>
        </TableCell>

        <TableCell className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {new Date(announcement.createdAt).toLocaleDateString()}
            </span>
          </div>
        </TableCell>

        <TableCell className="px-6 py-4 text-right">
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(announcement)}
              className="h-8 px-3"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(announcement._id)}
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

AnnouncementRow.displayName = "AnnouncementRow";

const AnnouncementTable: React.FC<AnnouncementTableProps> = memo(
  ({ announcements, onEdit, onDelete }) => (
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
                  Priority
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <AnnouncementRow
                  key={announcement._id}
                  announcement={announcement}
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

AnnouncementTable.displayName = "AnnouncementTable";

export default AnnouncementTable;
