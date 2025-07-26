import React from "react";
import { UserPlus, Crown, Shield, User } from "lucide-react";
import { Player } from "@/types/roster";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

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

const roleOptions = [
  { value: "", label: "Player", icon: <User className="h-4 w-4" /> },
  { value: "player", label: "Player", icon: <User className="h-4 w-4" /> },
  { value: "captain", label: "Captain", icon: <Crown className="h-4 w-4" /> },
  {
    value: "player-coach",
    label: "Player-Coach",
    icon: <Shield className="h-4 w-4" />,
  },
];

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
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-blue-600" />
        Add Player to Roster
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleAddPlayer} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Player Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Player *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={addPlayerId}
              onChange={(e) => setAddPlayerId(e.target.value)}
              required
            >
              <option value="">-- Select player --</option>
              {availablePlayers.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.name} ({player.gender})
                </option>
              ))}
            </select>
            {availablePlayers.length === 0 && (
              <p className="text-sm text-gray-500">
                No available players to add
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={addRole}
              onChange={(e) => setAddRole(e.target.value)}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Position
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={addPosition}
              onChange={(e) => setAddPosition(e.target.value)}
            >
              <option value="">-- Select position --</option>
              <option value="handler">Handler</option>
              <option value="cutter">Cutter</option>
              <option value="utility">Utility</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={addNotes}
              onChange={(e) => setAddNotes(e.target.value)}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              addLoading || !addPlayerId || availablePlayers.length === 0
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Player
              </div>
            )}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
);

export default AddPlayerToRosterForm;
