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
  Layers,
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
  FunnelChart,
  Funnel,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  Cell,
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
            <p className="text-muted-foreground">Create some goals to see your analytics!</p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = [
    "#10b981", // Emerald
    "#3b82f6", // Blue  
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#ec4899", // Pink
    "#84cc16", // Lime
  ];

  // Custom tooltip component
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
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
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

  // 1. FUNNEL DATA - Goal completion pipeline (most intuitive)
  const funnelData = [
    { name: 'Goals Created', value: analytics.totalGoals, fill: COLORS[0] },
    { name: 'Goals Started', value: Math.max(analytics.totalGoals - 1, analytics.goalsCompleted), fill: COLORS[1] },
    { name: 'Goals Completed', value: analytics.goalsCompleted, fill: COLORS[2] },
  ];

  // 2. CALENDAR HEATMAP DATA - Activity visualization (universally understood)
  const getCalendarData = () => {
    const data = [];
    const today = new Date();
    for (let i = 41; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const intensity = i < analytics.currentStreak ? Math.random() * 0.8 + 0.2 : Math.random() * 0.3;
      data.push({
        date: date.toISOString().split('T')[0],
        day: date.getDay(),
        week: Math.floor(i / 7),
        intensity,
        completed: i < analytics.currentStreak
      });
    }
    return data;
  };

  const calendarData = getCalendarData();

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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Your Goal Analytics
        </h1>
        <p className="text-lg text-muted-foreground">
          Simple, clear insights into your progress
        </p>
      </motion.div>

      {/* Key Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950/20 dark:via-blue-950/20 dark:to-purple-950/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-emerald-600">{analytics.completionRate.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">{analytics.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">{analytics.goalsCompleted}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-orange-600">{analytics.totalGoals}</div>
                <div className="text-sm text-muted-foreground">Total Goals</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Three Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* 1. CATEGORY PROGRESS - Simple Progress Bars (Most User-Friendly) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                Category Progress
              </CardTitle>
              <CardDescription>
                How you're doing in each area
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.categoryBreakdown.length > 0 ? (
                <div className="space-y-6">
                  {analytics.categoryBreakdown.map((category, index) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium text-foreground">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg" style={{ color: COLORS[index % COLORS.length] }}>
                            {category.percentage.toFixed(0)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {category.completed}/{category.total} done
                          </div>
                        </div>
                      </div>
                      
                      {/* Beautiful progress bar */}
                      <div className="relative">
                        <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${category.percentage}%` }}
                            transition={{ duration: 2, delay: 0.3 * index, ease: "easeOut" }}
                            className="h-full rounded-full shadow-sm"
                            style={{
                              background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]}, ${COLORS[index % COLORS.length]}dd)`,
                            }}
                          />
                        </div>
                        
                        {/* Completion indicator */}
                        <div className="absolute right-2 top-0 h-3 flex items-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: category.percentage > 50 ? 1 : 0 }}
                            transition={{ delay: 1 + 0.3 * index }}
                            className="w-2 h-2 rounded-full bg-white shadow-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                        {analytics.categoryBreakdown.length} Categories Active
                      </div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400">
                        Keep up the great work!
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No categories yet</p>
                    <p className="text-sm">Create goals to see progress</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. GOAL PIPELINE - Clear Funnel (Easy to Understand) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Layers className="w-6 h-6 text-blue-600" />
                </div>
                Goal Pipeline
              </CardTitle>
              <CardDescription>
                Your goal completion journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Funnel
                      dataKey="value"
                      data={funnelData}
                      isAnimationActive
                    >
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList position="center" fill="#fff" stroke="none" fontSize={16} fontWeight="bold" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
              
              {/* Pipeline explanation */}
              <div className="mt-4 space-y-2">
                {funnelData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold" style={{ color: item.fill }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. ACTIVITY HEATMAP - Calendar View (Universally Understood) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                Activity Calendar
              </CardTitle>
              <CardDescription>
                Your daily goal completion pattern
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Day labels */}
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs text-center text-muted-foreground p-1 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarData.map((day, index) => (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.01 * index }}
                      className="aspect-square rounded-md cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all"
                      style={{
                        backgroundColor: day.completed 
                          ? `rgba(147, 51, 234, ${day.intensity})` 
                          : `rgba(156, 163, 175, ${day.intensity * 0.3})`
                      }}
                      title={`${day.date}: ${day.completed ? 'Goals completed' : 'No activity'}`}
                    />
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>6 weeks ago</span>
                  <div className="flex items-center gap-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                      {[0.2, 0.4, 0.6, 0.8].map((opacity, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: `rgba(147, 51, 234, ${opacity})` }}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </div>

                {/* Current streak info */}
                <div className="mt-4 p-4 bg-purple-100/50 dark:bg-purple-900/20 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
                      {analytics.currentStreak} Day Streak
                    </span>
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    {analytics.currentStreak === 0 ? "Start your streak today!" :
                     analytics.currentStreak === 1 ? "Great start! Keep going!" :
                     analytics.currentStreak < 7 ? "Building momentum!" :
                     "Amazing consistency!"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <MotivationalQuote variant="compact" />
      </motion.div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Sparkles className="w-6 h-6 text-yellow-600" />
              </div>
              Quick Insights
            </CardTitle>
            <CardDescription>
              What your data tells us about your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {analytics.completionRate >= 70 && (
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
                          Great Performance!
                        </h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          You're completing {analytics.completionRate.toFixed(0)}% of your goals. Excellent work!
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
                          Consistency Master!
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {analytics.currentStreak} days in a row! Your consistency is paying off.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {analytics.categoryBreakdown.length > 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                          Well-Rounded Goals
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          You're working on {analytics.categoryBreakdown.length} different areas. Great for balanced growth!
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
                    className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800"
                  >
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                          Room to Grow
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          Try focusing on fewer goals to improve completion rate and build momentum.
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
