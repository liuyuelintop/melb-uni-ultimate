import React from "react";
import { UserPlus, Crown, Shield, User } from "lucide-react";
import { Player } from "@/types/roster";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import PlayerCombobox from "./PlayerCombobox";

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
  handleAddPlayer: (e: React.FormEvent) => Promise<void>;
}

const roleOptions = [
  { value: "", label: "-- Select Role --", icon: <User className="h-4 w-4" /> },
  { value: "player", label: "Player", icon: <User className="h-4 w-4" /> },
  { value: "captain", label: "Captain", icon: <Crown className="h-4 w-4" /> },
  {
    value: "player-coach",
    label: "Player-Coach",
    icon: <Shield className="h-4 w-4" />,
  },
];

const positionOptions = [
  { value: "", label: "-- Select Position --" },
  { value: "handler", label: "Handler" },
  { value: "cutter", label: "Cutter" },
  { value: "utility", label: "Utility" },
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
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddPlayer(e);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <UserPlus className="h-5 w-5" />
          Add Player to Roster
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Player Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Player
            </label>
            <PlayerCombobox
              players={availablePlayers}
              value={addPlayerId}
              onChange={setAddPlayerId}
              disabled={addLoading}
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={addRole}
              onChange={(e) => setAddRole(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Position Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Position
            </label>
            <select
              value={addPosition}
              onChange={(e) => setAddPosition(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              {positionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={addNotes}
              onChange={(e) => setAddNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={!addPlayerId || addLoading}
              className="w-full sm:w-auto"
            >
              {addLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Add Player
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPlayerToRosterForm;
