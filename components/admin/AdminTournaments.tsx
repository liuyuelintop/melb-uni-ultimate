import { useEffect, useState } from "react";
import TournamentSelector from "@/components/tournaments-manager/TournamentSelector";
import RosterTable from "@/components/tournaments-manager/RosterTable";
import AddPlayerToRosterForm from "@/components/tournaments-manager/AddPlayerToRosterForm";

interface Tournament {
  _id: string;
  name: string;
  year: number;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface Player {
  _id: string;
  name: string;
  gender: string;
  position: string;
  experience: string;
}

interface RosterEntry {
  _id: string;
  playerId: Player;
  tournamentId: Tournament;
  role?: string;
  position?: string;
  notes?: string;
}

export default function AdminTournaments() {
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

  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then((data) => setTournaments(data));
  }, []);

  useEffect(() => {
    if (selectedTournamentId) {
      setLoading(true);
      fetch(`/api/roster?tournamentId=${selectedTournamentId}`)
        .then((res) => res.json())
        .then((data) => setRoster(data))
        .finally(() => setLoading(false));
      fetch("/api/players")
        .then((res) => res.json())
        .then((data) => setAllPlayers(data));
    } else {
      setRoster([]);
      setAllPlayers([]);
    }
    setAddPlayerId("");
    setAddRole("");
    setAddPosition("");
    setAddNotes("");
  }, [selectedTournamentId]);

  const availablePlayers = allPlayers.filter(
    (p) => !roster.some((entry) => entry.playerId?._id === p._id)
  );

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPlayerId) return;
    setAddLoading(true);
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
    fetch(`/api/roster?tournamentId=${selectedTournamentId}`)
      .then((res) => res.json())
      .then((data) => setRoster(data));
    setAddPlayerId("");
    setAddRole("");
    setAddPosition("");
    setAddNotes("");
    setAddLoading(false);
  };

  const handleRemovePlayer = async (rosterEntryId: string) => {
    setRemoveLoadingId(rosterEntryId);
    await fetch(`/api/roster/${rosterEntryId}`, { method: "DELETE" });
    fetch(`/api/roster?tournamentId=${selectedTournamentId}`)
      .then((res) => res.json())
      .then((data) => setRoster(data));
    setRemoveLoadingId("");
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tournament Rosters (Admin)</h1>
      <TournamentSelector
        tournaments={tournaments}
        selectedTournamentId={selectedTournamentId}
        setSelectedTournamentId={setSelectedTournamentId}
      />
      {selectedTournamentId && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Roster</h2>
          <RosterTable
            roster={roster}
            removeLoadingId={removeLoadingId}
            handleRemovePlayer={handleRemovePlayer}
          />
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
    </div>
  );
}
