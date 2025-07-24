"use client";

import { Users } from "lucide-react";
import { usePublicRoster } from "@/hooks/usePublicRoster";
import { TournamentSelector } from "@/components/roster/TournamentSelector";
import { TournamentInfoCard } from "@/components/roster/TournamentInfoCard";
import { RosterSearchBar } from "@/components/roster/RosterSearchBar";
import { RosterStatsBar } from "@/components/roster/RosterStatsBar";
import { RosterTable } from "@/components/roster/RosterTable";
import { RosterFooterStats } from "@/components/roster/RosterFooterStats";

export default function PublicRosterPage() {
  const {
    tournaments,
    selectedTournamentId,
    setSelectedTournamentId,
    teams,
    selectedTeam,
    setSelectedTeam,
    searchTerm,
    setSearchTerm,
    loading,
    filteredRoster,
  } = usePublicRoster();

  const selectedTournament = tournaments.find(
    (t) => t._id === selectedTournamentId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tournament Roster
            </h1>
          </div>
          <p className="text-gray-600">
            Manage and view tournament team rosters
          </p>
        </div>

        {/* Tournament Selection Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tournament Selection
          </h2>
          <TournamentSelector
            tournaments={tournaments}
            selectedTournamentId={selectedTournamentId}
            setSelectedTournamentId={setSelectedTournamentId}
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
          />
          {selectedTournament && (
            <TournamentInfoCard tournament={selectedTournament} />
          )}
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <RosterSearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <RosterStatsBar filteredRoster={filteredRoster} />
          </div>
        </div>

        {/* Modern Roster Table */}
        <RosterTable filteredRoster={filteredRoster} searchTerm={searchTerm} />

        {/* Footer Stats */}
        <RosterFooterStats
          filteredRoster={filteredRoster}
          teamsCount={teams.length}
        />
      </div>
    </div>
  );
}
