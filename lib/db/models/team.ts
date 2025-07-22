import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITeam extends Document {
  name: string;
  tournamentId: Types.ObjectId;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: [true, "Tournament ID is required"],
    },
    createdBy: {
      type: String,
      required: [true, "Creator is required"],
    },
    updatedBy: {
      type: String,
      required: [true, "Updater is required"],
    },
  },
  {
    timestamps: true,
  }
);

TeamSchema.index({ tournamentId: 1, name: 1 }, { unique: true });

export default mongoose.models.Team ||
  mongoose.model<ITeam>("Team", TeamSchema);
