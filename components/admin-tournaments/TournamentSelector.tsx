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
}) => {
  const selectedTournament = tournaments.find(
    (t) => t._id === selectedTournamentId
  );

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Select Tournament
          </h2>
        </div>

        <div className="space-y-3">
          {tournaments.map((tournament) => (
            <button
              key={tournament._id}
              onClick={() => setSelectedTournamentId(tournament._id)}
              className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedTournamentId === tournament._id
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate">
                    {tournament.name}
                  </h3>
                  {tournament.startDate && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {new Date(tournament.startDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {selectedTournamentId === tournament._id && (
                  <div className="ml-3 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {tournaments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm sm:text-base">No tournaments available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentSelector;
