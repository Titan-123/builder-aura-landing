import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Target,
  Flame,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DarkModeToggle from "@/components/DarkModeToggle";
import MotivationalQuote from "@/components/MotivationalQuote";
import MotivationalBackground from "@/components/MotivationalBackground";
import { Goal } from "@shared/api";

export default function Calendar() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [streaks, setStreaks] = useState<{
    dailyStreak: number;
    weeklyStreak: number;
    monthlyStreak: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadGoals = async () => {
      if (isMounted) {
        await fetchGoals();
      }
    };

    loadGoals();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      // Check if user is authenticated
      if (!token) {
        console.warn("No access token found, cannot fetch goals");
        setGoals([]);
        setStreaks({ dailyStreak: 0, weeklyStreak: 0, monthlyStreak: 0 });
        setLoading(false);
        return;
      }

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("/api/goals", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals || []);

        // Calculate simple streak from goals data
        const completedGoals = (data.goals || []).filter(
          (g: Goal) => g.completed,
        );
        const streak = completedGoals.length > 0 ? 1 : 0; // Simple calculation
        setStreaks({ dailyStreak: streak, weeklyStreak: 0, monthlyStreak: 0 });
      } else {
        console.error(
          "Failed to fetch goals:",
          response.status,
          response.statusText,
        );

        // Handle authentication errors
        if (response.status === 401) {
          console.warn("Authentication failed, clearing token");
          localStorage.removeItem("accessToken");
        }

        // Set fallback sample data for failed requests
        console.log("Setting fallback sample data for Calendar");
        setGoals(getSampleGoals());
        setStreaks({ dailyStreak: 2, weeklyStreak: 1, monthlyStreak: 1 });
      }
    } catch (error: any) {
      console.error("Failed to fetch goals:", error);

      // Handle different error types
      if (error.name === "AbortError") {
        console.warn("Goals fetch request timed out");
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        console.warn("Network error or API endpoint unavailable");
      }

      // Set fallback sample data for errors
      console.log("Network error, setting fallback sample data for Calendar");
      setGoals(getSampleGoals());
      setStreaks({ dailyStreak: 2, weeklyStreak: 1, monthlyStreak: 1 });
    } finally {
      setLoading(false);
    }
  };

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Calendar calculations
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get all goals for a specific date (both completed and pending)
  const getAllGoalsForDate = (date: Date) => {
    return goals.filter((goal) => {
      const goalDate = new Date(goal.deadline);
      return (
        goalDate.getDate() === date.getDate() &&
        goalDate.getMonth() === date.getMonth() &&
        goalDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get completed goals for a specific date
  const getCompletedGoalsForDate = (date: Date) => {
    return getAllGoalsForDate(date).filter((goal) => goal.completed);
  };

  // Get goal statistics for a date
  const getGoalStatsForDate = (date: Date) => {
    const allGoals = getAllGoalsForDate(date);
    const completedGoals = getCompletedGoalsForDate(date);
    return {
      total: allGoals.length,
      completed: completedGoals.length,
      pending: allGoals.length - completedGoals.length,
      completionRate:
        allGoals.length > 0
          ? (completedGoals.length / allGoals.length) * 100
          : 0,
    };
  };

  // For daily completion calculation (whether all daily goals were completed on a specific date)
  const getDailyCompletionForDate = (date: Date) => {
    const allDailyGoals = getAllGoalsForDate(date).filter(
      (g) => g.type === "daily",
    );
    const completedDailyGoals = getCompletedGoalsForDate(date).filter(
      (g) => g.type === "daily",
    );
    return (
      allDailyGoals.length > 0 &&
      completedDailyGoals.length === allDailyGoals.length
    );
  };

  // Generate calendar days
  const calendarDays = [];

  // Previous month's trailing days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = new Date(firstDayOfMonth);
    date.setDate(date.getDate() - i - 1);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    calendarDays.push({ date, isCurrentMonth: true });
  }

  // Next month's leading days
  const remainingDays = 42 - calendarDays.length; // 6 rows × 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      day,
    );
    calendarDays.push({ date, isCurrentMonth: false });
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Monthly stats
  const monthlyStats = {
    totalGoals: goals.filter((g) => {
      const goalDate = new Date(g.createdAt);
      return (
        goalDate.getMonth() === currentDate.getMonth() &&
        goalDate.getFullYear() === currentDate.getFullYear()
      );
    }).length,
    completedGoals: goals.filter(
      (g) =>
        g.completed &&
        g.completedAt &&
        new Date(g.completedAt).getMonth() === currentDate.getMonth() &&
        new Date(g.completedAt).getFullYear() === currentDate.getFullYear(),
    ).length,
    activeDays: new Set(
      goals
        .filter(
          (g) =>
            g.completed &&
            g.completedAt &&
            new Date(g.completedAt).getMonth() === currentDate.getMonth() &&
            new Date(g.completedAt).getFullYear() === currentDate.getFullYear(),
        )
        .map((g) => new Date(g.completedAt!).getDate()),
    ).size,
    bestStreak: streaks?.dailyStreak || 0,
  };

  const completionRate =
    monthlyStats.totalGoals > 0
      ? (monthlyStats.completedGoals / monthlyStats.totalGoals) * 100
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-r-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Motivational Background */}
      <MotivationalBackground variant="particles" intensity="low" />

      {/* Dark Mode Toggle */}
      <div className="absolute top-0 right-0 lg:hidden">
        <DarkModeToggle />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Goal Calendar
          </h1>
          <p className="text-muted-foreground">
            Track your daily progress and streaks
          </p>
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MotivationalQuote variant="compact" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10"
                      whileHover={{ scale: 1.05 }}
                    >
                      <CalendarIcon className="w-5 h-5 text-primary" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl">
                        {monthNames[currentDate.getMonth()]}{" "}
                        {currentDate.getFullYear()}
                      </CardTitle>
                      <CardDescription>
                        {monthlyStats.activeDays} active days this month
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousMonth}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" size="sm" onClick={goToToday}>
                        Today
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextMonth}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2 sm:mb-4">
                  {dayNames.map((day) => (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-1 sm:p-3 text-center text-xs sm:text-sm font-semibold text-muted-foreground"
                    >
                      {day}
                    </motion.div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  <AnimatePresence>
                    {calendarDays.map(({ date, isCurrentMonth }, index) => {
                      const stats = getGoalStatsForDate(date);
                      const hasGoals = stats.total > 0;
                      const isFullyCompleted = getDailyCompletionForDate(date);

                      return (
                        <motion.div
                          key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.01 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDate(date)}
                          className={`
                            relative min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] p-2 sm:p-3 border border-2 rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer
                            ${isCurrentMonth ? "bg-background hover:bg-accent/50" : "bg-muted/30 hover:bg-muted/50"}
                            ${isToday(date) ? "ring-1 sm:ring-2 ring-primary shadow-lg bg-primary/5" : ""}
                            ${isSelected(date) ? "ring-1 sm:ring-2 ring-accent shadow-lg bg-accent/20" : ""}
                            ${
                              hasGoals
                                ? stats.completed === stats.total
                                  ? "bg-green-50 border-green-300 hover:bg-green-100 dark:bg-green-950/30 dark:border-green-800"
                                  : stats.completed > 0
                                    ? "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:border-yellow-800"
                                    : "bg-red-50 border-red-300 hover:bg-red-100 dark:bg-red-950/30 dark:border-red-800"
                                : "border-border hover:border-accent"
                            }
                          `}
                        >
                          {/* Date and Status */}
                          <div className="flex items-start justify-between mb-1 sm:mb-3">
                            <span
                              className={`text-sm sm:text-lg font-bold ${
                                isCurrentMonth
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              } ${isToday(date) ? "text-primary" : ""}`}
                            >
                              {date.getDate()}
                            </span>
                            {isFullyCompleted && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1 bg-green-100 dark:bg-green-900 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm"
                              >
                                <CheckCircle2 className="w-2 h-2 sm:w-3 sm:h-3 text-green-500" />
                                <span className="text-xs text-green-600 dark:text-green-400 font-bold hidden sm:inline">
                                  ✓
                                </span>
                              </motion.div>
                            )}
                          </div>

                          {/* Goal Progress */}
                          {hasGoals && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-1 sm:space-y-2"
                            >
                              {/* Fraction Display */}
                              <div className="text-center">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-3 py-1 sm:py-2 rounded sm:rounded-lg font-bold text-xs sm:text-lg shadow-sm ${
                                    stats.completed === stats.total
                                      ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                                      : stats.completed > 0
                                        ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                                        : "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                                  }`}
                                >
                                  <span>{stats.completed}</span>
                                  <span className="text-xs sm:text-sm opacity-70">
                                    /
                                  </span>
                                  <span>{stats.total}</span>
                                </motion.div>
                              </div>

                              {/* Progress Bar */}
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 sm:h-2 hidden sm:block">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${stats.completionRate}%`,
                                  }}
                                  transition={{ duration: 0.5, delay: 0.2 }}
                                  className={`h-1 sm:h-2 rounded-full ${
                                    stats.completed === stats.total
                                      ? "bg-green-500"
                                      : stats.completed > 0
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                />
                              </div>
                            </motion.div>
                          )}

                          {/* Today indicator */}
                          {isToday(date) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full border border-2 border-background"
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:space-y-6">
          {/* Monthly Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Completion Rate
                    </span>
                    <span className="font-bold text-base sm:text-lg text-primary">
                      {completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={completionRate} className="h-2 sm:h-3" />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 rounded-lg bg-primary/10">
                    <div className="text-lg sm:text-2xl font-bold text-primary">
                      {monthlyStats.completedGoals}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completed
                    </div>
                  </div>
                  <div className="text-center p-2 sm:p-3 rounded-lg bg-accent/10">
                    <div className="text-lg sm:text-2xl font-bold text-accent-foreground">
                      {monthlyStats.activeDays}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Active Days
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    <span className="text-xs sm:text-sm font-medium">
                      Best Streak
                    </span>
                  </div>
                  <span className="font-bold text-base sm:text-lg text-orange-600 dark:text-orange-400">
                    {monthlyStats.bestStreak}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-green-200 border border-2 border-green-400 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-800">
                      3/3
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm">
                    All goals completed
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-yellow-200 border border-2 border-yellow-400 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-800">
                      1/3
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm">
                    Partially completed
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-red-200 border border-2 border-red-400 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-800">0/3</span>
                  </div>
                  <span className="text-xs sm:text-sm">No goals completed</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded ring-1 sm:ring-2 ring-primary flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">Today</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />
                    <span className="text-xs font-medium hidden sm:inline">
                      ✓
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm">
                    All daily goals completed
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Selected Date Details */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
            >
              <Card className="border-2 border-accent/50 bg-accent/5 backdrop-blur-sm shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <CardDescription>
                    {(() => {
                      const stats = getGoalStatsForDate(selectedDate);
                      return stats.total > 0
                        ? `${stats.completed} of ${stats.total} goals completed (${stats.completionRate.toFixed(0)}%)`
                        : "No goals scheduled for this date";
                    })()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {getAllGoalsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-3">
                      {getAllGoalsForDate(selectedDate).map((goal, index) => (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            goal.completed
                              ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
                              : "bg-gray-50 border-gray-200 dark:bg-gray-900/50 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {goal.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`font-semibold ${goal.completed ? "text-green-800 dark:text-green-200 line-through" : "text-foreground"}`}
                              >
                                {goal.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {goal.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <Badge
                                  variant={
                                    goal.completed ? "default" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {goal.category}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {goal.timeAllotted}m
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {goal.type}
                                </Badge>
                              </div>
                              {goal.completed && goal.completedAt && (
                                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                  ✅ Completed on{" "}
                                  {new Date(
                                    goal.completedAt,
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">
                        No goals scheduled for this date
                      </p>
                      <p className="text-xs mt-1">
                        Goals are shown based on their deadline date
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
