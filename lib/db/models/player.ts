import mongoose, { Schema, Document } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  email: string;
  studentId?: string; // Made optional
  gender: "male" | "female" | "other"; // New required field
  position: "handler" | "cutter" | "any";
  experience: "beginner" | "intermediate" | "advanced" | "expert";
  jerseyNumber: number;
  phoneNumber?: string;
  graduationYear: number;
  isActive: boolean;
  joinDate: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  affiliation?: string; // New optional field
}

const playerSchema = new Schema<IPlayer>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    studentId: {
      type: String,
      required: false, // Made optional
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    affiliation: {
      type: String,
      required: false,
      trim: true,
    },
    position: {
      type: String,
      enum: ["handler", "cutter", "any"],
      default: "any",
    },
    experience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },
    jerseyNumber: {
      type: Number,
      required: [true, "Jersey number is required"],
      min: [0, "Jersey number must be at least 0"],
      max: [99, "Jersey number must be at most 99"],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: [true, "Graduation year is required"],
      min: [2020, "Graduation year must be at least 2020"],
      max: [2030, "Graduation year must be at most 2030"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Keep only non-duplicate indexes
playerSchema.index({ isActive: 1 });
playerSchema.index({ position: 1 });

export default mongoose.models.Player ||
  mongoose.model<IPlayer>("Player", playerSchema);
