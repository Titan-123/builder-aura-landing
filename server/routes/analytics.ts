import { RequestHandler } from "express";
import { AnalyticsResponse, ErrorResponse } from "@shared/api";

// Import goals from goals.ts (in production, this would be from database)
// For now, we'll access the same in-memory storage
let goals: any[] = [];

// Helper function to get user ID from token
const getUserIdFromToken = (authHeader?: string): string | null => {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return token.split('_')[1] || null;
};

export const handleGetAnalytics: RequestHandler<{}, AnalyticsResponse | ErrorResponse> = (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Authentication required"
      });
    }

    // Get goals module to access the same in-memory storage
    const goalsModule = require('./goals');
    const userGoals = goals.filter(g => g.userId === userId);

    // Calculate completion rate
    const completedGoals = userGoals.filter(g => g.completed);
    const completionRate = userGoals.length > 0 ? (completedGoals.length / userGoals.length) * 100 : 0;

    // Calculate streaks (simplified for demo)
    const currentStreak = userGoals.reduce((max, goal) => Math.max(max, goal.streak || 0), 0);
    const longestStreak = currentStreak; // In production, track this separately

    // Category breakdown
    const categoryMap = new Map<string, { completed: number; total: number }>();
    userGoals.forEach(goal => {
      const category = goal.category || 'Uncategorized';
      const current = categoryMap.get(category) || { completed: 0, total: 0 };
      current.total++;
      if (goal.completed) current.completed++;
      categoryMap.set(category, current);
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      completed: stats.completed,
      total: stats.total,
      percentage: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
    }));

    // Weekly and monthly trends (simplified for demo)
    const now = new Date();
    const weeklyTrends = [];
    const monthlyTrends = [];

    // Generate last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekGoals = userGoals.filter(g => {
        const goalDate = new Date(g.createdAt);
        return goalDate >= weekStart && goalDate <= weekEnd;
      });
      
      weeklyTrends.push({
        week: `Week ${4 - i}`,
        completed: weekGoals.filter(g => g.completed).length,
        total: weekGoals.length
      });
    }

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthGoals = userGoals.filter(g => {
        const goalDate = new Date(g.createdAt);
        return goalDate >= monthStart && goalDate <= monthEnd;
      });
      
      monthlyTrends.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        completed: monthGoals.filter(g => g.completed).length,
        total: monthGoals.length
      });
    }

    const analytics: AnalyticsResponse = {
      completionRate: Math.round(completionRate * 100) / 100,
      currentStreak,
      longestStreak,
      goalsCompleted: completedGoals.length,
      totalGoals: userGoals.length,
      categoryBreakdown,
      weeklyTrends,
      monthlyTrends
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};
