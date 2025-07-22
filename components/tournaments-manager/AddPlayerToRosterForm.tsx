import React from "react";

interface Player {
  _id: string;
  name: string;
  gender: string;
}

interface AddPlayerToRosterFormProps {
  availablePlayers: Player[];
  addPlayerId: string;
  setAddPlayerId: (id: string) => void;
  addRole: string;
  setAddRole: (role: string) => void;
  addPosition: string;
  setAddPosition: (position: string) => void;
  addNotes: string;
  setAddNotes: (notes: string) => void;
  addLoading: boolean;
  handleAddPlayer: (e: React.FormEvent) => void;
}

const AddPlayerToRosterForm: React.FC<AddPlayerToRosterFormProps> = ({
  availablePlayers,
  addPlayerId,
  setAddPlayerId,
  addRole,
  setAddRole,
  addPosition,
  setAddPosition,
  addNotes,
  setAddNotes,
  addLoading,
  handleAddPlayer,
}) => (
  <form
    className="mt-6 flex flex-wrap gap-2 items-end border p-4 rounded"
    onSubmit={handleAddPlayer}
  >
    <div>
      <label className="block text-sm font-medium mb-1">Player</label>
      <select
        className="border rounded px-2 py-1"
        value={addPlayerId}
        onChange={(e) => setAddPlayerId(e.target.value)}
        required
      >
        <option value="">-- Select player --</option>
        {availablePlayers.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name} ({p.gender})
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Role</label>
      <input
        className="border rounded px-2 py-1"
        value={addRole}
        onChange={(e) => setAddRole(e.target.value)}
        placeholder="e.g. Captain"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Position</label>
      <input
        className="border rounded px-2 py-1"
        value={addPosition}
        onChange={(e) => setAddPosition(e.target.value)}
        placeholder="e.g. Handler"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Notes</label>
      <input
        className="border rounded px-2 py-1"
        value={addNotes}
        onChange={(e) => setAddNotes(e.target.value)}
        placeholder=""
      />
    </div>
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      disabled={addLoading || !addPlayerId}
    >
      {addLoading ? "Adding..." : "Add Player"}
    </button>
  </form>
);

export default AddPlayerToRosterForm;
