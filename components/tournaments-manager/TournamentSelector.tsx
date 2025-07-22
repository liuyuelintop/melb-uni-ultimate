import React from "react";

interface Tournament {
  _id: string;
  name: string;
  year: number;
}

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
  <div className="mb-6">
    <label className="block mb-2 font-medium">Select Tournament:</label>
    <select
      className="border rounded px-3 py-2"
      value={selectedTournamentId}
      onChange={(e) => setSelectedTournamentId(e.target.value)}
    >
      <option disabled value="">
        -- Choose a tournament --
      </option>
      {tournaments.map((t) => (
        <option key={t._id} value={t._id}>
          {t.name} ({t.year})
        </option>
      ))}
    </select>
  </div>
);

export default TournamentSelector;
