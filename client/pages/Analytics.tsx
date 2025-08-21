import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Calendar, Award, Activity, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import DarkModeToggle from '@/components/DarkModeToggle';
import MotivationalQuote from '@/components/MotivationalQuote';
import MotivationalBackground from '@/components/MotivationalBackground';
import { AnalyticsResponse } from '@shared/api';

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
          </motion.div>
          <div className="text-lg text-muted-foreground">No analytics data available</div>
          <p className="text-sm text-muted-foreground">Create some goals to see your progress!</p>
        </div>
      </div>
    );
  }

  // Chart colors
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
          <p className="text-muted-foreground">Track your progress and analyze your goal completion patterns</p>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="p-2 bg-primary/10 rounded-lg"
              >
                <Target className="h-4 w-4 text-primary" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{analytics.completionRate.toFixed(1)}%</div>
              <Progress value={analytics.completionRate} className="mt-2" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <motion.div
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  rotate: analytics.currentStreak > 0 ? [0, 5, -5, 0] : 0,
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg"
              >
                <Activity className="h-4 w-4 text-orange-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{analytics.currentStreak}</div>
              <p className="text-xs text-muted-foreground">
                days in a row
              </p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-colors" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals Completed</CardTitle>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-success/10 rounded-lg"
              >
                <Award className="h-4 w-4 text-success" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{analytics.goalsCompleted}</div>
              <p className="text-xs text-muted-foreground">
                out of {analytics.totalGoals} total
              </p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-success/5 rounded-full -mr-10 -mt-10 group-hover:bg-success/10 transition-colors" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-accent/10 rounded-lg"
              >
                <TrendingUp className="h-4 w-4 text-accent-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-foreground">{analytics.longestStreak}</div>
              <p className="text-xs text-muted-foreground">
                personal best
              </p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -mr-10 -mt-10 group-hover:bg-accent/10 transition-colors" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Goals by Category
              </CardTitle>
              <CardDescription>
                See how you're progressing across different areas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {analytics.categoryBreakdown.length > 0 ? (
                <div className="space-y-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="completed"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {analytics.categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-3">
                    {analytics.categoryBreakdown.map((category, index) => (
                      <motion.div
                        key={category.category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{category.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">
                            {category.completed}/{category.total}
                          </Badge>
                          <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                            {category.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center space-y-2">
                    <BarChart3 className="w-12 h-12 mx-auto opacity-50" />
                    <p>No category data available</p>
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
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-success/5">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent-foreground" />
                Weekly Progress
              </CardTitle>
              <CardDescription>
                Your goal completion over the last 4 weeks
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {analytics.weeklyTrends.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.weeklyTrends}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="completed" 
                        fill="#22c55e" 
                        name="Completed"
                        radius={[4, 4, 0, 0]}
                        animationDuration={800}
                      />
                      <Bar 
                        dataKey="total" 
                        fill="#e5e7eb" 
                        name="Total"
                        radius={[4, 4, 0, 0]}
                        animationDuration={800}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center space-y-2">
                    <Calendar className="w-12 h-12 mx-auto opacity-50" />
                    <p>No weekly data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader className="bg-gradient-to-r from-success/5 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Monthly Trends
            </CardTitle>
            <CardDescription>
              Goal completion trends over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {analytics.monthlyTrends.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                      name="Total Goals"
                      animationDuration={1000}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="2"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.3}
                      name="Completed Goals"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                <div className="text-center space-y-2">
                  <TrendingUp className="w-12 h-12 mx-auto opacity-50" />
                  <p>No monthly data available</p>
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
                      <h4 className="font-medium text-success-foreground">Excellent Progress!</h4>
                      <p className="text-sm text-muted-foreground">
                        You're completing over 80% of your goals. Keep up the great work!
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
                      <h4 className="font-medium text-orange-800 dark:text-orange-200">Amazing Streak!</h4>
                      <p className="text-sm text-muted-foreground">
                        You've maintained a {analytics.currentStreak}-day streak. Consistency is key to success!
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
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">Room for Improvement</h4>
                      <p className="text-sm text-muted-foreground">
                        Consider setting fewer, more achievable goals to build momentum and confidence.
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
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Calendar className="w-5 h-5 text-accent-foreground mt-0.5" />
                    </motion.div>
                    <div>
                      <h4 className="font-medium text-accent-foreground">Get Started!</h4>
                      <p className="text-sm text-muted-foreground">
                        Start by creating your first goal to see your progress analytics here.
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
