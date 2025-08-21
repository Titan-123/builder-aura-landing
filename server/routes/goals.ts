import { RequestHandler } from "express";
import connectDB from '../database';
import Goal, { IGoal } from '../models/Goal';
import { verifyToken } from './auth';
import { Goal as GoalType, CreateGoalRequest, UpdateGoalRequest, GoalsResponse, ErrorResponse } from "@shared/api";

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
  streak: goal.streak,
  createdAt: goal.createdAt,
  updatedAt: goal.updatedAt
});

export const handleGetGoals: RequestHandler<{}, GoalsResponse | ErrorResponse> = async (req: any, res) => {
  try {
    await connectDB();
    
    const { type, category, completed } = req.query;
    
    // Build filter
    const filter: any = { userId: req.userId };
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    // Get goals with sorting (newest first)
    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    
    const formattedGoals = goals.map(formatGoal);
    
    res.json({
      goals: formattedGoals,
      total: formattedGoals.length
    });
  } catch (error: any) {
    console.error('Get goals error:', error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};

export const handleCreateGoal: RequestHandler<{}, GoalType | ErrorResponse, CreateGoalRequest> = async (req: any, res) => {
  try {
    await connectDB();
    
    const { title, description, category, type, timeAllotted, deadline } = req.body;

    // Validate input
    if (!title || !description || !category || !type || !timeAllotted || !deadline) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "All fields are required"
      });
    }

    if (!['daily', 'weekly', 'monthly'].includes(type)) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Type must be daily, weekly, or monthly"
      });
    }

    if (timeAllotted < 1 || timeAllotted > 1440) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Time allotted must be between 1 and 1440 minutes"
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
      streak: 0
    });

    await goal.save();
    
    res.status(201).json(formatGoal(goal));
  } catch (error: any) {
    console.error('Create goal error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: Object.values(error.errors).map((e: any) => e.message).join(', ')
      });
    }

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};

export const handleUpdateGoal: RequestHandler<{ id: string }, GoalType | ErrorResponse, UpdateGoalRequest> = async (req: any, res) => {
  try {
    await connectDB();
    
    const goalId = req.params.id;
    const updates = req.body;

    // Find the goal
    const goal = await Goal.findOne({ _id: goalId, userId: req.userId });
    if (!goal) {
      return res.status(404).json({
        error: "GOAL_NOT_FOUND",
        message: "Goal not found"
      });
    }

    // Update fields
    if (updates.title !== undefined) goal.title = updates.title.trim();
    if (updates.description !== undefined) goal.description = updates.description.trim();
    if (updates.category !== undefined) goal.category = updates.category.trim();
    if (updates.type !== undefined) {
      if (!['daily', 'weekly', 'monthly'].includes(updates.type)) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Type must be daily, weekly, or monthly"
        });
      }
      goal.type = updates.type;
    }
    if (updates.timeAllotted !== undefined) {
      if (updates.timeAllotted < 1 || updates.timeAllotted > 1440) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Time allotted must be between 1 and 1440 minutes"
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
        // Calculate streak based on consecutive completions
        goal.streak = await calculateStreak(req.userId, goal);
      } else if (!updates.completed && wasCompleted) {
        // Goal is being marked as incomplete
        goal.completedAt = undefined;
        // Recalculate streak when goal is marked incomplete
        goal.streak = await calculateStreak(req.userId, goal);
      }
    }

    goal.updatedAt = new Date();
    await goal.save();

    res.json(formatGoal(goal));
  } catch (error: any) {
    console.error('Update goal error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: Object.values(error.errors).map((e: any) => e.message).join(', ')
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        error: "INVALID_ID",
        message: "Invalid goal ID"
      });
    }

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};

export const handleDeleteGoal: RequestHandler<{ id: string }, { success: boolean } | ErrorResponse> = async (req: any, res) => {
  try {
    await connectDB();
    
    const goalId = req.params.id;

    // Find and delete the goal
    const deletedGoal = await Goal.findOneAndDelete({ _id: goalId, userId: req.userId });
    
    if (!deletedGoal) {
      return res.status(404).json({
        error: "GOAL_NOT_FOUND",
        message: "Goal not found"
      });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete goal error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: "INVALID_ID",
        message: "Invalid goal ID"
      });
    }

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};
