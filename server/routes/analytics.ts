import { RequestHandler } from "express";
import connectDB from "../database.js";
import Goal from "../models/Goal.js";
import { AnalyticsResponse, ErrorResponse } from "@shared/api";

export const handleGetAnalytics: RequestHandler<
  {},
  AnalyticsResponse | ErrorResponse
> = async (req: any, res) => {
  try {
    await connectDB();

    const userId = req.userId;

    // Get all user goals
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });

    if (goals.length === 0) {
      return res.json({
        completionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        goalsCompleted: 0,
        totalGoals: 0,
        categoryBreakdown: [],
        weeklyTrends: [],
        monthlyTrends: [],
      });
    }

    // Calculate completion rate
    const completedGoals = goals.filter((g) => g.completed);
    const completionRate = (completedGoals.length / goals.length) * 100;

    // Calculate basic streaks (simplified for now)
    // Note: For a full implementation, this should use the global streak calculation
    const currentStreak = 0; // TODO: Implement global streak calculation
    const longestStreak = 0; // TODO: Implement longest streak tracking

    // Category breakdown
    const categoryMap = new Map<string, { completed: number; total: number }>();
    goals.forEach((goal) => {
      const category = goal.category || "Uncategorized";
      const current = categoryMap.get(category) || { completed: 0, total: 0 };
      current.total++;
      if (goal.completed) current.completed++;
      categoryMap.set(category, current);
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(
      ([category, stats]) => ({
        category,
        completed: stats.completed,
        total: stats.total,
        percentage: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
      }),
    );

    // Weekly trends (last 4 weeks)
    const now = new Date();
    const weeklyTrends = [];

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7 - now.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // End of week (Saturday)
      weekEnd.setHours(23, 59, 59, 999);

      const weekGoals = goals.filter((g) => {
        const goalDate = new Date(g.createdAt);
        return goalDate >= weekStart && goalDate <= weekEnd;
      });

      const weekCompleted = weekGoals.filter((g) => {
        if (!g.completed || !g.completedAt) return false;
        const completedDate = new Date(g.completedAt);
        return completedDate >= weekStart && completedDate <= weekEnd;
      });

      weeklyTrends.push({
        week: `Week ${4 - i}`,
        completed: weekCompleted.length,
        total: weekGoals.length,
      });
    }

    // Monthly trends (last 6 months)
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      const monthGoals = goals.filter((g) => {
        const goalDate = new Date(g.createdAt);
        return goalDate >= monthStart && goalDate <= monthEnd;
      });

      const monthCompleted = monthGoals.filter((g) => {
        if (!g.completed || !g.completedAt) return false;
        const completedDate = new Date(g.completedAt);
        return completedDate >= monthStart && completedDate <= monthEnd;
      });

      monthlyTrends.push({
        month: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        completed: monthCompleted.length,
        total: monthGoals.length,
      });
    }

    const analytics: AnalyticsResponse = {
      completionRate: Math.round(completionRate * 100) / 100,
      currentStreak,
      longestStreak,
      goalsCompleted: completedGoals.length,
      totalGoals: goals.length,
      categoryBreakdown,
      weeklyTrends,
      monthlyTrends,
    };

    res.json(analytics);
  } catch (error: any) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error",
    });
  }
};
