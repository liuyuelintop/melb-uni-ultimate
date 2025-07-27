import React from "react";
import { ChevronDown, Trophy, Users } from "lucide-react";
import type { Tournament } from "@shared/types/roster";

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
  const selectedTournament = tournaments.find(
    (t) => t._id === selectedTournamentId
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tournament Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Trophy className="w-4 h-4 text-amber-600" />
            Select Tournament
          </label>
          <div className="relative">
            <select
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none hover:border-gray-400 shadow-sm"
              value={selectedTournamentId}
              onChange={(e) => setSelectedTournamentId(e.target.value)}
            >
              <option value="" disabled className="text-gray-500">
                Choose a tournament...
              </option>
              {tournaments.map((t) => (
                <option key={t._id} value={t._id} className="py-2">
                  {t.name} ({t.year})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200" />
          </div>
          {selectedTournament && (
            <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="text-sm">
                <div className="font-medium text-blue-900">
                  {selectedTournament.name}
                </div>
                <div className="text-blue-700 mt-1">
                  Year: {selectedTournament.year}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Team Filter */}
        {teams.length > 1 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Users className="w-4 h-4 text-green-600" />
              Filter by Team
              <span className="text-xs font-normal text-gray-500">
                ({teams.length} teams)
              </span>
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none hover:border-gray-400 shadow-sm"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="" className="py-2">
                  All Teams
                </option>
                {teams.map((team) => (
                  <option key={team} value={team} className="py-2">
                    {team}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200" />
            </div>
            {selectedTeam && (
              <div className="mt-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-sm">
                  <div className="font-medium text-green-900">
                    Filtered Team
                  </div>
                  <div className="text-green-700 mt-1">{selectedTeam}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedTournamentId && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Current Selection:</span>
            <div className="flex items-center gap-4">
              <span className="font-medium">
                {selectedTournament?.name} ({selectedTournament?.year})
              </span>
              {selectedTeam && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium">{selectedTeam}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
