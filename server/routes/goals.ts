import { RequestHandler } from "express";
import { Goal, CreateGoalRequest, UpdateGoalRequest, GoalsResponse, ErrorResponse } from "@shared/api";

// In-memory storage for demo (replace with MongoDB in production)
let goals: Goal[] = [];
let nextGoalId = 1;

// Helper function to get user ID from token
const getUserIdFromToken = (authHeader?: string): string | null => {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return token.split('_')[1] || null;
};

export const handleGetGoals: RequestHandler<{}, GoalsResponse | ErrorResponse> = (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Authentication required"
      });
    }

    const userGoals = goals.filter(g => g.userId === userId);
    
    res.json({
      goals: userGoals,
      total: userGoals.length
    });
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};

export const handleCreateGoal: RequestHandler<{}, Goal | ErrorResponse, CreateGoalRequest> = (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Authentication required"
      });
    }

    const { title, description, category, type, timeAllotted, deadline } = req.body;

    const newGoal: Goal = {
      id: nextGoalId.toString(),
      userId,
      title,
      description,
      category,
      type,
      timeAllotted,
      deadline: new Date(deadline),
      completed: false,
      streak: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    goals.push(newGoal);
    nextGoalId++;

    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};

export const handleUpdateGoal: RequestHandler<{ id: string }, Goal | ErrorResponse, UpdateGoalRequest> = (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Authentication required"
      });
    }

    const goalId = req.params.id;
    const goalIndex = goals.findIndex(g => g.id === goalId && g.userId === userId);
    
    if (goalIndex === -1) {
      return res.status(404).json({
        error: "GOAL_NOT_FOUND",
        message: "Goal not found"
      });
    }

    const updates = req.body;
    const goal = goals[goalIndex];

    // Update goal fields
    if (updates.title !== undefined) goal.title = updates.title;
    if (updates.description !== undefined) goal.description = updates.description;
    if (updates.category !== undefined) goal.category = updates.category;
    if (updates.type !== undefined) goal.type = updates.type;
    if (updates.timeAllotted !== undefined) goal.timeAllotted = updates.timeAllotted;
    if (updates.deadline !== undefined) goal.deadline = new Date(updates.deadline);
    
    // Handle completion
    if (updates.completed !== undefined) {
      goal.completed = updates.completed;
      if (updates.completed) {
        goal.completedAt = new Date();
        // Simple streak calculation (in production, this would be more sophisticated)
        goal.streak = goal.streak + 1;
      } else {
        goal.completedAt = undefined;
      }
    }

    goal.updatedAt = new Date();
    goals[goalIndex] = goal;

    res.json(goal);
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};

export const handleDeleteGoal: RequestHandler<{ id: string }, { success: boolean } | ErrorResponse> = (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Authentication required"
      });
    }

    const goalId = req.params.id;
    const goalIndex = goals.findIndex(g => g.id === goalId && g.userId === userId);
    
    if (goalIndex === -1) {
      return res.status(404).json({
        error: "GOAL_NOT_FOUND",
        message: "Goal not found"
      });
    }

    goals.splice(goalIndex, 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};
