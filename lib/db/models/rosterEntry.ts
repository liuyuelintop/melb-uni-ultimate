import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IRosterEntry extends Document {
  playerId: Types.ObjectId;
  tournamentId: Types.ObjectId;
  teamId?: Types.ObjectId;
  role?: string;
  position?: string;
  notes?: string;
}

const RosterEntrySchema = new Schema<IRosterEntry>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: [true, "Player ID is required"],
    },
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: [true, "Tournament ID is required"],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: false, // Optional for tournaments without teams
    },
    role: {
      type: String,
      enum: ["player", "captain", "player-coach"],
      required: false,
    },
    position: {
      type: String,
      enum: ["handler", "cutter", "any"],
      required: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

RosterEntrySchema.index(
  { tournamentId: 1, teamId: 1, playerId: 1 },
  { unique: true }
);

export const RosterEntry: Model<IRosterEntry> =
  mongoose.models.RosterEntry ||
  mongoose.model<IRosterEntry>("RosterEntry", RosterEntrySchema);
