import { RequestHandler } from "express";
import connectDB from "../database.js";
import Goal, { IGoal } from "../models/Goal.js";
import { verifyToken } from "./auth.js";
import {
  Goal as GoalType,
  CreateGoalRequest,
  UpdateGoalRequest,
  GoalsResponse,
  ErrorResponse,
} from "@shared/api";

// Helper function to convert Mongoose document to API response format
const formatGoal = (goal: IGoal): GoalType => ({
  id: goal._id.toString(),
  userId: goal.userId,
  title: goal.title,
  description: goal.description,
  category: goal.category,
  type: goal.type,
  timeAllotted: goal.timeAllotted,
  deadline: goal.deadline,
  completed: goal.completed,
  completedAt: goal.completedAt,
  createdAt: goal.createdAt,
  updatedAt: goal.updatedAt,
});

// Helper function to calculate global completion streaks for goal tracker
const calculateGlobalStreaks = async (userId: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate daily streak (consecutive days with all daily goals completed)
    let dailyStreak = 0;
    let checkDate = new Date(today);

    for (let day = 0; day < 365; day++) {
      // Max check 1 year
      const dayStart = new Date(checkDate);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Get all daily goals for this date
      const dailyGoals = await Goal.find({
        userId,
        type: "daily",
        deadline: {
          $gte: dayStart,
          $lte: dayEnd,
        },
      });

      if (dailyGoals.length === 0) {
        // No goals for this day, continue checking previous days
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }

      // Check if all daily goals for this day were completed
      const completedGoals = dailyGoals.filter((goal) => goal.completed);
      const allCompleted = completedGoals.length === dailyGoals.length;

      if (allCompleted) {
        dailyStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Streak broken
        break;
      }
    }

    // Calculate weekly streak (consecutive weeks with all weekly goals completed)
    let weeklyStreak = 0;
    const getWeekStart = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day;
      return new Date(d.setDate(diff));
    };

    let weekStart = getWeekStart(today);
    weekStart.setHours(0, 0, 0, 0);

    for (let week = 0; week < 52; week++) {
      // Max check 1 year
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      // Get all weekly goals for this week
      const weeklyGoals = await Goal.find({
        userId,
        type: "weekly",
        deadline: {
          $gte: weekStart,
          $lte: weekEnd,
        },
      });

      if (weeklyGoals.length === 0) {
        // No goals for this week, continue checking previous weeks
        weekStart.setDate(weekStart.getDate() - 7);
        continue;
      }

      // Check if all weekly goals for this week were completed
      const completedGoals = weeklyGoals.filter((goal) => goal.completed);
      const allCompleted = completedGoals.length === weeklyGoals.length;

      if (allCompleted) {
        weeklyStreak++;
        weekStart.setDate(weekStart.getDate() - 7);
      } else {
        // Streak broken
        break;
      }
    }

    // Calculate monthly streak (consecutive months with all monthly goals completed)
    let monthlyStreak = 0;
    let checkMonth = today.getMonth();
    let checkYear = today.getFullYear();

    for (let month = 0; month < 12; month++) {
      // Max check 1 year
      const monthStart = new Date(checkYear, checkMonth, 1);
      const monthEnd = new Date(checkYear, checkMonth + 1, 0, 23, 59, 59, 999);

      // Get all monthly goals for this month
      const monthlyGoals = await Goal.find({
        userId,
        type: "monthly",
        deadline: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      });

      if (monthlyGoals.length === 0) {
        // No goals for this month, continue checking previous months
        checkMonth--;
        if (checkMonth < 0) {
          checkMonth = 11;
          checkYear--;
        }
        continue;
      }

      // Check if all monthly goals for this month were completed
      const completedGoals = monthlyGoals.filter((goal) => goal.completed);
      const allCompleted = completedGoals.length === monthlyGoals.length;

      if (allCompleted) {
        monthlyStreak++;
        checkMonth--;
        if (checkMonth < 0) {
          checkMonth = 11;
          checkYear--;
        }
      } else {
        // Streak broken
        break;
      }
    }

    return {
      dailyStreak,
      weeklyStreak,
      monthlyStreak,
    };
  } catch (error) {
    console.error("Error calculating global streaks:", error);
    return {
      dailyStreak: 0,
      weeklyStreak: 0,
      monthlyStreak: 0,
    };
  }
};

export const handleGetGoals: RequestHandler<
  {},
  GoalsResponse | ErrorResponse
> = async (req: any, res) => {
  try {
    await connectDB();

    const { type, category, completed } = req.query;

    // Build filter
    const filter: any = { userId: req.userId };

    if (type && type !== "all") {
      filter.type = type;
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    // Get goals with sorting (newest first)
    const goals = await Goal.find(filter).sort({ createdAt: -1 });

    const formattedGoals = goals.map(formatGoal);

    res.json({
      goals: formattedGoals,
      total: formattedGoals.length,
    });
  } catch (error: any) {
    console.error("Get goals error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error",
    });
  }
};

export const handleCreateGoal: RequestHandler<
  {},
  GoalType | ErrorResponse,
  CreateGoalRequest
> = async (req: any, res) => {
  try {
    await connectDB();

    const { title, description, category, type, timeAllotted, deadline } =
      req.body;

    // Validate input
    if (
      !title ||
      !description ||
      !category ||
      !type ||
      !timeAllotted ||
      !deadline
    ) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "All fields are required",
      });
    }

    if (!["daily", "weekly", "monthly"].includes(type)) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Type must be daily, weekly, or monthly",
      });
    }

    if (timeAllotted < 1 || timeAllotted > 1440) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Time allotted must be between 1 and 1440 minutes",
      });
    }

    // Create new goal
    const goal = new Goal({
      userId: req.userId,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      type,
      timeAllotted,
      deadline: new Date(deadline),
      completed: false,
    });

    await goal.save();

    res.status(201).json(formatGoal(goal));
  } catch (error: any) {
    console.error("Create goal error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: Object.values(error.errors)
          .map((e: any) => e.message)
          .join(", "),
      });
    }

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error",
    });
  }
};

export const handleUpdateGoal: RequestHandler<
  { id: string },
  GoalType | ErrorResponse,
  UpdateGoalRequest
> = async (req: any, res) => {
  try {
    await connectDB();

    const goalId = req.params.id;
    const updates = req.body;

    // Find the goal
    const goal = await Goal.findOne({ _id: goalId, userId: req.userId });
    if (!goal) {
      return res.status(404).json({
        error: "GOAL_NOT_FOUND",
        message: "Goal not found",
      });
    }

    // Update fields
    if (updates.title !== undefined) goal.title = updates.title.trim();
    if (updates.description !== undefined)
      goal.description = updates.description.trim();
    if (updates.category !== undefined) goal.category = updates.category.trim();
    if (updates.type !== undefined) {
      if (!["daily", "weekly", "monthly"].includes(updates.type)) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Type must be daily, weekly, or monthly",
        });
      }
      goal.type = updates.type;
    }
    if (updates.timeAllotted !== undefined) {
      if (updates.timeAllotted < 1 || updates.timeAllotted > 1440) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Time allotted must be between 1 and 1440 minutes",
        });
      }
      goal.timeAllotted = updates.timeAllotted;
    }
    if (updates.deadline !== undefined) {
      goal.deadline = new Date(updates.deadline);
    }

    // Handle completion status
    if (updates.completed !== undefined) {
      const wasCompleted = goal.completed;
      goal.completed = updates.completed;

      if (updates.completed && !wasCompleted) {
        // Goal is being marked as completed
        goal.completedAt = new Date();
      } else if (!updates.completed && wasCompleted) {
        // Goal is being marked as incomplete
        goal.completedAt = undefined;
      }
    }

    goal.updatedAt = new Date();
    await goal.save();

    res.json(formatGoal(goal));
  } catch (error: any) {
    console.error("Update goal error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: Object.values(error.errors)
          .map((e: any) => e.message)
          .join(", "),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "INVALID_ID",
        message: "Invalid goal ID",
      });
    }

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error",
    });
  }
};

export const handleDeleteGoal: RequestHandler<
  { id: string },
  { success: boolean } | ErrorResponse
> = async (req: any, res) => {
  try {
    await connectDB();

    const goalId = req.params.id;

    // Find and delete the goal
    const deletedGoal = await Goal.findOneAndDelete({
      _id: goalId,
      userId: req.userId,
    });

    if (!deletedGoal) {
      return res.status(404).json({
        error: "GOAL_NOT_FOUND",
        message: "Goal not found",
      });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("Delete goal error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "INVALID_ID",
        message: "Invalid goal ID",
      });
    }

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error",
    });
  }
};

// New endpoint to get global streaks
export const handleGetStreaks: RequestHandler<{}, any | ErrorResponse> = async (
  req: any,
  res,
) => {
  try {
    console.log("🔄 Fetching streaks for user:", req.userId);
    await connectDB();

    // Simple streak calculation for development
    const goals = await Goal.find({ userId: req.userId });
    console.log("📊 Found", goals.length, "goals for user");

    // Basic daily streak calculation
    let dailyStreak = 0;
    const today = new Date();

    // Check last few days to see if daily goals were completed
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);

      const endDate = new Date(checkDate);
      endDate.setHours(23, 59, 59, 999);

      const dailyGoals = goals.filter(goal => {
        const goalDate = new Date(goal.deadline);
        return goal.type === 'daily' &&
               goalDate >= checkDate &&
               goalDate <= endDate;
      });

      if (dailyGoals.length === 0) continue;

      const completedDaily = dailyGoals.filter(goal => goal.completed);
      if (completedDaily.length === dailyGoals.length) {
        dailyStreak++;
      } else {
        break;
      }
    }

    const streaks = {
      dailyStreak,
      weeklyStreak: 0,
      monthlyStreak: 0,
    };

    console.log("✅ Streaks calculated:", streaks);
    res.json(streaks);
  } catch (error: any) {
    console.error("❌ Get streaks error:", error);
    console.error("Error stack:", error.stack);

    // Return default values instead of error to prevent frontend crashes
    res.json({
      dailyStreak: 0,
      weeklyStreak: 0,
      monthlyStreak: 0,
    });
  }
};
