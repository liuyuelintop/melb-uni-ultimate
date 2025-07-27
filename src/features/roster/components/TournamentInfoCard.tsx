import type { Tournament } from "@shared/types/roster";

export function TournamentInfoCard({ tournament }: { tournament: Tournament }) {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="font-medium text-blue-900">Type:</span>
          <span className="text-blue-700">{tournament.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-blue-900">Location:</span>
          <span className="text-blue-700">{tournament.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-blue-900">Dates:</span>
          <span className="text-blue-700">
            {new Date(tournament.startDate).toLocaleDateString()} -{" "}
            {new Date(tournament.endDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
