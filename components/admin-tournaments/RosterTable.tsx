import React, { memo } from "react";
import { User, Trash2, Crown, Shield } from "lucide-react";
import { RosterEntry } from "@/types/roster";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RosterTableProps {
  roster: RosterEntry[];
  removeLoadingId: string;
  handleRemovePlayer: (rosterEntryId: string) => void;
}

const getRoleIcon = (role?: string) => {
  if (!role) return <User className="h-4 w-4 text-gray-400" />;
  if (role === "captain") return <Crown className="h-4 w-4 text-yellow-500" />;
  if (role === "player-coach")
    return <Shield className="h-4 w-4 text-blue-500" />;
  return <User className="h-4 w-4 text-gray-400" />;
};

const getGenderBadge = (gender: string) => {
  const config = {
    male: {
      variant: "default" as const,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    female: {
      variant: "default" as const,
      className: "bg-pink-50 text-pink-700 border-pink-200",
    },
    other: {
      variant: "outline" as const,
      className: "bg-gray-50 text-gray-700 border-gray-200",
    },
  };

  const badgeConfig =
    config[gender.toLowerCase() as keyof typeof config] || config.other;

  return (
    <Badge
      variant={badgeConfig.variant}
      className={`${badgeConfig.className} text-xs font-medium`}
    >
      {gender}
    </Badge>
  );
};

const RosterRow = memo(
  ({
    entry,
    removeLoadingId,
    handleRemovePlayer,
  }: {
    entry: RosterEntry;
    removeLoadingId: string;
    handleRemovePlayer: (rosterEntryId: string) => void;
  }) => {
    const isRemoving = removeLoadingId === entry._id;

    return (
      <TableRow className="hover:bg-gray-50/50">
        <TableCell className="px-6 py-4">
          <div className="flex items-center gap-3">
            {getRoleIcon(entry.role)}
            <div>
              <div className="font-medium text-gray-900">
                {entry.playerId?.name}
              </div>
              {entry.role && (
                <div className="text-sm text-gray-500">{entry.role}</div>
              )}
            </div>
          </div>
        </TableCell>

        <TableCell className="px-6 py-4">
          {getGenderBadge(entry.playerId?.gender || "other")}
        </TableCell>

        <TableCell className="px-6 py-4">
          <div className="text-sm text-gray-900">
            {entry.position || entry.playerId?.position || "N/A"}
          </div>
        </TableCell>

        <TableCell className="px-6 py-4">
          <div className="text-sm text-gray-900">
            {entry.playerId?.experience || "N/A"}
          </div>
        </TableCell>

        <TableCell className="px-6 py-4">
          <div className="text-sm text-gray-500 max-w-xs truncate">
            {entry.notes || "No notes"}
          </div>
        </TableCell>

        <TableCell className="px-6 py-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleRemovePlayer(entry._id)}
            disabled={isRemoving}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
        </TableCell>
      </TableRow>
    );
  }
);

RosterRow.displayName = "RosterRow";

const RosterTable: React.FC<RosterTableProps> = ({
  roster,
  removeLoadingId,
  handleRemovePlayer,
}) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5 text-blue-600" />
        Tournament Roster ({roster.length} players)
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3">Player</TableHead>
              <TableHead className="px-6 py-3">Gender</TableHead>
              <TableHead className="px-6 py-3">Position</TableHead>
              <TableHead className="px-6 py-3">Experience</TableHead>
              <TableHead className="px-6 py-3">Notes</TableHead>
              <TableHead className="px-6 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roster.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No players in roster yet. Add players using the form below.
                </TableCell>
              </TableRow>
            ) : (
              roster.map((entry) => (
                <RosterRow
                  key={entry._id}
                  entry={entry}
                  removeLoadingId={removeLoadingId}
                  handleRemovePlayer={handleRemovePlayer}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

export default RosterTable;
