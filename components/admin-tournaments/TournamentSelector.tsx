import React from "react";
import { Trophy } from "lucide-react";
import { Tournament } from "@/types/roster";
import { Card, CardContent } from "@/components/ui/Card";

interface TournamentSelectorProps {
  tournaments: Tournament[];
  selectedTournamentId: string;
  setSelectedTournamentId: (id: string) => void;
}

const TournamentSelector: React.FC<TournamentSelectorProps> = ({
  tournaments,
  selectedTournamentId,
  setSelectedTournamentId,
}) => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Select Tournament
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedTournamentId}
          onChange={(e) => setSelectedTournamentId(e.target.value)}
        >
          <option value="">-- Choose a tournament --</option>
          {tournaments.map((tournament) => (
            <option key={tournament._id} value={tournament._id}>
              {tournament.name} ({tournament.year})
            </option>
          ))}
        </select>
      </div>
    </CardContent>
  </Card>
);

export default TournamentSelector;
