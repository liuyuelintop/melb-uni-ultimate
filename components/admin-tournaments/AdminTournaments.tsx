import React from "react";
import { Trophy, Users } from "lucide-react";
import { useTournamentRoster } from "@/hooks/useTournamentRoster";
import TournamentSelector from "./TournamentSelector";
import TournamentStats from "./TournamentStats";
import RosterTable from "./RosterTable";
import AddPlayerToRosterForm from "./AddPlayerToRosterForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const AdminTournaments: React.FC = () => {
  const {
    tournaments,
    selectedTournamentId,
    setSelectedTournamentId,
    roster,
    availablePlayers,
    loading,
    addPlayerId,
    setAddPlayerId,
    addRole,
    setAddRole,
    addPosition,
    setAddPosition,
    addNotes,
    setAddNotes,
    addLoading,
    removeLoadingId,
    handleAddPlayer,
    handleRemovePlayer,
  } = useTournamentRoster();

  const selectedTournament = tournaments.find(
    (t) => t._id === selectedTournamentId
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Tournament Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage tournament rosters and player assignments
          </p>
        </div>
      </div>

      {/* Tournament Selector */}
      <TournamentSelector
        tournaments={tournaments}
        selectedTournamentId={selectedTournamentId}
        setSelectedTournamentId={setSelectedTournamentId}
      />

      {/* Tournament Content */}
      {selectedTournamentId && selectedTournament && (
        <div className="space-y-6 sm:space-y-8">
          {/* Tournament Stats */}
          <TournamentStats
            roster={roster}
            tournamentName={selectedTournament.name}
          />

          {/* Roster Table */}
          <RosterTable
            roster={roster}
            removeLoadingId={removeLoadingId}
            handleRemovePlayer={handleRemovePlayer}
          />

          {/* Add Player Form */}
          <AddPlayerToRosterForm
            availablePlayers={availablePlayers}
            addPlayerId={addPlayerId}
            setAddPlayerId={setAddPlayerId}
            addRole={addRole}
            setAddRole={setAddRole}
            addPosition={addPosition}
            setAddPosition={setAddPosition}
            addNotes={addNotes}
            setAddNotes={setAddNotes}
            addLoading={addLoading}
            handleAddPlayer={handleAddPlayer}
          />
        </div>
      )}

      {/* Empty State */}
      {!selectedTournamentId && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Tournament Selected
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            Select a tournament from the dropdown above to manage its roster.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminTournaments;
