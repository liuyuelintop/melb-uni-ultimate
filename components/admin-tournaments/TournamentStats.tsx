import React from "react";
import { Users, UserCheck, UserX, Trophy } from "lucide-react";
import { RosterEntry } from "@/types/roster";
import StatCard from "@/components/ui/StatCard";

interface TournamentStatsProps {
  roster: RosterEntry[];
  tournamentName: string;
}

const TournamentStats: React.FC<TournamentStatsProps> = ({
  roster,
  tournamentName,
}) => {
  const totalPlayers = roster.length;
  const malePlayers = roster.filter(
    (entry) => entry.playerId?.gender === "male"
  ).length;
  const femalePlayers = roster.filter(
    (entry) => entry.playerId?.gender === "female"
  ).length;
  const captains = roster.filter((entry) => entry.role === "captain").length;
  const coaches = roster.filter(
    (entry) => entry.role === "player-coach"
  ).length;

  const stats = [
    {
      label: "Total Players",
      value: totalPlayers.toString(),
      colorClass: "text-blue-600",
      description: "Roster size",
    },
    {
      label: "Male Players",
      value: malePlayers.toString(),
      colorClass: "text-green-600",
      description: "Male members",
    },
    {
      label: "Female Players",
      value: femalePlayers.toString(),
      colorClass: "text-purple-600",
      description: "Female members",
    },
    {
      label: "Leadership",
      value: (captains + coaches).toString(),
      colorClass: "text-yellow-600",
      description: "Captains & Coaches",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {tournamentName} - Roster Statistics
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            colorClass={stat.colorClass}
            description={stat.description}
          />
        ))}
      </div>
    </div>
  );
};

export default TournamentStats;
