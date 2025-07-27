import { useState, useEffect } from "react";
import { Tournament, RosterEntry } from "@shared/types/roster";

interface UseBaseRosterReturn {
  tournaments: Tournament[];
  selectedTournamentId: string;
  setSelectedTournamentId: (id: string) => void;
  roster: RosterEntry[];
  loading: boolean;
}

export const useBaseRoster = (): UseBaseRosterReturn => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch tournaments on mount
  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .catch((error) => console.error("Error fetching tournaments:", error));
  }, []);

  // Fetch roster when tournament changes
  useEffect(() => {
    if (selectedTournamentId) {
      setLoading(true);
      fetch(`/api/roster?tournamentId=${selectedTournamentId}`)
        .then((res) => res.json())
        .then((data) => setRoster(data))
        .catch((error) => console.error("Error fetching roster:", error))
        .finally(() => setLoading(false));
    } else {
      setRoster([]);
    }
  }, [selectedTournamentId]);

  return {
    tournaments,
    selectedTournamentId,
    setSelectedTournamentId,
    roster,
    loading,
  };
};
