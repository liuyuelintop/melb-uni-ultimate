import { Users } from "lucide-react";
import type { RosterEntry } from "@shared/types/roster";

interface RosterStatsBarProps {
  filteredRoster: RosterEntry[];
}

export function RosterStatsBar({ filteredRoster }: RosterStatsBarProps) {
  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span className="text-gray-600">
          <span className="font-medium text-gray-900">
            {filteredRoster.filter((e) => e.playerId?.gender === "male").length}
          </span>{" "}
          Male
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
        <span className="text-gray-600">
          <span className="font-medium text-gray-900">
            {
              filteredRoster.filter((e) => e.playerId?.gender === "female")
                .length
            }
          </span>{" "}
          Female
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600">
          <span className="font-medium text-gray-900">
            {filteredRoster.length}
          </span>{" "}
          Total
        </span>
      </div>
    </div>
  );
}
