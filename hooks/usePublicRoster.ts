import { useState, useEffect } from "react";
import type { Tournament, RosterEntry } from "@/types/roster";

export function usePublicRoster() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
        .then((data) => {
          setRoster(data);
          setTeams(
            Array.from(
              new Set(
                data
                  .map((entry: RosterEntry) => entry.teamId?.name)
                  .filter((name: string | undefined): name is string => !!name)
              )
            )
          );
          setSelectedTeam("");
        })
        .finally(() => setLoading(false));
    } else {
      setRoster([]);
      setTeams([]);
      setSelectedTeam("");
    }
  }, [selectedTournamentId]);

  const filteredRoster = roster
    .filter((entry) => !selectedTeam || entry.teamId?.name === selectedTeam)
    .filter(
      (entry) =>
        !searchTerm ||
        entry.playerId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return {
    tournaments,
    selectedTournamentId,
    setSelectedTournamentId,
    roster,
    teams,
    selectedTeam,
    setSelectedTeam,
    searchTerm,
    setSearchTerm,
    loading,
    filteredRoster,
  };
}
