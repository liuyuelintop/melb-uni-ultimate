import type { RosterEntry } from "@shared/types/roster";

interface RosterFooterStatsProps {
  filteredRoster: RosterEntry[];
  teamsCount: number;
}

export function RosterFooterStats({
  filteredRoster,
  teamsCount,
}: RosterFooterStatsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <div className="text-2xl font-bold text-blue-600">
          {filteredRoster.length}
        </div>
        <div className="text-sm text-gray-600">Total Players</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <div className="text-2xl font-bold text-green-600">{teamsCount}</div>
        <div className="text-sm text-gray-600">Teams</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <div className="text-2xl font-bold text-purple-600">
          {filteredRoster.filter((e) => e.role === "player-coach").length}
        </div>
        <div className="text-sm text-gray-600">Coaches</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <div className="text-2xl font-bold text-amber-600">
          {
            filteredRoster.filter((e) => e.playerId?.experience === "Expert")
              .length
          }
        </div>
        <div className="text-sm text-gray-600">Expert Players</div>
      </div>
    </div>
  );
}
