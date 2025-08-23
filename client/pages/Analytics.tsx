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
  Flame,
  Star,
  Clock,
  Users,
  Brain,
  Eye,
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
  Scatter,
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
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
          </motion.div>
          <div className="text-lg text-muted-foreground">
            No analytics data available
          </div>
          <p className="text-sm text-muted-foreground">
            Create some goals to see your progress!
          </p>
        </div>
      </div>
    );
  }

  // Enhanced chart colors with better contrast and accessibility
  const COLORS = [
    "#10b981", // Emerald
    "#3b82f6", // Blue
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#ec4899", // Pink
    "#84cc16", // Lime
    "#f97316", // Orange
    "#6366f1", // Indigo
  ];

  // Vibrant gradient color palette for better visual appeal
  const CHART_GRADIENTS = [
    { id: 'emerald', start: '#10b981', end: '#059669' },
    { id: 'blue', start: '#3b82f6', end: '#1d4ed8' },
    { id: 'amber', start: '#f59e0b', end: '#d97706' },
    { id: 'red', start: '#ef4444', end: '#dc2626' },
    { id: 'violet', start: '#8b5cf6', end: '#7c3aed' },
    { id: 'cyan', start: '#06b6d4', end: '#0891b2' },
    { id: 'pink', start: '#ec4899', end: '#db2777' },
    { id: 'lime', start: '#84cc16', end: '#65a30d' },
    { id: 'orange', start: '#f97316', end: '#ea580c' },
    { id: 'indigo', start: '#6366f1', end: '#4f46e5' },
  ];

  // Gradient definitions for better visual appeal
  const GRADIENTS = [
    { from: "#10b981", to: "#059669" }, // Emerald gradient
    { from: "#3b82f6", to: "#2563eb" }, // Blue gradient
    { from: "#f59e0b", to: "#d97706" }, // Amber gradient
    { from: "#ef4444", to: "#dc2626" }, // Red gradient
    { from: "#8b5cf6", to: "#7c3aed" }, // Violet gradient
    { from: "#06b6d4", to: "#0891b2" }, // Cyan gradient
    { from: "#ec4899", to: "#db2777" }, // Pink gradient
    { from: "#84cc16", to: "#65a30d" }, // Lime gradient
    { from: "#f97316", to: "#ea580c" }, // Orange gradient
    { from: "#6366f1", to: "#4f46e5" }, // Indigo gradient
  ];

  // Enhanced custom tooltip for charts with better styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-2xl max-w-xs"
        >
          <p className="font-semibold text-foreground mb-2 text-center">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.name}:</span>
                </div>
                <span className="font-bold text-foreground" style={{ color: entry.color }}>
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

  // Custom label function for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Hide labels for slices smaller than 5%
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-bold drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  return (
    <div className="space-y-6 relative">
      {/* Motivational Background */}
      <MotivationalBackground variant="floating" intensity="low" />

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
            <BarChart3 className="w-8 h-8 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your progress and analyze your goal completion patterns
          </p>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-primary/5 border-2 border-primary/20 hover:border-primary/40 shadow-lg hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                Completion Rate
              </CardTitle>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors"
              >
                <Target className="h-5 w-5 text-primary" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                    {analytics.completionRate.toFixed(1)}%
                  </div>
                  <Progress value={analytics.completionRate} className="h-3" />
                </div>
                {/* Simple Gauge Visual */}
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-muted/30"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <motion.path
                      stroke="url(#primaryGradient)"
                      strokeWidth="3"
                      fill="transparent"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{ strokeDasharray: `${analytics.completionRate} 100` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <defs>
                      <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {Math.round(analytics.completionRate)}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 group-hover:text-muted-foreground/80 transition-colors">
                {analytics.goalsCompleted} of {analytics.totalGoals} goals completed
              </p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors duration-500" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50/50 via-card to-orange-50/50 dark:from-orange-950/20 dark:via-card dark:to-orange-950/20 border-2 border-orange-200/50 dark:border-orange-800/50 hover:border-orange-300 dark:hover:border-orange-600 shadow-lg hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                Current Streak
              </CardTitle>
              <motion.div
                whileHover={{ scale: 1.2 }}
                animate={{
                  rotate: analytics.currentStreak > 0 ? [0, 8, -8, 0] : 0,
                  scale: analytics.currentStreak > 0 ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-colors"
              >
                <Activity className="h-5 w-5 text-orange-500" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-1">
                {analytics.currentStreak}
              </div>
              <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">consecutive days</p>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(analytics.currentStreak, 7) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * i, type: "spring", bounce: 0.4 }}
                      className="w-3 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full shadow-sm"
                    />
                  ))}
                  {analytics.currentStreak > 7 && (
                    <span className="text-xs text-orange-500 ml-1 font-medium">+{analytics.currentStreak - 7}</span>
                  )}
                </div>
                {analytics.currentStreak > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-orange-500"
                    >
                      →
                    </motion.div>
                    <span className="text-muted-foreground">
                      {analytics.currentStreak === 1 ? 'Keep it up!' :
                       analytics.currentStreak < 7 ? 'Building momentum' :
                       analytics.currentStreak < 14 ? 'Great consistency!' :
                       'Incredible dedication!'}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-orange-500/10 transition-colors duration-500" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50/50 via-card to-emerald-50/50 dark:from-emerald-950/20 dark:via-card dark:to-emerald-950/20 border-2 border-emerald-200/50 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-lg hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                Goals Completed
              </CardTitle>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                animate={analytics.goalsCompleted > 0 ? {
                  y: [0, -2, 0],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors"
              >
                <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1">
                {analytics.goalsCompleted}
              </div>
              <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                out of {analytics.totalGoals} total goals
              </p>
              <div className="flex items-center mt-2">
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${analytics.totalGoals > 0 ? (analytics.goalsCompleted / analytics.totalGoals) * 100 : 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <span className="ml-2 text-xs font-medium text-emerald-600">
                  {analytics.totalGoals > 0 ? Math.round((analytics.goalsCompleted / analytics.totalGoals) * 100) : 0}%
                </span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors duration-500" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 via-card to-violet-50/50 dark:from-violet-950/20 dark:via-card dark:to-violet-950/20 border-2 border-violet-200/50 dark:border-violet-800/50 hover:border-violet-300 dark:hover:border-violet-600 shadow-lg hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                Longest Streak
              </CardTitle>
              <motion.div
                whileHover={{ scale: 1.2 }}
                animate={analytics.longestStreak > 0 ? {
                  y: [0, -3, 0],
                  scale: [1, 1.05, 1]
                } : {}}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-3 bg-violet-100 dark:bg-violet-900/50 rounded-xl group-hover:bg-violet-200 dark:group-hover:bg-violet-800/50 transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">
                {analytics.longestStreak}
              </div>
              <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                {analytics.longestStreak === analytics.currentStreak && analytics.currentStreak > 0 ?
                  "current best!" : "personal record"}
              </p>
              {analytics.longestStreak > 0 && (
                <div className="mt-2 flex items-center gap-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-violet-500" />
                  </motion.div>
                  <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                    Achievement unlocked!
                  </span>
                </div>
              )}
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-violet-500/10 transition-colors duration-500" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Category Breakdown with Donut Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-border/50 hover:border-primary/30 bg-gradient-to-br from-background via-background to-primary/5">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Eye className="w-6 h-6 text-primary" />
                </motion.div>
                Category Performance
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Visual breakdown of your goal categories
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {analytics.categoryBreakdown.length > 0 ? (
                <div className="space-y-6">
                  {/* Enhanced Donut Chart with Center Statistics */}
                  <div className="relative h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          {CHART_GRADIENTS.map((gradient) => (
                            <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={gradient.start} stopOpacity={0.9}/>
                              <stop offset="95%" stopColor={gradient.end} stopOpacity={0.7}/>
                            </linearGradient>
                          ))}
                        </defs>
                        <Pie
                          data={analytics.categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={110}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="completed"
                          animationBegin={0}
                          animationDuration={1200}
                        >
                          {analytics.categoryBreakdown.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#${CHART_GRADIENTS[index % CHART_GRADIENTS.length].id})`}
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth={3}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Center Stats */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center bg-background/80 backdrop-blur-sm rounded-full w-20 h-20 flex flex-col items-center justify-center border-2 border-primary/20">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1, type: "spring", bounce: 0.6 }}
                          className="text-lg font-bold text-primary"
                        >
                          {analytics.categoryBreakdown.length}
                        </motion.div>
                        <div className="text-xs text-muted-foreground font-medium">categories</div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced category list with progress bars */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      Category Details
                    </h4>
                    {analytics.categoryBreakdown.map((category, index) => (
                      <motion.div
                        key={category.category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="group p-4 rounded-xl bg-gradient-to-r from-muted/20 to-muted/10 hover:from-muted/30 hover:to-muted/20 transition-all duration-300 border border-border/50 hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 180 }}
                              className="w-5 h-5 rounded-full shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${CHART_GRADIENTS[index % CHART_GRADIENTS.length].start}, ${CHART_GRADIENTS[index % CHART_GRADIENTS.length].end})`,
                              }}
                            />
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {category.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className="font-mono text-xs px-2 py-1"
                              style={{
                                borderColor: CHART_GRADIENTS[index % CHART_GRADIENTS.length].start,
                                color: CHART_GRADIENTS[index % CHART_GRADIENTS.length].start,
                              }}
                            >
                              {category.completed}/{category.total}
                            </Badge>
                            <span
                              className="font-bold text-lg"
                              style={{ color: CHART_GRADIENTS[index % CHART_GRADIENTS.length].start }}
                            >
                              {category.percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        {/* Progress bar with gradient */}
                        <div className="w-full bg-muted/30 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${category.percentage}%` }}
                            transition={{ duration: 1.5, delay: 0.2 * index, ease: "easeOut" }}
                            className="h-full rounded-full shadow-sm"
                            style={{
                              background: `linear-gradient(90deg, ${CHART_GRADIENTS[index % CHART_GRADIENTS.length].start}, ${CHART_GRADIENTS[index % CHART_GRADIENTS.length].end})`,
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Eye className="w-16 h-16 mx-auto opacity-50" />
                    </motion.div>
                    <div>
                      <p className="text-lg font-medium">No categories yet</p>
                      <p className="text-sm">Create goals to see category breakdown</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Weekly Progress with Gradient Area Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-border/50 hover:border-emerald-300/50 bg-gradient-to-br from-background via-background to-emerald-50/30 dark:to-emerald-950/20">
            <CardHeader className="bg-gradient-to-r from-emerald-50/50 via-emerald-50/30 to-blue-50/50 dark:from-emerald-950/30 dark:via-emerald-950/20 dark:to-blue-950/30 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                Weekly Momentum
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Your consistency journey over recent weeks
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {analytics.weeklyTrends.length > 0 ? (
                <div className="space-y-6">
                  {/* Enhanced Area Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={analytics.weeklyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="weeklyBarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#059669" stopOpacity={0.7}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.3}
                          horizontal={true}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="week"
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="#10b981"
                          strokeWidth={3}
                          fill="url(#weeklyGradient)"
                          name="Completed Goals"
                          animationDuration={1000}
                        />
                        <Bar
                          dataKey="completed"
                          fill="url(#weeklyBarGradient)"
                          name="Weekly Goals"
                          radius={[8, 8, 0, 0]}
                          opacity={0.6}
                          animationDuration={1200}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Weekly Summary Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {analytics.weeklyTrends.slice(-4).map((week, index) => {
                      const isCurrentWeek = index === analytics.weeklyTrends.length - 1;
                      return (
                        <motion.div
                          key={week.week}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index, type: "spring" }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                            isCurrentWeek
                              ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-300 dark:border-emerald-700'
                              : 'bg-gradient-to-br from-muted/30 to-muted/10 border-border hover:border-emerald-200 dark:hover:border-emerald-800'
                          }`}
                        >
                          <div className="text-center space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">
                              {week.week}
                              {isCurrentWeek && (
                                <motion.span
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="ml-1 text-emerald-600"
                                >
                                  •
                                </motion.span>
                              )}
                            </div>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              {week.completed}
                            </div>
                            <div className="text-xs text-muted-foreground">goals completed</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Calendar className="w-16 h-16 mx-auto opacity-50" />
                    </motion.div>
                    <div>
                      <p className="text-lg font-medium">No weekly data yet</p>
                      <p className="text-sm">Complete goals to see weekly trends</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Monthly Trends with Growth Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-border/50 hover:border-blue-300/50 bg-gradient-to-br from-background via-background to-blue-50/20 dark:to-blue-950/20">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 via-blue-50/30 to-violet-50/50 dark:from-blue-950/30 dark:via-blue-950/20 dark:to-violet-950/30 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
              Growth Journey
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Your long-term progress and achievement patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {analytics.monthlyTrends.length > 0 ? (
              <div className="space-y-6">
                {/* Enhanced Multi-line Chart with Area Fill */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={analytics.monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        opacity={0.3}
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />

                      {/* Background area for total goals */}
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        fill="url(#monthlyGradient)"
                        name="Total Goals Set"
                        animationDuration={800}
                      />

                      {/* Foreground area for completed goals */}
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="#22c55e"
                        strokeWidth={3}
                        fill="url(#completedGradient)"
                        name="Goals Completed"
                        animationDuration={1200}
                      />

                      {/* Accent line for completed goals */}
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#059669"
                        strokeWidth={4}
                        dot={{ fill: '#22c55e', strokeWidth: 3, r: 6, stroke: '#ffffff' }}
                        activeDot={{ r: 9, stroke: '#22c55e', strokeWidth: 3, fill: '#ffffff', boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)' }}
                        name="Completed"
                        animationDuration={1500}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Best Month */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-2 border-emerald-200 dark:border-emerald-800"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <Star className="w-5 h-5 text-emerald-600" />
                      </motion.div>
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Best Month</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                      {analytics.monthlyTrends.reduce((max, month) =>
                        month.completed > max.completed ? month : max
                      ).month}
                    </div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400">
                      {Math.max(...analytics.monthlyTrends.map(m => m.completed))} goals completed
                    </div>
                  </motion.div>

                  {/* Average Performance */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Target className="w-5 h-5 text-blue-600" />
                      </motion.div>
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Monthly Average</span>
                    </div>
                    <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      {(analytics.monthlyTrends.reduce((sum, month) => sum + month.completed, 0) / analytics.monthlyTrends.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      goals per month
                    </div>
                  </motion.div>

                  {/* Growth Trend */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 border-2 border-violet-200 dark:border-violet-800"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        animate={{ y: [0, -3, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <TrendingUp className="w-5 h-5 text-violet-600" />
                      </motion.div>
                      <span className="text-sm font-medium text-violet-800 dark:text-violet-200">Growth Trend</span>
                    </div>
                    <div className="text-xl font-bold text-violet-700 dark:text-violet-300">
                      {analytics.monthlyTrends.length >= 2
                        ? analytics.monthlyTrends[analytics.monthlyTrends.length - 1].completed >
                          analytics.monthlyTrends[analytics.monthlyTrends.length - 2].completed
                          ? '+' + (analytics.monthlyTrends[analytics.monthlyTrends.length - 1].completed -
                                   analytics.monthlyTrends[analytics.monthlyTrends.length - 2].completed)
                          : (analytics.monthlyTrends[analytics.monthlyTrends.length - 1].completed -
                             analytics.monthlyTrends[analytics.monthlyTrends.length - 2].completed)
                        : '0'
                      }
                    </div>
                    <div className="text-sm text-violet-600 dark:text-violet-400">
                      vs last month
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <TrendingUp className="w-16 h-16 mx-auto opacity-50" />
                  </motion.div>
                  <div>
                    <p className="text-lg font-medium">No monthly data yet</p>
                    <p className="text-sm">Complete goals over time to see growth trends</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <MotivationalQuote variant="compact" />
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Insights & Recommendations
            </CardTitle>
            <CardDescription>
              Based on your goal completion patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {analytics.completionRate > 80 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success/20"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Award className="w-5 h-5 text-success mt-0.5" />
                    </motion.div>
                    <div>
                      <h4 className="font-medium text-success-foreground">
                        Excellent Progress!
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        You're completing over 80% of your goals. Keep up the
                        great work!
                      </p>
                    </div>
                  </motion.div>
                )}

                {analytics.currentStreak >= 7 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-orange-100 dark:bg-orange-900 border border-orange-200 dark:border-orange-800"
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="w-5 h-5 text-orange-500 mt-0.5" />
                    </motion.div>
                    <div>
                      <h4 className="font-medium text-orange-800 dark:text-orange-200">
                        Amazing Streak!
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        You've maintained a {analytics.currentStreak}-day
                        streak. Consistency is key to success!
                      </p>
                    </div>
                  </motion.div>
                )}

                {analytics.completionRate < 50 && analytics.totalGoals > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                  >
                    <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">
                        Room for Improvement
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Consider setting fewer, more achievable goals to build
                        momentum and confidence.
                      </p>
                    </div>
                  </motion.div>
                )}

                {analytics.totalGoals === 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20"
                  >
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Calendar className="w-5 h-5 text-accent-foreground mt-0.5" />
                    </motion.div>
                    <div>
                      <h4 className="font-medium text-accent-foreground">
                        Get Started!
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Start by creating your first goal to see your progress
                        analytics here.
                      </p>
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
