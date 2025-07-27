import mongoose, { Schema, Document } from "mongoose";

export interface ITournament extends Document {
  name: string;
  year: number;
  type: string;
  location: string;
  startDate: Date;
  endDate: Date;
}

const TournamentSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    type: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Tournament ||
  mongoose.model<ITournament>("Tournament", TournamentSchema);
