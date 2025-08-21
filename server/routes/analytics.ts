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

    // Calculate current streak using the same logic as /api/streaks
    const calculateCurrentStreak = () => {
      const isDayFullyCompleted = (checkDate: Date) => {
        const allDailyGoals = goals.filter((goal) => {
          const goalDate = new Date(goal.deadline);
          return (
            goal.type === "daily" &&
            goalDate.getDate() === checkDate.getDate() &&
            goalDate.getMonth() === checkDate.getMonth() &&
            goalDate.getFullYear() === checkDate.getFullYear()
          );
        });

        if (allDailyGoals.length === 0) {
          return null;
        }

        const completedDailyGoals = allDailyGoals.filter(
          (goal) => goal.completed,
        );
        return completedDailyGoals.length === allDailyGoals.length;
      };

      // Get all dates that have daily goals
      const datesWithDailyGoals = [
        ...new Set(
          goals
            .filter((goal) => goal.type === "daily")
            .map((goal) => {
              const date = new Date(goal.deadline);
              return date.toDateString();
            }),
        ),
      ]
        .map((dateStr) => new Date(dateStr))
        .sort((a, b) => b.getTime() - a.getTime()); // Sort newest first

      if (datesWithDailyGoals.length === 0) {
        return 0;
      }

      // Find the CURRENT streak starting from the most recent date and going backwards
      let currentStreak = 0;

      for (let i = 0; i < datesWithDailyGoals.length; i++) {
        const currentDate = datesWithDailyGoals[i];
        const dayCompletion = isDayFullyCompleted(currentDate);

        if (dayCompletion === true) {
          currentStreak++;

          // Check if this date is consecutive with the previous one (if any)
          if (i > 0) {
            const nextNewerDate = datesWithDailyGoals[i - 1]; // Next newer date in our list
            const daysDiff = Math.floor(
              (nextNewerDate.getTime() - currentDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );

            if (daysDiff > 1) {
              // Gap found between this completed day and the next newer one, so streak ends here
              break;
            }
          }
        } else {
          // Day not completed, streak ends
          break;
        }
      }

      return currentStreak;
    };

    const currentStreak = calculateCurrentStreak();
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
