import mongoose, { Schema, Document } from "mongoose";

export interface IAlumni extends Document {
  name: string;
  email: string;
  studentId: string;
  graduationYear: number;
  currentLocation: string;
  currentJob: string;
  company: string;
  achievements: string[];
  contactPreference: "email" | "phone" | "linkedin";
  phoneNumber?: string;
  linkedinUrl?: string;
  isActive: boolean;
  joinDate: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const alumniSchema = new Schema<IAlumni>(
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
      required: [true, "Student ID is required"],
      unique: true,
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: [true, "Graduation year is required"],
      min: [2010, "Graduation year must be at least 2010"],
      max: [2030, "Graduation year must be at most 2030"],
    },
    currentLocation: {
      type: String,
      required: [true, "Current location is required"],
      trim: true,
    },
    currentJob: {
      type: String,
      required: [true, "Current job is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    achievements: [
      {
        type: String,
        trim: true,
      },
    ],
    contactPreference: {
      type: String,
      enum: ["email", "phone", "linkedin"],
      default: "email",
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
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

alumniSchema.index({ graduationYear: 1 });
alumniSchema.index({ currentLocation: 1 });
alumniSchema.index({ isActive: 1 });

export default mongoose.models.Alumni ||
  mongoose.model<IAlumni>("Alumni", alumniSchema);
