import React from "react";
import { Users, UserCheck, UserX, Trophy } from "lucide-react";
import { RosterEntry } from "@/types/roster";
import StatCard from "@/components/ui/StatCard";

interface TournamentStatsProps {
  roster: RosterEntry[];
  tournamentName?: string;
}

const TournamentStats: React.FC<TournamentStatsProps> = ({
  roster,
  tournamentName,
}) => {
  const totalPlayers = roster.length;
  const malePlayers = roster.filter(
    (entry) => entry.playerId?.gender?.toLowerCase() === "male"
  ).length;
  const femalePlayers = roster.filter(
    (entry) => entry.playerId?.gender?.toLowerCase() === "female"
  ).length;
  const otherPlayers = totalPlayers - malePlayers - femalePlayers;

  const captains = roster.filter((entry) =>
    entry.role?.toLowerCase().includes("captain")
  ).length;

  const coaches = roster.filter((entry) =>
    entry.role?.toLowerCase().includes("coach")
  ).length;

  const stats = [
    {
      label: "Total Players",
      value: totalPlayers,
      colorClass: "text-blue-600",
      description: "Players in roster",
    },
    {
      label: "Male Players",
      value: malePlayers,
      colorClass: "text-blue-600",
      description: "Male players",
    },
    {
      label: "Female Players",
      value: femalePlayers,
      colorClass: "text-pink-600",
      description: "Female players",
    },
    {
      label: "Leadership",
      value: captains + coaches,
      colorClass: "text-yellow-600",
      description: "Captains & Coaches",
    },
  ];

  return (
    <div className="mb-6">
      {tournamentName && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {tournamentName} - Roster Statistics
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value.toString()}
            colorClass={stat.colorClass}
            description={stat.description}
          />
        ))}
      </div>
    </div>
  );
};

export default TournamentStats;
