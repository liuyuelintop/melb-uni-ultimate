import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IRosterEntry extends Document {
  playerId: Types.ObjectId;
  tournamentId: Types.ObjectId;
  role?: string; // e.g., 'player', 'captain'
  position?: string; // e.g., 'handler', 'cutter', etc.
  notes?: string;
}

const RosterEntrySchema = new Schema<IRosterEntry>({
  playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
  tournamentId: {
    type: Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  role: { type: String },
  position: { type: String },
  notes: { type: String },
});

export const RosterEntry: Model<IRosterEntry> =
  mongoose.models.RosterEntry ||
  mongoose.model<IRosterEntry>("RosterEntry", RosterEntrySchema);
