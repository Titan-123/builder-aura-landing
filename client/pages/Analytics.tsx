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
  Heart,
  Compass,
  Lightbulb,
  Trophy,
  Rocket,
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
  ScatterChart,
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

  // Dynamic chart logic based on data patterns
  const getChartConfig = () => {
    const hasCategories = analytics.categoryBreakdown.length > 0;
    const hasWeeklyData = analytics.weeklyTrends.length > 0;
    const hasMonthlyData = analytics.monthlyTrends.length > 0;
    const hasStreak = analytics.currentStreak > 0;
    const completionRate = analytics.completionRate;
    const totalGoals = analytics.totalGoals;
    
    // Determine chart types based on data
    const charts = [];
    
    // Chart 1 - Category Analysis (varies by category count)
    if (hasCategories) {
      if (analytics.categoryBreakdown.length <= 2) {
        charts.push({
          type: 'radialProgress',
          title: 'Goal Focus Areas',
          icon: Target,
          description: 'Concentrated progress tracking'
        });
      } else if (analytics.categoryBreakdown.length <= 4) {
        charts.push({
          type: 'gaugeCluster',
          title: 'Category Performance',
          icon: Activity,
          description: 'Multi-gauge performance view'
        });
      } else if (analytics.categoryBreakdown.length > 6) {
        charts.push({
          type: 'sunburst',
          title: 'Category Universe',
          icon: Compass,
          description: 'Hierarchical category breakdown'
        });
      } else {
        charts.push({
          type: 'donut',
          title: 'Category Distribution',
          icon: Eye,
          description: 'Visual category breakdown'
        });
      }
    }
    
    // Chart 2 - Time-based Analysis (varies by streak and completion rate)
    if (hasWeeklyData || hasMonthlyData) {
      if (hasStreak && analytics.currentStreak >= 7) {
        charts.push({
          type: 'streakHeatmap',
          title: 'Consistency Heatmap',
          icon: Flame,
          description: 'Your streak patterns'
        });
      } else if (completionRate > 70) {
        charts.push({
          type: 'progressRiver',
          title: 'Success Flow',
          icon: TrendingUp,
          description: 'Your improvement stream'
        });
      } else if (hasWeeklyData && analytics.weeklyTrends.length <= 4) {
        charts.push({
          type: 'weeklyCards',
          title: 'Weekly Snapshots',
          icon: Calendar,
          description: 'Recent weekly performance'
        });
      } else {
        charts.push({
          type: 'areaChart',
          title: 'Progress Wave',
          icon: Activity,
          description: 'Goal completion flow'
        });
      }
    }
    
    // Chart 3 - Achievement Analysis (varies by total goals and completion)
    if (totalGoals > 15) {
      charts.push({
        type: 'scatterPlot',
        title: 'Goal Galaxy',
        icon: Star,
        description: 'Achievement constellation'
      });
    } else if (completionRate > 60) {
      charts.push({
        type: 'progressSpiral',
        title: 'Growth Spiral',
        icon: Rocket,
        description: 'Your improvement journey'
      });
    } else if (hasMonthlyData) {
      charts.push({
        type: 'trendComparison',
        title: 'Growth Analysis',
        icon: TrendingUp,
        description: 'Long-term trend analysis'
      });
    }
    
    // Chart 4 - Motivational/Insight Chart (always different)
    const motivationalCharts = [
      {
        type: 'achievementBurst',
        title: 'Achievement Burst',
        icon: Sparkles,
        description: 'Your success celebration'
      },
      {
        type: 'energyMeter',
        title: 'Goal Energy',
        icon: Zap,
        description: 'Your motivation levels'
      },
      {
        type: 'wisdomTree',
        title: 'Progress Tree',
        icon: Brain,
        description: 'Growing your success'
      },
      {
        type: 'heartbeat',
        title: 'Success Pulse',
        icon: Heart,
        description: 'Your achievement rhythm'
      }
    ];
    
    // Select motivational chart based on completion rate
    const motivationalIndex = Math.floor(completionRate / 25);
    charts.push(motivationalCharts[Math.min(motivationalIndex, 3)]);
    
    // Ensure we have at least 2 charts
    if (charts.length < 2) {
      charts.push({
        type: 'emptyInsight',
        title: 'Ready for Growth',
        icon: Lightbulb,
        description: 'Create more goals to unlock insights'
      });
    }
    
    return charts;
  };

  const chartConfig = getChartConfig();

  const renderChart = (config: any, index: number) => {
    const IconComponent = config.icon;
    
    switch (config.type) {
      case 'radialProgress':
        return (
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-border/50 hover:border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="w-6 h-6 text-primary" />
                {config.title}
              </CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {analytics.categoryBreakdown.map((category, idx) => (
                  <div key={category.category} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.category}</span>
                      <span className="text-lg font-bold" style={{ color: COLORS[idx] }}>
                        {category.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="relative">
                      <svg className="w-full h-20" viewBox="0 0 200 80">
                        <path
                          d="M 20 60 Q 100 20 180 60"
                          stroke="hsl(var(--muted))"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <motion.path
                          d="M 20 60 Q 100 20 180 60"
                          stroke={COLORS[idx]}
                          strokeWidth="8"
                          fill="transparent"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 300" }}
                          animate={{ strokeDasharray: `${(category.percentage / 100) * 300} 300` }}
                          transition={{ duration: 2, delay: 0.3 * idx }}
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'gaugeCluster':
        return (
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="w-6 h-6 text-primary" />
                {config.title}
              </CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                {analytics.categoryBreakdown.map((category, idx) => (
                  <div key={category.category} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="hsl(var(--muted))"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={COLORS[idx]}
                          strokeWidth="8"
                          fill="transparent"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 251" }}
                          animate={{ strokeDasharray: `${(category.percentage / 100) * 251} 251` }}
                          transition={{ duration: 1.5, delay: 0.2 * idx }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold" style={{ color: COLORS[idx] }}>
                          {category.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{category.category}</div>
                    <div className="text-xs text-muted-foreground">{category.completed}/{category.total}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'streakHeatmap':
        return (
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="w-6 h-6 text-orange-600" />
                {config.title}
              </CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, dayIndex) => {
                    const intensity = Math.random();
                    const isToday = dayIndex === 34;
                    return (
                      <motion.div
                        key={dayIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.02 * dayIndex }}
                        className={`aspect-square rounded-sm ${isToday ? 'ring-2 ring-orange-400' : ''}`}
                        style={{
                          backgroundColor: intensity > 0.8 ? '#ea580c' : 
                                         intensity > 0.6 ? '#f97316' : 
                                         intensity > 0.4 ? '#fb923c' : 
                                         intensity > 0.2 ? '#fed7aa' : '#f3f4f6'
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 weeks ago</span>
                  <span>Today</span>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{analytics.currentStreak}</div>
                  <div className="text-sm text-orange-600">day streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'progressRiver':
        return (
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="w-6 h-6 text-blue-600" />
                {config.title}
              </CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.weeklyTrends}>
                    <defs>
                      <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#3b82f6"
                      fill="url(#riverGradient)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      case 'scatterPlot':
        const scatterData = analytics.categoryBreakdown.map((cat, idx) => ({
          x: cat.total,
          y: cat.completed,
          z: cat.percentage,
          category: cat.category
        }));
        
        return (
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="w-6 h-6 text-violet-600" />
                {config.title}
              </CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={scatterData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="x" name="Total Goals" />
                    <YAxis dataKey="y" name="Completed" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-3 border rounded-lg shadow-lg">
                              <p className="font-medium">{data.category}</p>
                              <p className="text-sm">Completed: {data.y}/{data.x}</p>
                              <p className="text-sm">Rate: {data.z.toFixed(1)}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter dataKey="y" fill="#8b5cf6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      case 'achievementBurst':
        return (
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="w-6 h-6 text-yellow-600" />
                {config.title}
              </CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative h-80 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-lg overflow-hidden">
                {Array.from({ length: analytics.goalsCompleted }).map((_, starIndex) => {
                  const angle = (starIndex / analytics.goalsCompleted) * 360;
                  const radius = 50 + (starIndex % 3) * 30;
                  const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
                  const y = 50 + Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <motion.div
                      key={starIndex}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.1 * starIndex, 
                        type: "spring",
                        bounce: 0.6 
                      }}
                      className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                      style={{
                        left: `${Math.min(Math.max(x, 5), 95)}%`,
                        top: `${Math.min(Math.max(y, 5), 95)}%`,
                        boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)'
                      }}
                    />
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white bg-black/20 backdrop-blur-sm rounded-lg p-4">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl font-bold"
                    >
                      {analytics.goalsCompleted}
                    </motion.div>
                    <div className="text-sm opacity-80">achievements</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <IconComponent className="w-16 h-16 mx-auto opacity-50" />
                </motion.div>
                <div>
                  <p className="text-lg font-medium">{config.title}</p>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
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
            Dynamic Analytics
          </h1>
          <p className="text-muted-foreground">
            Charts that adapt to your unique goal patterns and progress
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <motion.div whileHover={{ scale: 1.2, rotate: 15 }}>
                <Target className="h-5 w-5 text-primary" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                {analytics.completionRate.toFixed(1)}%
              </div>
              <Progress value={analytics.completionRate} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50/50 via-card to-orange-50/50 dark:from-orange-950/20 dark:to-orange-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Activity className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {analytics.currentStreak}
              </div>
              <p className="text-xs text-muted-foreground">consecutive days</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50/50 via-card to-emerald-50/50 dark:from-emerald-950/20 dark:to-emerald-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Goals Completed</CardTitle>
              <Award className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {analytics.goalsCompleted}
              </div>
              <p className="text-xs text-muted-foreground">
                out of {analytics.totalGoals} total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 via-card to-violet-50/50 dark:from-violet-950/20 dark:to-violet-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
              <TrendingUp className="h-5 w-5 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 mb-2">
                {analytics.longestStreak}
              </div>
              <p className="text-xs text-muted-foreground">personal record</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dynamic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartConfig.map((config, index) => (
          <motion.div
            key={`${config.type}-${index}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            {renderChart(config, index)}
          </motion.div>
        ))}
      </div>

      {/* Additional Chart Row for More Data */}
      {analytics.monthlyTrends.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Monthly Journey
              </CardTitle>
              <CardDescription>Your long-term achievement pattern</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analytics.monthlyTrends}>
                    <defs>
                      <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#94a3b8"
                      fill="url(#monthlyGradient)"
                      name="Total Goals"
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }}
                      name="Completed"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <MotivationalQuote variant="compact" />
      </motion.div>

      {/* Dynamic Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" />
              Smart Insights
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.completionRate > 80 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <Trophy className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
                      High Achiever!
                    </h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      You're in the top performance zone. Consider setting more challenging goals.
                    </p>
                  </div>
                </div>
              )}

              {analytics.currentStreak >= 7 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <Flame className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800 dark:text-orange-200">
                      Consistency Master
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Your {analytics.currentStreak}-day streak shows excellent discipline. Keep it up!
                    </p>
                  </div>
                </div>
              )}

              {analytics.categoryBreakdown.length > 3 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <Compass className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">
                      Diverse Goals
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      You're working on {analytics.categoryBreakdown.length} different areas. Great for balanced growth!
                    </p>
                  </div>
                </div>
              )}

              {analytics.completionRate < 50 && analytics.totalGoals > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-violet-100 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                  <Lightbulb className="w-5 h-5 text-violet-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-violet-800 dark:text-violet-200">
                      Focus Opportunity
                    </h4>
                    <p className="text-sm text-violet-700 dark:text-violet-300">
                      Try focusing on fewer goals to improve completion rate and build momentum.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
