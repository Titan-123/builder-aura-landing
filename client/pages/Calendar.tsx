import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Target, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DarkModeToggle from '@/components/DarkModeToggle';
import { Goal } from '@shared/api';

export default function Calendar() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
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
    } finally {
      setLoading(false);
    }
  };

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Calendar calculations
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get goals for a specific date
  const getGoalsForDate = (date: Date) => {
    return goals.filter(goal => {
      if (!goal.completedAt) return false;
      const completedDate = new Date(goal.completedAt);
      return (
        completedDate.getDate() === date.getDate() &&
        completedDate.getMonth() === date.getMonth() &&
        completedDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Calculate streak for date
  const getStreakForDate = (date: Date) => {
    const dateGoals = getGoalsForDate(date);
    if (dateGoals.length === 0) return 0;
    return Math.max(...dateGoals.map(g => g.streak));
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
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    calendarDays.push({ date, isCurrentMonth: true });
  }

  // Next month's leading days
  const remainingDays = 42 - calendarDays.length; // 6 rows × 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return selectedDate &&
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  // Monthly stats
  const monthlyStats = {
    totalGoals: goals.filter(g => {
      const goalDate = new Date(g.createdAt);
      return goalDate.getMonth() === currentDate.getMonth() &&
             goalDate.getFullYear() === currentDate.getFullYear();
    }).length,
    completedGoals: goals.filter(g => g.completed && g.completedAt && 
      new Date(g.completedAt).getMonth() === currentDate.getMonth() &&
      new Date(g.completedAt).getFullYear() === currentDate.getFullYear()
    ).length,
    activeDays: new Set(
      goals
        .filter(g => g.completed && g.completedAt && 
          new Date(g.completedAt).getMonth() === currentDate.getMonth() &&
          new Date(g.completedAt).getFullYear() === currentDate.getFullYear()
        )
        .map(g => new Date(g.completedAt!).getDate())
    ).size,
    bestStreak: Math.max(0, ...goals.map(g => g.streak))
  };

  const completionRate = monthlyStats.totalGoals > 0 
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
          <p className="text-muted-foreground">Track your daily progress and streaks</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden">
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
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </CardTitle>
                      <CardDescription>
                        {monthlyStats.activeDays} active days this month
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" onClick={goToToday}>
                        Today
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" onClick={goToNextMonth}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map(day => (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 text-center text-sm font-semibold text-muted-foreground"
                    >
                      {day}
                    </motion.div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  <AnimatePresence>
                    {calendarDays.map(({ date, isCurrentMonth }, index) => {
                      const dayGoals = getGoalsForDate(date);
                      const streak = getStreakForDate(date);
                      const hasGoals = dayGoals.length > 0;

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
                            relative min-h-[90px] p-3 border rounded-lg transition-all duration-300 cursor-pointer
                            ${isCurrentMonth ? 'bg-background hover:bg-accent/50' : 'bg-muted/30 hover:bg-muted/50'}
                            ${isToday(date) ? 'ring-2 ring-primary shadow-lg' : ''}
                            ${isSelected(date) ? 'ring-2 ring-accent shadow-lg bg-accent/20' : ''}
                            ${hasGoals ? 'bg-success/10 border-success/30 hover:bg-success/20' : 'border-border hover:border-accent'}
                          `}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`text-sm font-medium ${
                              isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                            } ${isToday(date) ? 'text-primary font-bold' : ''}`}>
                              {date.getDate()}
                            </span>
                            {streak > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-full"
                              >
                                <Flame className="w-3 h-3 text-orange-500" />
                                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                  {streak}
                                </span>
                              </motion.div>
                            )}
                          </div>
                          
                          {hasGoals && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-1"
                            >
                              {dayGoals.slice(0, 2).map((goal, goalIndex) => (
                                <motion.div
                                  key={goalIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: goalIndex * 0.1 }}
                                  className="text-xs p-1.5 rounded-md bg-success/20 text-success-foreground truncate border border-success/30"
                                  title={goal.title}
                                >
                                  {goal.title}
                                </motion.div>
                              ))}
                              {dayGoals.length > 2 && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-xs text-muted-foreground font-medium"
                                >
                                  +{dayGoals.length - 2} more
                                </motion.div>
                              )}
                            </motion.div>
                          )}

                          {/* Today indicator */}
                          {isToday(date) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
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
        <div className="space-y-6">
          {/* Monthly Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-bold text-lg text-primary">
                      {completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={completionRate} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold text-primary">
                      {monthlyStats.completedGoals}
                    </div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="text-2xl font-bold text-accent-foreground">
                      {monthlyStats.activeDays}
                    </div>
                    <div className="text-xs text-muted-foreground">Active Days</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-medium">Best Streak</span>
                  </div>
                  <span className="font-bold text-lg text-orange-600 dark:text-orange-400">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-success/20 border border-success/30 flex-shrink-0"></div>
                  <span className="text-sm">Day with completed goals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded ring-2 ring-primary flex-shrink-0"></div>
                  <span className="text-sm">Today</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded ring-2 ring-accent flex-shrink-0"></div>
                  <span className="text-sm">Selected date</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-full">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span className="text-xs font-medium">3</span>
                  </div>
                  <span className="text-sm">Streak count</span>
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
              <Card className="border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getGoalsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-2">
                      {getGoalsForDate(selectedDate).map((goal, index) => (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 rounded-lg bg-success/10 border border-success/20"
                        >
                          <h4 className="font-medium text-success-foreground">{goal.title}</h4>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                          <Badge variant="outline" className="mt-2">
                            {goal.category}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No goals completed on this date</p>
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
