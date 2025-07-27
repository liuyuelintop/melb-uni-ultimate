import { useState, useEffect } from "react";
import { Player } from "@shared/types/roster";
import { useBaseRoster } from "./useBaseRoster";

interface UseTournamentRosterReturn {
  // Base roster data
  tournaments: ReturnType<typeof useBaseRoster>["tournaments"];
  selectedTournamentId: ReturnType<
    typeof useBaseRoster
  >["selectedTournamentId"];
  setSelectedTournamentId: ReturnType<
    typeof useBaseRoster
  >["setSelectedTournamentId"];
  roster: ReturnType<typeof useBaseRoster>["roster"];
  loading: ReturnType<typeof useBaseRoster>["loading"];
  // Admin-specific data
  allPlayers: Player[];
  availablePlayers: Player[];
  addPlayerId: string;
  setAddPlayerId: (id: string) => void;
  addRole: string;
  setAddRole: (role: string) => void;
  addPosition: string;
  setAddPosition: (position: string) => void;
  addNotes: string;
  setAddNotes: (notes: string) => void;
  addLoading: boolean;
  removeLoadingId: string;
  handleAddPlayer: (e: React.FormEvent) => Promise<void>;
  handleRemovePlayer: (rosterEntryId: string) => Promise<void>;
  resetForm: () => void;
}

export const useTournamentRoster = (): UseTournamentRosterReturn => {
  const baseRoster = useBaseRoster();
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [addPlayerId, setAddPlayerId] = useState<string>("");
  const [addRole, setAddRole] = useState<string>("");
  const [addPosition, setAddPosition] = useState<string>("");
  const [addNotes, setAddNotes] = useState<string>("");
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoadingId, setRemoveLoadingId] = useState<string>("");

  // Fetch all players when tournament changes
  useEffect(() => {
    if (baseRoster.selectedTournamentId) {
      fetch("/api/players")
        .then((res) => res.json())
        .then((data) => setAllPlayers(data))
        .catch((error) => console.error("Error fetching players:", error));
    } else {
      setAllPlayers([]);
    }
    resetForm();
  }, [baseRoster.selectedTournamentId]);

  // Calculate available players (players not in current roster)
  const availablePlayers = allPlayers.filter(
    (player) =>
      !baseRoster.roster.some((entry) => entry.playerId?._id === player._id)
  );

  const resetForm = () => {
    setAddPlayerId("");
    setAddRole("");
    setAddPosition("");
    setAddNotes("");
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPlayerId) return;

    setAddLoading(true);
    try {
      await fetch("/api/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentId: baseRoster.selectedTournamentId,
          playerId: addPlayerId,
          role: addRole,
          position: addPosition,
          notes: addNotes,
        }),
      });

      // Refresh roster by triggering a re-fetch
      baseRoster.setSelectedTournamentId(baseRoster.selectedTournamentId);
      resetForm();
    } catch (error) {
      console.error("Error adding player to roster:", error);
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemovePlayer = async (rosterEntryId: string) => {
    setRemoveLoadingId(rosterEntryId);
    try {
      await fetch(`/api/roster/${rosterEntryId}`, { method: "DELETE" });

      // Refresh roster by triggering a re-fetch
      baseRoster.setSelectedTournamentId(baseRoster.selectedTournamentId);
    } catch (error) {
      console.error("Error removing player from roster:", error);
    } finally {
      setRemoveLoadingId("");
    }
  };

  return {
    // Base roster data
    tournaments: baseRoster.tournaments,
    selectedTournamentId: baseRoster.selectedTournamentId,
    setSelectedTournamentId: baseRoster.setSelectedTournamentId,
    roster: baseRoster.roster,
    loading: baseRoster.loading,
    // Admin-specific data
    allPlayers,
    availablePlayers,
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
    resetForm,
  };
};
