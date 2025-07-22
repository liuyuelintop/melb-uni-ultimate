import React from "react";

interface Player {
  _id: string;
  name: string;
  gender: string;
  position: string;
  experience: string;
}

interface RosterEntry {
  _id: string;
  playerId: Player;
  role?: string;
  position?: string;
  notes?: string;
}

interface RosterTableProps {
  roster: RosterEntry[];
  removeLoadingId: string;
  handleRemovePlayer: (rosterEntryId: string) => void;
}

const RosterTable: React.FC<RosterTableProps> = ({
  roster,
  removeLoadingId,
  handleRemovePlayer,
}) => (
  <table className="min-w-full border">
    <thead>
      <tr>
        <th className="border px-2 py-1">Name</th>
        <th className="border px-2 py-1">Gender</th>
        <th className="border px-2 py-1">Position</th>
        <th className="border px-2 py-1">Role</th>
        <th className="border px-2 py-1">Notes</th>
        <th className="border px-2 py-1">Remove</th>
      </tr>
    </thead>
    <tbody>
      {roster.map((entry) => (
        <tr key={entry._id}>
          <td className="border px-2 py-1">{entry.playerId?.name}</td>
          <td className="border px-2 py-1">{entry.playerId?.gender}</td>
          <td className="border px-2 py-1">
            {entry.position || entry.playerId?.position}
          </td>
          <td className="border px-2 py-1">{entry.role || "player"}</td>
          <td className="border px-2 py-1">{entry.notes || ""}</td>
          <td className="border px-2 py-1 text-center">
            <button
              className="text-red-600 hover:underline disabled:opacity-50"
              disabled={removeLoadingId === entry._id}
              onClick={() => handleRemovePlayer(entry._id)}
            >
              {removeLoadingId === entry._id ? "Removing..." : "Remove"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default RosterTable;
