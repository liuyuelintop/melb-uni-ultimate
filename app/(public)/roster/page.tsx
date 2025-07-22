"use client";

import { useState, useEffect } from "react";
import { Search, Users, ChevronDown } from "lucide-react";

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
  jerseyNumber: number;
}

interface RosterEntry {
  _id: string;
  playerId: Player;
  tournamentId: Tournament;
  teamId?: { name: string };
  role?: string;
  position?: string;
  notes?: string;
}

export default function PublicRosterPage() {
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

  const getGenderBadge = (gender: string) => {
    if (gender === "male") {
      return {
        label: "MMP",
        className: "bg-blue-50 text-blue-700 border border-blue-200",
      };
    } else if (gender === "female") {
      return {
        label: "FMP",
        className: "bg-pink-50 text-pink-700 border border-pink-200",
      };
    }
    return {
      label: "Unknown",
      className: "bg-gray-50 text-gray-700 border border-gray-200",
    };
  };

  const getRoleBadge = (role: string) => {
    if (role === "player-coach") {
      return {
        label: "Coach",
        className: "bg-purple-50 text-purple-700 border border-purple-200",
      };
    } else if (role === "captain") {
      return {
        label: "Captain",
        className: "bg-amber-50 text-amber-700 border border-amber-200",
      };
    }
    return {
      label: "Player",
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    };
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "Handler":
        return "🎯";
      case "Cutter":
        return "⚡";
      case "Any":
        return "🌟";
      default:
        return "👤";
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Tournament
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
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
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {teams.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Team
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                  >
                    <option value="">All Teams</option>
                    {teams.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Tournament Info */}
          {selectedTournament && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-blue-900">Type:</span>
                  <span className="text-blue-700">
                    {selectedTournament.type}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-blue-900">Location:</span>
                  <span className="text-blue-700">
                    {selectedTournament.location}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-blue-900">Dates:</span>
                  <span className="text-blue-700">
                    {new Date(
                      selectedTournament.startDate
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(selectedTournament.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search players..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    {
                      filteredRoster.filter(
                        (e) => e.playerId?.gender === "male"
                      ).length
                    }
                  </span>{" "}
                  Male
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    {
                      filteredRoster.filter(
                        (e) => e.playerId?.gender === "female"
                      ).length
                    }
                  </span>{" "}
                  Female
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    {filteredRoster.length}
                  </span>{" "}
                  Total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Roster Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                    Player
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                    Team
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                    Position
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                    Gender
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                    Experience
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRoster.map((entry, index) => {
                  const genderBadge = getGenderBadge(entry.playerId?.gender);
                  const roleBadge = getRoleBadge(entry.role || "player");
                  return (
                    <tr
                      key={entry._id}
                      className="hover:bg-gray-25 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {entry.playerId?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {entry.playerId?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Player #{entry.playerId?.jerseyNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-700">
                            {entry.teamId?.name || "MUU"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getPositionIcon(entry.playerId?.position)}
                          </span>
                          <span className="text-gray-700">
                            {entry.playerId?.position || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${genderBadge.className}`}
                        >
                          {genderBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleBadge.className}`}
                        >
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              entry.playerId?.experience === "Expert"
                                ? "bg-green-500"
                                : entry.playerId?.experience === "Advanced"
                                ? "bg-blue-500"
                                : entry.playerId?.experience === "Intermediate"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-gray-700">
                            {entry.playerId?.experience || "Unknown"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredRoster.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No players found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "No players registered for this tournament."}
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">
              {filteredRoster.length}
            </div>
            <div className="text-sm text-gray-600">Total Players</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-2xl font-bold text-green-600">
              {teams.length}
            </div>
            <div className="text-sm text-gray-600">Teams</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">
              {filteredRoster.filter((e) => e.role === "player-coach").length}
            </div>
            <div className="text-sm text-gray-600">Coaches</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="text-2xl font-bold text-amber-600">
              {
                filteredRoster.filter(
                  (e) => e.playerId?.experience === "Expert"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Expert Players</div>
          </div>
        </div>
      </div>
    </div>
  );
}
