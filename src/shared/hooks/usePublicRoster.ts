import { useState, useEffect } from "react";
import type { RosterEntry } from "@shared/types/roster";
import { useBaseRoster } from "./useBaseRoster";

export function usePublicRoster() {
  const baseRoster = useBaseRoster();
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Extract teams from roster when it changes
  useEffect(() => {
    if (baseRoster.roster.length > 0) {
      setTeams(
        Array.from(
          new Set(
            baseRoster.roster
              .map((entry: RosterEntry) => entry.teamId?.name)
              .filter((name: string | undefined): name is string => !!name)
          )
        )
      );
      setSelectedTeam("");
    } else {
      setTeams([]);
      setSelectedTeam("");
    }
  }, [baseRoster.roster]);

  const filteredRoster = baseRoster.roster
    .filter((entry) => !selectedTeam || entry.teamId?.name === selectedTeam)
    .filter(
      (entry) =>
        !searchTerm ||
        entry.playerId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return {
    // Base roster data
    tournaments: baseRoster.tournaments,
    selectedTournamentId: baseRoster.selectedTournamentId,
    setSelectedTournamentId: baseRoster.setSelectedTournamentId,
    roster: baseRoster.roster,
    loading: baseRoster.loading,
    // Public-specific data
    teams,
    selectedTeam,
    setSelectedTeam,
    searchTerm,
    setSearchTerm,
    filteredRoster,
  };
}
