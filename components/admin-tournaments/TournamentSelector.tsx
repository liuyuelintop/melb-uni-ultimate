import React from "react";
import { Tournament } from "@/types/roster";
import { Card, CardContent } from "@/components/ui/Card";
import TournamentCombobox from "./TournamentCombobox";

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
  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Select Tournament
          </h2>
        </div>

        <div className="space-y-3">
          <TournamentCombobox
            tournaments={tournaments}
            value={selectedTournamentId}
            onChange={setSelectedTournamentId}
          />
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
