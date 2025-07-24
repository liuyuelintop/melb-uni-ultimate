import { ChevronDown } from "lucide-react";
import type { Tournament } from "@/types/roster";

interface TournamentSelectorProps {
  tournaments: Tournament[];
  selectedTournamentId: string;
  setSelectedTournamentId: (id: string) => void;
  teams: string[];
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
}

export function TournamentSelector({
  tournaments,
  selectedTournamentId,
  setSelectedTournamentId,
  teams,
  selectedTeam,
  setSelectedTeam,
}: TournamentSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Tournament
        </label>
        <div className="relative">
          <select
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
            value={selectedTournamentId}
            onChange={(e) => setSelectedTournamentId(e.target.value)}
          >
            <option value="" disabled>
              -- Choose a tournament --
            </option>
            {tournaments.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.year})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      {teams.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Team
          </label>
          <div className="relative">
            <select
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
}
