import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Target, CheckCircle2, TrendingUp, AlertCircle, Zap, Star, ArrowRight, Activity, Award, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AchievementBadge, { useAchievements } from '@/components/AchievementBadge';
import MotivationalQuote from '@/components/MotivationalQuote';
import { triggerMotivationalCelebration, MotivationalProgress } from '@/components/MotivationalCelebration';
import MotivationalBackground from '@/components/MotivationalBackground';
import { Goal, CreateGoalRequest, AnalyticsResponse } from '@shared/api';

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [streaks, setStreaks] = useState<{dailyStreak: number, weeklyStreak: number, monthlyStreak: number} | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for quick goal creation
  const [newGoal, setNewGoal] = useState<CreateGoalRequest>({
    title: '',
    description: '',
    category: '',
    type: 'daily',
    timeAllotted: 30,
    deadline: new Date().toISOString().split('T')[0]
  });

  const achievements = useAchievements(goals, analytics);

  useEffect(() => {
    fetchGoals();
    fetchAnalytics();
    fetchStreaks();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/goals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const fetchStreaks = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/streaks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStreaks(data);
      }
    } catch (error) {
      console.error('Failed to fetch streaks:', error);
    }
  };

  const createGoal = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newGoal)
      });
      
      if (response.ok) {
        await fetchGoals();
        await fetchAnalytics();
        setIsCreateOpen(false);
        setNewGoal({
          title: '',
          description: '',
          category: '',
          type: 'daily',
          timeAllotted: 30,
          deadline: new Date().toISOString().split('T')[0]
        });
        
        toast.success('Goal created successfully! 🎯');
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const toggleGoalCompletion = async (goalId: string, completed: boolean) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed })
      });
      
      if (response.ok) {
        await fetchGoals();
        await fetchAnalytics();
        
        if (completed) {
          const goalData = goals.find(g => g.id === goalId);
          triggerMotivationalCelebration({
            goalTitle: goalData?.title || 'Goal',
            streak: goalData?.streak || 0,
            isFirstGoal: goals.filter(g => g.completed).length === 0,
            category: goalData?.category
          });
        }
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
      toast.error('Failed to update goal');
    }
  };

  // Calculate dashboard insights
  const todayGoals = goals.filter(g => {
    const today = new Date().toDateString();
    return new Date(g.deadline).toDateString() === today;
  });

  const overdueGoals = goals.filter(g => 
    new Date(g.deadline) < new Date() && !g.completed
  );

  const upcomingGoals = goals.filter(g => {
    const goalDate = new Date(g.deadline);
    const today = new Date();
    const diffTime = goalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3 && !g.completed;
  });

  const upcomingDeadlines = goals
    .filter(g => {
      if (g.completed) return false;
      const goalDate = new Date(g.deadline);
      const today = new Date();
      const diffTime = goalDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7; // Next 7 days
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const completedGoals = goals.filter(g => g.completed);
  const completionRate = goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0;


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
      <MotivationalBackground variant="floating" intensity="low" />

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome Back! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's your goal progress overview for today
        </p>
      </motion.div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{completionRate.toFixed(0)}%</div>
              <Progress value={completionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedGoals.length} of {goals.length} goals completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Focus</CardTitle>
              <Calendar className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{todayGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayGoals.filter(g => g.completed).length} completed today
              </p>
              {todayGoals.length > 0 && (
                <Progress 
                  value={(todayGoals.filter(g => g.completed).length / todayGoals.length) * 100} 
                  className="mt-2" 
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Zap className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{analytics?.currentStreak || 0}</div>
              <p className="text-xs text-muted-foreground">days in a row</p>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: Math.min(analytics?.currentStreak || 0, 7) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-orange-500 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{overdueGoals.length}</div>
              <p className="text-xs text-muted-foreground">overdue goals</p>
              {upcomingGoals.length > 0 && (
                <p className="text-xs text-yellow-600 mt-1">
                  + {upcomingGoals.length} due soon
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MotivationalQuote variant="banner" />
      </motion.div>

      {/* Today's Priority Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Goals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-blue-500" />
                  Today's Goals
                </CardTitle>
                <CardDescription>Goals due today that need your attention</CardDescription>
              </div>
              <Link to="/goals">
                <Button variant="outline" size="sm" className="gap-2">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {todayGoals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p>All caught up for today! 🎉</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayGoals.slice(0, 3).map((goal) => (
                    <motion.div
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        goal.completed
                          ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                          : 'bg-muted/50 border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleGoalCompletion(goal.id, !goal.completed)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            goal.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-muted-foreground hover:border-primary'
                          }`}>
                            {goal.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <p className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {goal.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {goal.timeAllotted}m
                              {goal.category && (
                                <Badge variant="outline" className="text-xs">
                                  {goal.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {todayGoals.length > 3 && (
                    <Link to="/goals">
                      <Button variant="ghost" className="w-full text-sm">
                        +{todayGoals.length - 3} more goals
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Goals due in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">No upcoming deadlines - you're all set! 🎉</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingDeadlines.map((goal) => {
                    const goalDate = new Date(goal.deadline);
                    const today = new Date();
                    const diffTime = goalDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    let urgencyColor = 'text-muted-foreground';
                    let urgencyBg = 'bg-muted/20';
                    let urgencyText = `${diffDays} days`;

                    if (diffDays === 0) {
                      urgencyColor = 'text-red-600';
                      urgencyBg = 'bg-red-50 dark:bg-red-950/20';
                      urgencyText = 'Due today';
                    } else if (diffDays === 1) {
                      urgencyColor = 'text-orange-600';
                      urgencyBg = 'bg-orange-50 dark:bg-orange-950/20';
                      urgencyText = 'Due tomorrow';
                    } else if (diffDays <= 3) {
                      urgencyColor = 'text-yellow-600';
                      urgencyBg = 'bg-yellow-50 dark:bg-yellow-950/20';
                    }

                    return (
                      <motion.div
                        key={goal.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 rounded-lg border transition-all cursor-pointer ${urgencyBg} border-border hover:border-primary/50`}
                        onClick={() => toggleGoalCompletion(goal.id, true)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{goal.title}</p>
                            <div className="flex items-center gap-2 text-xs mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{goal.timeAllotted}m</span>
                              {goal.category && (
                                <Badge variant="outline" className="text-xs">
                                  {goal.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${urgencyColor}`}>
                              {urgencyText}
                            </span>
                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground hover:border-primary flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  {goals.filter(g => !g.completed && new Date(g.deadline) > new Date()).length > upcomingDeadlines.length && (
                    <Link to="/goals">
                      <Button variant="ghost" className="w-full text-sm">
                        View all pending goals
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Motivational Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <MotivationalProgress
          completionRate={completionRate}
          totalGoals={goals.length}
          streak={analytics?.currentStreak || 0}
        />
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements & Progress
              </CardTitle>
              <CardDescription>
                Your accomplishments and what's coming next
              </CardDescription>
            </div>
            <Link to="/analytics">
              <Button variant="outline" size="sm" className="gap-2">
                View Analytics <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Unlocked Achievements */}
              {achievements.some(a => a.unlocked) && (
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Unlocked ({achievements.filter(a => a.unlocked).length})
                  </h4>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {achievements
                      .filter(a => a.unlocked)
                      .map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <AchievementBadge achievement={achievement} size="sm" />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Next Achievements */}
              {achievements.some(a => !a.unlocked) && (
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    Coming Next ({achievements.filter(a => !a.unlocked).length})
                  </h4>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {achievements
                      .filter(a => !a.unlocked)
                      .slice(0, 8)
                      .map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <AchievementBadge achievement={achievement} size="sm" />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {achievements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-3" />
                  <p>Complete goals to unlock achievements!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Goal Creation Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Quick Goal Creation</DialogTitle>
            <DialogDescription>
              Create a new goal quickly from your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="Enter goal title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Describe your goal"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  placeholder="e.g., Health, Work"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newGoal.type} onValueChange={(value: any) => setNewGoal({...newGoal, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="timeAllotted">Time (minutes)</Label>
                <Input
                  id="timeAllotted"
                  type="number"
                  value={newGoal.timeAllotted}
                  onChange={(e) => setNewGoal({...newGoal, timeAllotted: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createGoal}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
