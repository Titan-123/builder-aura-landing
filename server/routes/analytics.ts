import { RequestHandler } from "express";
import connectDB from "../database.js";
import Goal from "../models/Goal.js";
import User from "../models/User.js";
import { AnalyticsResponse, ErrorResponse } from "@shared/api";

export const handleGetAnalytics: RequestHandler<
  {},
  AnalyticsResponse | ErrorResponse
> = async (req: any, res) => {
  try {
    const dbConnection = await connectDB();

    // If no database connection, use mock data
    if (!dbConnection) {
      console.log("Using mock data for analytics");
      const mockAnalytics = {
        completionRate: 66.7,
        currentStreak: 2,
        longestStreak: 5,
        goalsCompleted: 2,
        totalGoals: 3,
        categoryBreakdown: [
          { category: "Health", total: 1, completed: 0 },
          { category: "Personal Development", total: 1, completed: 1 },
          { category: "Work", total: 1, completed: 1 },
        ],
        weeklyTrends: [
          { week: "Week 1", completed: 0 },
          { week: "Week 2", completed: 1 },
          { week: "Week 3", completed: 2 },
          { week: "Week 4", completed: 2 },
        ],
        monthlyTrends: [
          { month: "Jan", completed: 8 },
          { month: "Feb", completed: 12 },
          { month: "Mar", completed: 15 },
        ],
      };

      res.json(mockAnalytics);
      return;
    }

    const userId = req.userId;

    // Get user registration date
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    // Get all user goals
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });

    console.log("🔍 Analytics Debug - User ID:", userId);
    console.log("🔍 Total goals found:", goals.length);
    console.log("🔍 Current server date/time:", new Date());
    console.log("🔍 Current server year:", new Date().getFullYear());
    console.log("🔍 Goals structure:");
    goals.forEach((goal, index) => {
      console.log(`Goal ${index + 1}:`, {
        id: goal._id,
        title: goal.title,
        type: goal.type,
        deadline: goal.deadline
          ? new Date(goal.deadline).toDateString()
          : "No deadline",
        completed: goal.completed,
        completedAt: goal.completedAt
          ? new Date(goal.completedAt).toDateString()
          : "Not completed",
      });
    });

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

    // Calculate current streak using improved logic
    const calculateCurrentStreak = () => {
      const today = new Date();

      // Helper function to normalize date to start of day for comparison
      const normalizeDate = (date: Date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
      };

      const todayNormalized = normalizeDate(today);

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
          return null; // No goals for this day
        }

        const completedDailyGoals = allDailyGoals.filter(
          (goal) => goal.completed,
        );
        return completedDailyGoals.length === allDailyGoals.length;
      };

      // Get all dates that have daily goals, sorted newest first
      const datesWithDailyGoals = [
        ...new Set(
          goals
            .filter((goal) => goal.type === "daily")
            .map((goal) => {
              const date = new Date(goal.deadline);
              return normalizeDate(date).toDateString();
            }),
        ),
      ]
        .map((dateStr) => new Date(dateStr))
        .sort((a, b) => b.getTime() - a.getTime()); // Sort newest first

      if (datesWithDailyGoals.length === 0) {
        console.log(
          "📊 Analytics - No daily goals found for streak calculation",
        );
        return 0;
      }

      console.log(
        "📊 Analytics - Dates with daily goals:",
        datesWithDailyGoals.map((d) => d.toDateString()),
      );

      // Find consecutive completed days working backwards from most recent completed day
      let currentStreak = 0;
      let startIndex = 0;

      // If the most recent date is today and it's incomplete, start from yesterday
      const mostRecentDate = datesWithDailyGoals[0];
      const isMostRecentToday =
        normalizeDate(mostRecentDate).getTime() === todayNormalized.getTime();

      console.log(
        `📊 Analytics - Most recent date: ${mostRecentDate.toDateString()}, isToday: ${isMostRecentToday}`,
      );
      console.log(
        `📊 Analytics - Today normalized: ${todayNormalized.toDateString()}`,
      );

      if (isMostRecentToday && isDayFullyCompleted(mostRecentDate) !== true) {
        console.log(
          "📊 Analytics - Today exists but is incomplete, starting from yesterday",
        );
        startIndex = 1;
      }

      // Count consecutive completed days
      for (let i = startIndex; i < datesWithDailyGoals.length; i++) {
        const currentDate = datesWithDailyGoals[i];
        const dayCompletion = isDayFullyCompleted(currentDate);

        const isFuture =
          normalizeDate(currentDate).getTime() > todayNormalized.getTime();
        console.log(
          `📊 Analytics - Checking ${currentDate.toDateString()}: dayCompletion = ${dayCompletion}, isFuture = ${isFuture}`,
        );

        if (isFuture) {
          // Future dates (both completed and incomplete) don't count toward current streak
          console.log(
            `📊 Analytics - Future date (${currentDate.toDateString()}), skipping for streak calculation`,
          );
          continue;
        } else if (dayCompletion === true) {
          currentStreak++;
          console.log(
            `📊 Analytics - Day completed! Current streak: ${currentStreak}`,
          );

          // Check if this date is consecutive with the previous one (if any)
          if (i > 0) {
            const nextNewerDate = datesWithDailyGoals[i - 1];
            const daysDiff = Math.floor(
              (nextNewerDate.getTime() - currentDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );

            if (daysDiff > 1) {
              console.log(
                `📊 Analytics - Gap of ${daysDiff} days found, streak ends`,
              );
              break;
            }
          }
        } else {
          // Past or today incomplete date breaks the streak
          console.log(
            `📊 Analytics - Past/today date not completed, streak ends`,
          );
          break;
        }
      }

      return currentStreak;
    };

    const currentStreak = calculateCurrentStreak();
    console.log("📊 Analytics - Current streak calculated:", currentStreak);
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

    // Weekly trends (from user registration to now)
    const now = new Date();
    const userRegistrationDate = new Date(user.createdAt);
    const weeklyTrends = [];

    // Calculate number of weeks since registration
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksSinceRegistration = Math.floor(
      (now.getTime() - userRegistrationDate.getTime()) / msPerWeek,
    );

    // Show last 8 weeks max, or all weeks since registration if less than 8
    const weeksToShow = Math.min(weeksSinceRegistration + 1, 8);

    for (let i = weeksToShow - 1; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7 - now.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      // Don't go earlier than user registration
      if (weekStart < userRegistrationDate) {
        weekStart.setTime(userRegistrationDate.getTime());
      }

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // End of week (Saturday)
      weekEnd.setHours(23, 59, 59, 999);

      // Don't go later than now
      if (weekEnd > now) {
        weekEnd.setTime(now.getTime());
      }

      const weekGoals = goals.filter((g) => {
        const goalDate = new Date(g.createdAt);
        return goalDate >= weekStart && goalDate <= weekEnd;
      });

      const weekCompleted = weekGoals.filter((g) => {
        if (!g.completed || !g.completedAt) return false;
        const completedDate = new Date(g.completedAt);
        return completedDate >= weekStart && completedDate <= weekEnd;
      });

      // Create week label based on actual date
      const weekLabel = weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      weeklyTrends.push({
        week: weekLabel,
        completed: weekCompleted.length,
        total: weekGoals.length,
      });
    }

    // Monthly trends (from user registration to now)
    const monthlyTrends = [];

    // Calculate number of months since registration
    const monthsSinceRegistration =
      (now.getFullYear() - userRegistrationDate.getFullYear()) * 12 +
      (now.getMonth() - userRegistrationDate.getMonth());

    // Show last 6 months max, or all months since registration if less than 6
    const monthsToShow = Math.min(monthsSinceRegistration + 1, 6);

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthStart.setHours(0, 0, 0, 0);

      // Don't go earlier than user registration
      if (monthStart < userRegistrationDate) {
        monthStart.setTime(userRegistrationDate.getTime());
      }

      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      // Don't go later than now
      if (monthEnd > now) {
        monthEnd.setTime(now.getTime());
      }

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

    // Provide mock analytics data when database operations fail
    console.log("Database error occurred, serving mock analytics data");
    const mockAnalytics = {
      completionRate: 66.7,
      currentStreak: 2,
      longestStreak: 5,
      goalsCompleted: 2,
      totalGoals: 3,
      categoryBreakdown: [
        { category: "Health", total: 1, completed: 0 },
        { category: "Personal Development", total: 1, completed: 1 },
        { category: "Work", total: 1, completed: 1 },
      ],
      weeklyTrends: [
        { week: "Week 1", completed: 0 },
        { week: "Week 2", completed: 1 },
        { week: "Week 3", completed: 2 },
        { week: "Week 4", completed: 2 },
      ],
      monthlyTrends: [
        { month: "Jan", completed: 8 },
        { month: "Feb", completed: 12 },
        { month: "Mar", completed: 15 },
      ],
    };

    res.json(mockAnalytics);
  }
};
