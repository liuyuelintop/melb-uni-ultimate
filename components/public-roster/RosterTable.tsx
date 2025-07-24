import { Users } from "lucide-react";
import type { RosterEntry } from "@/types/roster";

function getGenderBadge(gender: string) {
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
}

function getRoleBadge(role: string) {
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
}

function getPositionIcon(position: string) {
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
}

export function RosterTable({
  filteredRoster,
  searchTerm,
}: {
  filteredRoster: RosterEntry[];
  searchTerm: string;
}) {
  return (
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
            {filteredRoster.map((entry) => {
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
  );
}
