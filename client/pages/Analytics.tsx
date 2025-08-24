import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Activity,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import DarkModeToggle from "@/components/DarkModeToggle";
import MotivationalQuote from "@/components/MotivationalQuote";
import MotivationalBackground from "@/components/MotivationalBackground";
import { AnalyticsResponse } from "@shared/api";

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-xl font-semibold text-muted-foreground">No Data Yet</h3>
            <p className="text-muted-foreground">Create some goals to see your analytics!</p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <div className="space-y-8 relative">
      <MotivationalBackground variant="floating" intensity="low" />
      
      <div className="absolute top-0 right-0 lg:hidden">
        <DarkModeToggle />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Goal Analytics
        </h1>
        <p className="text-lg text-muted-foreground">
          Clear insights into your progress
        </p>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {analytics.completionRate.toFixed(0)}%
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Success Rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {analytics.currentStreak}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Day Streak
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {analytics.goalsCompleted}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {analytics.totalGoals}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Total Goals
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Category Bar Chart - Simple and Clear */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Goals by Category
              </CardTitle>
              <CardDescription>
                Compare your progress across different areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.categoryBreakdown.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.categoryBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="category" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any, name: string) => [value, name]}
                        labelFormatter={(label) => `Category: ${label}`}
                      />
                      <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                      <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No category data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. Completion Rate Pie Chart - Easy to Understand */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Completion Overview
              </CardTitle>
              <CardDescription>
                Visual breakdown of completed vs remaining goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: analytics.goalsCompleted, fill: '#22c55e' },
                        { name: 'Remaining', value: analytics.totalGoals - analytics.goalsCompleted, fill: '#e5e7eb' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Weekly Progress Cards - Easier to Understand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weekly Progress
              </CardTitle>
              <CardDescription>
                Your goal completion for recent weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.weeklyTrends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analytics.weeklyTrends.map((week, index) => {
                    const completionRate = week.total > 0 ? (week.completed / week.total) * 100 : 0;
                    const isCurrentWeek = index === analytics.weeklyTrends.length - 1;

                    return (
                      <motion.div
                        key={week.week}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          isCurrentWeek
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-300 dark:border-green-700'
                            : 'bg-gradient-to-br from-muted/20 to-muted/10 border-border hover:border-green-200 dark:hover:border-green-800'
                        }`}
                      >
                        <div className="text-center space-y-3">
                          {/* Week Label */}
                          <div className="text-sm font-medium text-muted-foreground">
                            {week.week}
                            {isCurrentWeek && (
                              <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>

                          {/* Completion Circle */}
                          <div className="relative w-16 h-16 mx-auto">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="hsl(var(--muted))"
                                strokeWidth="8"
                                fill="transparent"
                                className="opacity-20"
                              />
                              <motion.circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke={isCurrentWeek ? "#22c55e" : "#3b82f6"}
                                strokeWidth="8"
                                fill="transparent"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: "0 251" }}
                                animate={{ strokeDasharray: `${(completionRate / 100) * 251} 251` }}
                                transition={{ duration: 1.5, delay: 0.2 * index }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold" style={{ color: isCurrentWeek ? "#22c55e" : "#3b82f6" }}>
                                {completionRate.toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-foreground">
                              {week.completed}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              of {week.total} goals completed
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${completionRate}%` }}
                              transition={{ duration: 1.5, delay: 0.3 * index }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: isCurrentWeek ? "#22c55e" : "#3b82f6" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No weekly data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Simple Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.completionRate >= 70 && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">
                        Excellent Performance!
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        You're completing {analytics.completionRate.toFixed(0)}% of your goals. Keep it up!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {analytics.currentStreak >= 3 && (
                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-orange-600" />
                    <div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                        Great Consistency!
                      </h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        {analytics.currentStreak} days in a row! Your consistency is paying off.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {analytics.categoryBreakdown.length > 2 && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                        Balanced Approach
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Working on {analytics.categoryBreakdown.length} categories shows great balance!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {analytics.completionRate < 50 && analytics.totalGoals > 0 && (
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                        Room for Improvement
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Try focusing on fewer goals to build momentum and confidence.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <MotivationalQuote variant="compact" />
      </motion.div>
    </div>
  );
}
