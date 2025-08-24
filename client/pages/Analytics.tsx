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
  Radar,
  Grid,
  Layers,
  Network,
  Map,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ResponsiveContainer,
  Treemap,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
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
            <p className="text-muted-foreground">Create some goals to see unique analytics!</p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = [
    "#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#10b981", 
    "#ec4899", "#f97316", "#6366f1", "#84cc16", "#14b8a6"
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

  // Prepare data for different chart types
  
  // 1. RADAR CHART DATA - Performance across dimensions
  const radarData = [
    { subject: 'Completion Rate', A: analytics.completionRate, fullMark: 100 },
    { subject: 'Consistency', A: Math.min(analytics.currentStreak * 10, 100), fullMark: 100 },
    { subject: 'Goal Variety', A: Math.min(analytics.categoryBreakdown.length * 20, 100), fullMark: 100 },
    { subject: 'Activity Level', A: Math.min(analytics.totalGoals * 10, 100), fullMark: 100 },
    { subject: 'Recent Progress', A: analytics.weeklyTrends.length > 0 ? analytics.weeklyTrends[analytics.weeklyTrends.length - 1]?.completed * 25 : 0, fullMark: 100 },
  ];

  // 2. TREEMAP DATA - Category sizes by goals
  const treemapData = analytics.categoryBreakdown.map((cat, index) => ({
    name: cat.category,
    size: cat.total,
    completed: cat.completed,
    fill: COLORS[index % COLORS.length]
  }));

  // 3. FUNNEL DATA - Goal completion pipeline
  const funnelData = [
    { name: 'Goals Created', value: analytics.totalGoals, fill: COLORS[0] },
    { name: 'Goals Started', value: Math.max(analytics.totalGoals - 1, analytics.goalsCompleted), fill: COLORS[1] },
    { name: 'Goals Completed', value: analytics.goalsCompleted, fill: COLORS[2] },
  ];

  // 4. BUBBLE CHART DATA - Category performance vs effort
  const bubbleData = analytics.categoryBreakdown.map((cat, index) => ({
    x: cat.total, // Number of goals
    y: cat.percentage, // Completion rate
    z: cat.completed, // Bubble size
    name: cat.category,
    fill: COLORS[index % COLORS.length]
  }));

  // 5. CALENDAR HEATMAP DATA - Streak visualization
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Advanced Analytics Hub
        </h1>
        <p className="text-lg text-muted-foreground">
          Unique visualizations for deeper insights into your goals
        </p>
      </motion.div>

      {/* Chart Grid with 6 Different Chart Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. RADAR CHART - Performance Spider */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Radar className="w-6 h-6 text-purple-600" />
                </div>
                Performance Spider
              </CardTitle>
              <CardDescription>Multi-dimensional performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} />
                    <PolarRadiusAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickCount={5}
                    />
                    <RechartsRadar
                      name="Performance"
                      dataKey="A"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. TREEMAP - Category Landscape */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                  <Grid className="w-6 h-6 text-cyan-600" />
                </div>
                Category Landscape
              </CardTitle>
              <CardDescription>Hierarchical view of your goal categories</CardDescription>
            </CardHeader>
            <CardContent>
              {treemapData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={treemapData}
                      dataKey="size"
                      ratio={4/3}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {treemapData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm">Total Goals: {data.size}</p>
                                <p className="text-sm">Completed: {data.completed}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </Treemap>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No category data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. FUNNEL CHART - Goal Pipeline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:to-yellow-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Layers className="w-6 h-6 text-orange-600" />
                </div>
                Goal Pipeline
              </CardTitle>
              <CardDescription>Your goal completion funnel</CardDescription>
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
                      <LabelList position="center" fill="#fff" stroke="none" fontSize={14} />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 4. BUBBLE CHART - Category Performance Matrix */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                Performance Matrix
              </CardTitle>
              <CardDescription>Category goals vs completion rate</CardDescription>
            </CardHeader>
            <CardContent>
              {bubbleData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={bubbleData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Total Goals"
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Completion %"
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <ZAxis type="number" dataKey="z" range={[50, 400]} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm">Total Goals: {data.x}</p>
                                <p className="text-sm">Completion: {data.y.toFixed(1)}%</p>
                                <p className="text-sm">Completed: {data.z}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter dataKey="y" fill="#10b981" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No performance data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 5. CALENDAR HEATMAP - Activity Pattern */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-pink-600" />
                </div>
                Activity Heatmap
              </CardTitle>
              <CardDescription>Daily goal completion patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs text-center text-muted-foreground p-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarData.map((day, index) => (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.01 * index }}
                      className="aspect-square rounded-sm cursor-pointer hover:ring-2 hover:ring-pink-400"
                      style={{
                        backgroundColor: day.completed 
                          ? `rgba(236, 72, 153, ${day.intensity})` 
                          : `rgba(156, 163, 175, ${day.intensity * 0.3})`
                      }}
                      title={`${day.date}: ${day.completed ? 'Goals completed' : 'No activity'}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>6 weeks ago</span>
                  <div className="flex items-center gap-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                      {[0.2, 0.4, 0.6, 0.8].map((opacity, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: `rgba(236, 72, 153, ${opacity})` }}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 6. NETWORK GRAPH - Goal Relationships */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="h-full bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Network className="w-6 h-6 text-indigo-600" />
                </div>
                Goal Network
              </CardTitle>
              <CardDescription>Interconnected view of your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 relative overflow-hidden">
                <svg className="w-full h-full">
                  {/* Central hub */}
                  <motion.circle
                    initial={{ r: 0 }}
                    animate={{ r: 30 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    cx="50%"
                    cy="50%"
                    fill="#6366f1"
                    className="drop-shadow-lg"
                  />
                  <text x="50%" y="50%" textAnchor="middle" dy="5" className="text-white text-sm font-bold">
                    You
                  </text>
                  
                  {/* Category nodes */}
                  {analytics.categoryBreakdown.map((category, index) => {
                    const angle = (index / analytics.categoryBreakdown.length) * 2 * Math.PI;
                    const radius = 100;
                    const x = 50 + Math.cos(angle) * radius;
                    const y = 50 + Math.sin(angle) * radius;
                    const nodeSize = Math.max(category.total * 3, 15);
                    
                    return (
                      <g key={category.category}>
                        {/* Connection line */}
                        <motion.line
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                          x1="50%"
                          y1="50%"
                          x2={`${x}%`}
                          y2={`${y}%`}
                          stroke="#94a3b8"
                          strokeWidth={category.completed + 1}
                          opacity={0.6}
                        />
                        
                        {/* Category node */}
                        <motion.circle
                          initial={{ r: 0 }}
                          animate={{ r: nodeSize }}
                          transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                          cx={`${x}%`}
                          cy={`${y}%`}
                          fill={COLORS[index % COLORS.length]}
                          className="drop-shadow-md cursor-pointer hover:opacity-80"
                        />
                        
                        {/* Label */}
                        <text 
                          x={`${x}%`} 
                          y={`${y + 8}%`} 
                          textAnchor="middle" 
                          className="text-xs font-medium fill-current"
                        >
                          {category.category.slice(0, 8)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
                  <p>Node size = Goal count</p>
                  <p>Line thickness = Completed goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-fuchsia-950/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                <Brain className="w-6 h-6 text-violet-600" />
              </div>
              Analytics Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-violet-600">{analytics.completionRate.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">{analytics.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-fuchsia-600">{analytics.categoryBreakdown.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-pink-600">{analytics.totalGoals}</div>
                <div className="text-sm text-muted-foreground">Total Goals</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <MotivationalQuote variant="compact" />
      </motion.div>
    </div>
  );
}
