import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  Award,
  Activity,
  Sparkles,
  Zap,
  Clock,
  Users,
  Brain,
  Eye,
  Heart,
  CheckCircle,
  CircleDot,
  Timer,
  Star,
  Flame,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  ComposedChart,
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
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto" />
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-muted-foreground">No Data Yet</h3>
            <p className="text-muted-foreground">Create some goals to see beautiful analytics!</p>
          </div>
        </div>
      </div>
    );
  }

  // Beautiful color palette for charts
  const COLORS = {
    primary: "#3b82f6",
    success: "#22c55e", 
    warning: "#f59e0b",
    danger: "#ef4444",
    purple: "#8b5cf6",
    pink: "#ec4899",
    cyan: "#06b6d4",
    orange: "#f97316",
    indigo: "#6366f1",
    emerald: "#10b981"
  };

  const CHART_COLORS = [
    COLORS.primary,
    COLORS.success,
    COLORS.warning,
    COLORS.purple,
    COLORS.pink,
    COLORS.cyan,
    COLORS.orange,
    COLORS.indigo,
    COLORS.emerald,
    COLORS.danger
  ];

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-2xl"
        >
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-bold" style={{ color: entry.color }}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Performance score calculation
  const getPerformanceLevel = (rate: number) => {
    if (rate >= 80) return { level: "Excellent", color: COLORS.success, icon: Trophy };
    if (rate >= 60) return { level: "Good", color: COLORS.primary, icon: Star };
    if (rate >= 40) return { level: "Fair", color: COLORS.warning, icon: Target };
    return { level: "Needs Focus", color: COLORS.danger, icon: Zap };
  };

  const performance = getPerformanceLevel(analytics.completionRate);

  return (
    <div className="space-y-8 relative">
      {/* Background */}
      <MotivationalBackground variant="floating" intensity="low" />
      
      {/* Dark Mode Toggle */}
      <div className="absolute top-0 right-0 lg:hidden">
        <DarkModeToggle />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Your Progress Analytics
        </h1>
        <p className="text-lg text-muted-foreground">
          Beautiful insights into your goal achievement journey
        </p>
      </motion.div>

      {/* Performance Overview - Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-50/50 to-pink-50/50 dark:from-primary/5 dark:via-purple-950/20 dark:to-pink-950/20 border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl flex items-center justify-center gap-3">
              <performance.icon className="w-8 h-8" style={{ color: performance.color }} />
              Performance Overview
            </CardTitle>
            <CardDescription className="text-lg">
              Current performance level: <span className="font-semibold" style={{ color: performance.color }}>{performance.level}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Completion Rate Circle */}
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
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
                      stroke={performance.color}
                      strokeWidth="8"
                      fill="transparent"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 251" }}
                      animate={{ strokeDasharray: `${(analytics.completionRate / 100) * 251} 251` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: performance.color }}>
                        {analytics.completionRate.toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">Completion Rate</h3>
                <p className="text-sm text-muted-foreground">
                  {analytics.goalsCompleted} of {analytics.totalGoals} goals achieved
                </p>
              </div>

              {/* Streak Visualization */}
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: analytics.currentStreak > 0 ? [1, 1.1, 1] : 1,
                      rotate: analytics.currentStreak > 0 ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 flex items-center justify-center">
                      <Flame className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {analytics.currentStreak}
                    </div>
                  </motion.div>
                </div>
                <h3 className="font-semibold text-lg">Current Streak</h3>
                <p className="text-sm text-muted-foreground">
                  {analytics.currentStreak} {analytics.currentStreak === 1 ? 'day' : 'days'} in a row
                </p>
              </div>

              {/* Goals Progress */}
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-full h-full rounded-full border-8 border-muted/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">
                        {analytics.goalsCompleted}
                      </div>
                      <div className="text-sm text-muted-foreground">Goals</div>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full">
                    {Array.from({ length: analytics.totalGoals }).map((_, index) => {
                      const angle = (index / analytics.totalGoals) * 360;
                      const isCompleted = index < analytics.goalsCompleted;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                          className="absolute w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: isCompleted ? COLORS.emerald : COLORS.danger,
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-50px)`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <h3 className="font-semibold text-lg">Goal Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {analytics.totalGoals - analytics.goalsCompleted} goals remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                Category Performance
              </CardTitle>
              <CardDescription>
                How you're performing across different goal categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.categoryBreakdown.length > 0 ? (
                <div className="space-y-6">
                  {/* Donut Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="completed"
                        >
                          {analytics.categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category Details */}
                  <div className="space-y-3">
                    {analytics.categoryBreakdown.map((category, index) => (
                      <motion.div
                        key={category.category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/40 hover:to-muted/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          <span className="font-medium">{category.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold" style={{ color: CHART_COLORS[index % CHART_COLORS.length] }}>
                              {category.percentage.toFixed(0)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {category.completed}/{category.total}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No categories yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                Weekly Progress
              </CardTitle>
              <CardDescription>
                Your goal completion trends over recent weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.weeklyTrends.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={analytics.weeklyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke={COLORS.emerald}
                        fill="url(#weeklyGradient)"
                        strokeWidth={3}
                        name="Completed Goals"
                      />
                      <Bar
                        dataKey="total"
                        fill={COLORS.primary}
                        opacity={0.3}
                        name="Total Goals"
                        radius={[4, 4, 0, 0]}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No weekly data yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Trends & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                Monthly Journey
              </CardTitle>
              <CardDescription>
                Your long-term goal completion patterns and growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.monthlyTrends.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={analytics.monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="month"
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke={COLORS.primary}
                        fill="url(#monthlyGradient)"
                        strokeWidth={2}
                        name="Total Goals"
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke={COLORS.success}
                        strokeWidth={4}
                        dot={{ fill: COLORS.success, strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: COLORS.success, strokeWidth: 2, fill: '#ffffff' }}
                        name="Completed Goals"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No monthly data yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats & Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-6"
        >
          {/* Achievement Score */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
            <CardHeader className="text-center">
              <CardTitle className="text-lg flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                Achievement Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", bounce: 0.6 }}
                className="text-4xl font-bold text-yellow-600 mb-2"
              >
                {Math.round((analytics.completionRate + analytics.currentStreak * 5) / 2)}
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Based on completion rate and consistency
              </p>
            </CardContent>
          </Card>

          {/* Best Category */}
          {analytics.categoryBreakdown.length > 0 && (
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-600" />
                  Top Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const topCategory = analytics.categoryBreakdown.reduce((max, cat) => 
                    cat.percentage > max.percentage ? cat : max
                  );
                  return (
                    <div className="text-center">
                      <div className="text-xl font-bold text-emerald-600 mb-1">
                        {topCategory.category}
                      </div>
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        {topCategory.percentage.toFixed(0)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {topCategory.completed} of {topCategory.total} completed
                      </p>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Streak Info */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                Streak Status
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {analytics.currentStreak} Days
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {analytics.currentStreak === 0 ? "Start your streak today!" :
                 analytics.currentStreak === 1 ? "Great start! Keep going!" :
                 analytics.currentStreak < 7 ? "Building momentum!" :
                 "Amazing consistency!"}
              </p>
              <div className="flex justify-center space-x-1">
                {Array.from({ length: Math.min(analytics.currentStreak, 7) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    className="w-3 h-3 bg-orange-500 rounded-full"
                  />
                ))}
                {analytics.currentStreak > 7 && (
                  <span className="text-sm text-orange-600 ml-2">+{analytics.currentStreak - 7}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <MotivationalQuote variant="compact" />
      </motion.div>

      {/* Insights & Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              Smart Insights & Recommendations
            </CardTitle>
            <CardDescription>
              Personalized tips based on your goal patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {analytics.completionRate >= 80 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800"
                  >
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">
                          Excellent Performance!
                        </h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          You're achieving over 80% of your goals. Consider setting more ambitious targets.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {analytics.currentStreak >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800"
                  >
                    <div className="flex items-start gap-3">
                      <Flame className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                          Great Consistency!
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          Your {analytics.currentStreak}-day streak shows excellent discipline. Keep it up!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {analytics.completionRate < 50 && analytics.totalGoals > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                          Focus Opportunity
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Try setting fewer, more achievable goals to build momentum and confidence.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {analytics.categoryBreakdown.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800"
                  >
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                          Well-Rounded Goals
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          You're working on {analytics.categoryBreakdown.length} different areas. Great for balanced growth!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
