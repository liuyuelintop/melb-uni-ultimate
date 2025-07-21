import { useEffect, useState } from "react";

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

export default function TournamentsManager() {
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

      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Tournament:</label>
        <select
          className="border rounded px-3 py-2"
          value={selectedTournamentId}
          onChange={(e) => setSelectedTournamentId(e.target.value)}
        >
          <option disabled value="">
            -- Choose a tournament --
          </option>
          {tournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} ({t.year})
            </option>
          ))}
        </select>
      </div>

      {selectedTournamentId && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Roster</h2>
          {loading ? (
            <div>Loading roster...</div>
          ) : (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Gender</th>
                  <th className="border px-2 py-1">Position</th>
                  <th className="border px-2 py-1">Role</th>
                  <th className="border px-2 py-1">Notes</th>
                  <th className="border px-2 py-1">Remove</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((entry) => (
                  <tr key={entry._id}>
                    <td className="border px-2 py-1">{entry.playerId?.name}</td>
                    <td className="border px-2 py-1">
                      {entry.playerId?.gender}
                    </td>
                    <td className="border px-2 py-1">
                      {entry.position || entry.playerId?.position}
                    </td>
                    <td className="border px-2 py-1">
                      {entry.role || "player"}
                    </td>
                    <td className="border px-2 py-1">{entry.notes || ""}</td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        className="text-red-600 hover:underline disabled:opacity-50"
                        disabled={removeLoadingId === entry._id}
                        onClick={() => handleRemovePlayer(entry._id)}
                      >
                        {removeLoadingId === entry._id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Add Player Form */}
          <form
            className="mt-6 flex flex-wrap gap-2 items-end border p-4 rounded"
            onSubmit={handleAddPlayer}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Player</label>
              <select
                className="border rounded px-2 py-1"
                value={addPlayerId}
                onChange={(e) => setAddPlayerId(e.target.value)}
                required
              >
                <option value="">-- Select player --</option>
                {availablePlayers.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.gender})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                className="border rounded px-2 py-1"
                value={addRole}
                onChange={(e) => setAddRole(e.target.value)}
                placeholder="e.g. Captain"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <input
                className="border rounded px-2 py-1"
                value={addPosition}
                onChange={(e) => setAddPosition(e.target.value)}
                placeholder="e.g. Handler"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <input
                className="border rounded px-2 py-1"
                value={addNotes}
                onChange={(e) => setAddNotes(e.target.value)}
                placeholder=""
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={addLoading || !addPlayerId}
            >
              {addLoading ? "Adding..." : "Add Player"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
