import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  description?: string;
  youtubeId: string;
  thumbnailUrl?: string;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  allowedRoles: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
    },
    youtubeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    allowedRoles: {
      type: [String],
      default: ["user"],
      enum: ["public", "user", "admin"],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
VideoSchema.index({ youtubeId: 1 }, { unique: true });
VideoSchema.index({ isPublished: 1, allowedRoles: 1 });
VideoSchema.index({ createdBy: 1 });
VideoSchema.index({ tags: 1 });

export default mongoose.models.Video ||
  mongoose.model<IVideo>("Video", VideoSchema);
