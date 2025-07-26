import { useState, useEffect } from "react";
import { Tournament, Player, RosterEntry } from "@/types/roster";

interface UseTournamentRosterReturn {
  tournaments: Tournament[];
  selectedTournamentId: string;
  setSelectedTournamentId: (id: string) => void;
  roster: RosterEntry[];
  allPlayers: Player[];
  availablePlayers: Player[];
  loading: boolean;
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
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [addPlayerId, setAddPlayerId] = useState<string>("");
  const [addRole, setAddRole] = useState<string>("");
  const [addPosition, setAddPosition] = useState<string>("");
  const [addNotes, setAddNotes] = useState<string>("");
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoadingId, setRemoveLoadingId] = useState<string>("");

  // Fetch tournaments on mount
  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .catch((error) => console.error("Error fetching tournaments:", error));
  }, []);

  // Fetch roster and players when tournament changes
  useEffect(() => {
    if (selectedTournamentId) {
      setLoading(true);

      // Fetch roster for selected tournament
      fetch(`/api/roster?tournamentId=${selectedTournamentId}`)
        .then((res) => res.json())
        .then((data) => setRoster(data))
        .catch((error) => console.error("Error fetching roster:", error))
        .finally(() => setLoading(false));

      // Fetch all players
      fetch("/api/players")
        .then((res) => res.json())
        .then((data) => setAllPlayers(data))
        .catch((error) => console.error("Error fetching players:", error));
    } else {
      setRoster([]);
      setAllPlayers([]);
    }

    resetForm();
  }, [selectedTournamentId]);

  // Calculate available players (players not in current roster)
  const availablePlayers = allPlayers.filter(
    (player) => !roster.some((entry) => entry.playerId?._id === player._id)
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
          tournamentId: selectedTournamentId,
          playerId: addPlayerId,
          role: addRole,
          position: addPosition,
          notes: addNotes,
        }),
      });

      // Refresh roster
      const rosterRes = await fetch(
        `/api/roster?tournamentId=${selectedTournamentId}`
      );
      const rosterData = await rosterRes.json();
      setRoster(rosterData);

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

      // Refresh roster
      const rosterRes = await fetch(
        `/api/roster?tournamentId=${selectedTournamentId}`
      );
      const rosterData = await rosterRes.json();
      setRoster(rosterData);
    } catch (error) {
      console.error("Error removing player from roster:", error);
    } finally {
      setRemoveLoadingId("");
    }
  };

  return {
    tournaments,
    selectedTournamentId,
    setSelectedTournamentId,
    roster,
    allPlayers,
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
    resetForm,
  };
};
