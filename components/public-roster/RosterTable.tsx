import { Users } from "lucide-react";
import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RosterEntry } from "@/types/roster";

// Configuration objects for badges and icons
const genderBadgeConfig = {
  male: {
    label: "MMP",
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  female: {
    label: "FMP",
    className: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
  },
  default: {
    label: "Unknown",
    className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
  },
};

const roleBadgeConfig = {
  "player-coach": {
    label: "Coach",
    className:
      "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  },
  captain: {
    label: "Captain",
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  default: {
    label: "Player",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
};

const experienceConfig = {
  Expert: { color: "bg-green-500", label: "Expert" },
  Advanced: { color: "bg-blue-500", label: "Advanced" },
  Intermediate: { color: "bg-yellow-500", label: "Intermediate" },
  default: { color: "bg-red-500", label: "Beginner" },
};

const RosterRow = memo(({ entry }: { entry: RosterEntry }) => {
  const player = entry.playerId;
  const team = entry.teamId;

  const genderBadge =
    genderBadgeConfig[player?.gender as keyof typeof genderBadgeConfig] ||
    genderBadgeConfig.default;
  const roleBadge =
    roleBadgeConfig[entry.role as keyof typeof roleBadgeConfig] ||
    roleBadgeConfig.default;
  const experience =
    experienceConfig[player?.experience as keyof typeof experienceConfig] ||
    experienceConfig.default;

  return (
    <TableRow className="hover:bg-gray-50/50 border-b border-gray-100">
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
              {player?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">
              {player?.name || "Unknown"}
            </div>
            <div className="text-sm text-gray-500">
              Player #{player?.jerseyNumber || "N/A"}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="font-medium text-gray-700">
            {team?.name || "MUU"}
          </span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">{player?.position || "Unknown"}</span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <Badge
          variant="outline"
          className={`${genderBadge.className} text-xs font-medium`}
        >
          {genderBadge.label}
        </Badge>
      </TableCell>

      <TableCell className="py-4">
        <Badge
          variant="outline"
          className={`${roleBadge.className} text-xs font-medium`}
        >
          {roleBadge.label}
        </Badge>
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${experience.color}`} />
          <span className="text-gray-700">{experience.label}</span>
        </div>
      </TableCell>
    </TableRow>
  );
});

RosterRow.displayName = "RosterRow";

const EmptyState = memo(({ searchTerm }: { searchTerm: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Users className="h-12 w-12 text-gray-300 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
    <p className="text-gray-500 max-w-sm">
      {searchTerm
        ? "Try adjusting your search criteria to find more players."
        : "No players have been registered for this tournament yet."}
    </p>
  </div>
));

EmptyState.displayName = "EmptyState";

export const RosterTable = memo(
  ({
    filteredRoster,
    searchTerm,
  }: {
    filteredRoster: RosterEntry[];
    searchTerm: string;
  }) => {
    const isEmpty = filteredRoster.length === 0;

    const tableContent = useMemo(
      () => (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-100 hover:bg-gray-50">
              <TableHead className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                Player
              </TableHead>
              <TableHead className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                Team
              </TableHead>
              <TableHead className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                Position
              </TableHead>
              <TableHead className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                Gender
              </TableHead>
              <TableHead className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                Role
              </TableHead>
              <TableHead className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                Experience
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {filteredRoster.map((entry) => (
              <RosterRow key={entry._id} entry={entry} />
            ))}
          </TableBody>
        </Table>
      ),
      [filteredRoster]
    );

    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CardContent className="p-0">
          {isEmpty ? (
            <EmptyState searchTerm={searchTerm} />
          ) : (
            <div className="overflow-x-auto">{tableContent}</div>
          )}
        </CardContent>
      </Card>
    );
  }
);

RosterTable.displayName = "RosterTable";
