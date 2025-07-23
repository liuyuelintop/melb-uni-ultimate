import React from "react";

interface Player {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  gender: "male" | "female" | "other";
  position: "handler" | "cutter" | "utility";
  experience: "beginner" | "intermediate" | "advanced" | "expert";
  jerseyNumber: number;
  phoneNumber?: string;
  graduationYear: number;
  isActive: boolean;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
  affiliation?: string;
}

interface PlayerTableProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  onEdit,
  onDelete,
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Player
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gender
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {players.map((player) => (
            <tr key={player._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-800">
                        {player.jerseyNumber}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {player.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {player.studentId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {player.gender
                    ? player.gender.charAt(0).toUpperCase() +
                      player.gender.slice(1)
                    : "Not specified"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{player.email}</div>
                {player.phoneNumber && (
                  <div className="text-sm text-gray-500">
                    {player.phoneNumber}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {player.position.charAt(0).toUpperCase() +
                    player.position.slice(1)}
                </div>
                <div className="text-sm text-gray-500">
                  {player.experience.charAt(0).toUpperCase() +
                    player.experience.slice(1)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    player.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {player.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(player)}
                    className="text-sm px-3 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(player._id)}
                    className="text-sm px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PlayerTable;
