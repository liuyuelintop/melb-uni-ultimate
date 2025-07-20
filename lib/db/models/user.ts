import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  studentId?: string; // Made optional
  gender: "male" | "female" | "other"; // New required field
  phoneNumber?: string;
  position: "handler" | "cutter" | "any";
  experience: "beginner" | "intermediate" | "advanced" | "expert";
  role: "user" | "admin";
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  playerId?: string; // New optional field for linking to Player
}

const userSchema = new Schema<IUser>(
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
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    studentId: {
      type: String,
      required: false, // Made optional
      trim: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    playerId: {
      type: String, // Could also be mongoose.Schema.Types.ObjectId
      required: false,
      index: true,
    },
    phoneNumber: {
      type: String,
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes are already defined in the schema fields

export default mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);
