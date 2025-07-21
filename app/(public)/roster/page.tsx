"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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

export default function PublicRosterPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch tournaments on mount
  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then(async (data) => {
        setTournaments(data);
        // Try to find the first tournament with a non-empty roster
        for (const t of data) {
          const res = await fetch(`/api/roster?tournamentId=${t._id}`);
          const roster = await res.json();
          if (Array.isArray(roster) && roster.length > 0) {
            setSelectedTournamentId(t._id);
            return;
          }
        }
        // If all are empty, select the first tournament (if any)
        if (data.length > 0) {
          setSelectedTournamentId(data[0]._id);
        }
      });
  }, []);

  // Fetch roster when tournament changes
  useEffect(() => {
    if (selectedTournamentId) {
      setLoading(true);
      fetch(`/api/roster?tournamentId=${selectedTournamentId}`)
        .then((res) => res.json())
        .then((data) => setRoster(data))
        .finally(() => setLoading(false));
    } else {
      setRoster([]);
    }
  }, [selectedTournamentId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tournament Roster</h1>
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Tournament:</label>
        <select
          className="border rounded px-3 py-2"
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
      </div>
      {selectedTournamentId ? (
        loading ? (
          <div>Loading roster...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roster.map((entry) => (
                    <tr key={entry._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.playerId?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.playerId?.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.position || entry.playerId?.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.role || "player"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {roster.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No players found for this tournament.
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          Please select a tournament to view its roster.
        </div>
      )}
    </div>
  );
}
