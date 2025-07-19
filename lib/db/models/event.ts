import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  type: "practice" | "tournament" | "social" | "training";
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  maxParticipants?: number;
  currentParticipants: number;
  registrationDeadline?: Date;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["practice", "tournament", "social", "training"],
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    maxParticipants: {
      type: Number,
      min: 1,
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },
    registrationDeadline: {
      type: Date,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
EventSchema.index({ startDate: 1, status: 1 });
EventSchema.index({ type: 1, startDate: 1 });
EventSchema.index({ isPublic: 1, startDate: 1 });

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
