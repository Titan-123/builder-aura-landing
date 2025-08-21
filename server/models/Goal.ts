import mongoose, { Document, Schema } from "mongoose";

export interface IGoal extends Document {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  type: "daily" | "weekly" | "monthly";
  timeAllotted: number;
  deadline: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [100, "Category cannot be more than 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["daily", "weekly", "monthly"],
    },
    timeAllotted: {
      type: Number,
      required: [true, "Time allotted is required"],
      min: [1, "Time allotted must be at least 1 minute"],
      max: [1440, "Time allotted cannot exceed 1440 minutes (24 hours)"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
GoalSchema.index({ userId: 1, createdAt: -1 });
GoalSchema.index({ userId: 1, completed: 1 });
GoalSchema.index({ userId: 1, type: 1 });

export default mongoose.models.Goal ||
  mongoose.model<IGoal>("Goal", GoalSchema);
