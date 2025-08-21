import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Target, CheckCircle2, Edit, Trash2, Filter, Search, Grid, List, Columns, AlertCircle, Flag, Star, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { triggerMotivationalCelebration } from '@/components/MotivationalCelebration';
import MotivationalQuote from '@/components/MotivationalQuote';
import MotivationalBackground from '@/components/MotivationalBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Goal, CreateGoalRequest } from '@shared/api';

type ViewMode = 'grid' | 'list' | 'board';
type Priority = 'low' | 'medium' | 'high';

interface EnhancedGoal extends Goal {
  priority?: Priority;
}

export default function Goals() {
  const [goals, setGoals] = useState<EnhancedGoal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<EnhancedGoal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<EnhancedGoal | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'created' | 'category'>('deadline');

  // Form state
  const [newGoal, setNewGoal] = useState<CreateGoalRequest & { priority?: Priority }>({
    title: '',
    description: '',
    category: '',
    type: 'daily',
    timeAllotted: 30,
    deadline: new Date().toISOString().split('T')[0],
    priority: 'medium'
  });

  // Edit form state
  const [editForm, setEditForm] = useState<CreateGoalRequest & { priority?: Priority }>({
    title: '',
    description: '',
    category: '',
    type: 'daily',
    timeAllotted: 30,
    deadline: new Date().toISOString().split('T')[0],
    priority: 'medium'
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  // Update edit form when editing goal changes
  useEffect(() => {
    if (editingGoal) {
      setEditForm({
        title: editingGoal.title,
        description: editingGoal.description,
        category: editingGoal.category,
        type: editingGoal.type,
        timeAllotted: editingGoal.timeAllotted,
        deadline: new Date(editingGoal.deadline).toISOString().split('T')[0],
        priority: editingGoal.priority || 'medium'
      });
    }
  }, [editingGoal]);

  // Filter and search goals
  useEffect(() => {
    let filtered = goals;
    
    // Search
    if (searchTerm) {
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Active filters
    activeFilters.forEach(filter => {
      switch (filter) {
        case 'today':
          const today = new Date().toDateString();
          filtered = filtered.filter(goal => new Date(goal.deadline).toDateString() === today);
          break;
        case 'overdue':
          filtered = filtered.filter(goal => new Date(goal.deadline) < new Date() && !goal.completed);
          break;
        case 'completed':
          filtered = filtered.filter(goal => goal.completed);
          break;
        case 'pending':
          filtered = filtered.filter(goal => !goal.completed);
          break;
        case 'high-priority':
          filtered = filtered.filter(goal => goal.priority === 'high');
          break;
        case 'daily':
        case 'weekly':
        case 'monthly':
          filtered = filtered.filter(goal => goal.type === filter);
          break;
      }
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
    
    setFilteredGoals(filtered);
  }, [goals, searchTerm, activeFilters, sortBy]);

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
        // Add random priorities for demo purposes
        const goalsWithPriority = data.goals.map((goal: Goal) => ({
          ...goal,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Priority
        }));
        setGoals(goalsWithPriority);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
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
        setIsCreateOpen(false);
        setNewGoal({
          title: '',
          description: '',
          category: '',
          type: 'daily',
          timeAllotted: 30,
          deadline: new Date().toISOString().split('T')[0],
          priority: 'medium'
        });

        toast.success('Goal created successfully! 🎯');
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const updateGoal = async () => {
    if (!editingGoal) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/goals/${editingGoal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchGoals();
        setEditingGoal(null);
        setEditForm({
          title: '',
          description: '',
          category: '',
          type: 'daily',
          timeAllotted: 30,
          deadline: new Date().toISOString().split('T')[0],
          priority: 'medium'
        });

        toast.success('Goal updated successfully! ✨');
      } else {
        toast.error('Failed to update goal');
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
      toast.error('Failed to update goal');
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
        
        if (completed) {
          const goalData = goals.find(g => g.id === goalId);
          triggerMotivationalCelebration({
            goalTitle: goalData?.title || 'Goal',
            streak: 0,
            isFirstGoal: goals.filter(g => g.completed).length === 0,
            category: goalData?.category
          });
        } else {
          toast.success('Goal marked as incomplete');
        }
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await fetchGoals();
        toast.success('Goal deleted');
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const bulkAction = (action: 'complete' | 'delete' | 'archive') => {
    selectedGoals.forEach(goalId => {
      switch (action) {
        case 'complete':
          toggleGoalCompletion(goalId, true);
          break;
        case 'delete':
          deleteGoal(goalId);
          break;
        case 'archive':
          // Archive functionality would go here
          toast.success('Goals archived');
          break;
      }
    });
    setSelectedGoals([]);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };

  const getPriorityColor = (priority?: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority?: Priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-3 h-3" />;
      case 'medium': return <Flag className="w-3 h-3" />;
      case 'low': return <Star className="w-3 h-3" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'weekly': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'monthly': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const quickFilters = [
    { label: 'Today', key: 'today', count: goals.filter(g => new Date(g.deadline).toDateString() === new Date().toDateString()).length },
    { label: 'Overdue', key: 'overdue', count: goals.filter(g => new Date(g.deadline) < new Date() && !g.completed).length },
    { label: 'High Priority', key: 'high-priority', count: goals.filter(g => g.priority === 'high').length },
    { label: 'Completed', key: 'completed', count: goals.filter(g => g.completed).length },
    { label: 'Daily', key: 'daily', count: goals.filter(g => g.type === 'daily').length },
    { label: 'Weekly', key: 'weekly', count: goals.filter(g => g.type === 'weekly').length },
    { label: 'Monthly', key: 'monthly', count: goals.filter(g => g.type === 'monthly').length },
  ];

  const categories = [...new Set(goals.map(g => g.category).filter(Boolean))];
  const completedGoals = goals.filter(g => g.completed);

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

  const renderGoalCard = (goal: EnhancedGoal, index: number) => {
    const isOverdue = new Date(goal.deadline) < new Date() && !goal.completed;
    const isDueToday = new Date(goal.deadline).toDateString() === new Date().toDateString();

    return (
      <motion.div
        key={goal.id}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -8, scale: 1.03 }}
        className="group h-full"
      >
        <Card className={`h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${goal.completed ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800' : selectedGoals.includes(goal.id) ? 'ring-2 ring-primary bg-gradient-to-br from-primary/5 to-accent/5 border-primary/50' : 'bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50 border-border/60 hover:border-primary/40'} backdrop-blur-sm shadow-lg`}>
          {/* Priority Indicator Line */}
          {goal.priority && (
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              goal.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
              goal.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
              'bg-gradient-to-r from-green-500 to-emerald-500'
            }`} />
          )}

          {/* Status Indicators */}
          <div className="absolute top-3 right-3 flex gap-1">
            {isOverdue && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Overdue" />
            )}
            {isDueToday && !goal.completed && (
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" title="Due Today" />
            )}
            {goal.completed && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <CardHeader className="pb-4 pt-6">
            <div className="flex items-start gap-3">
              <motion.input
                type="checkbox"
                checked={selectedGoals.includes(goal.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedGoals(prev => [...prev, goal.id]);
                  } else {
                    setSelectedGoals(prev => prev.filter(id => id !== goal.id));
                  }
                }}
                className="rounded-md mt-1 w-4 h-4 text-primary border-2 border-gray-300 focus:ring-primary focus:ring-2"
                whileTap={{ scale: 0.9 }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className={`text-xl font-bold leading-tight ${
                    goal.completed ? 'line-through text-muted-foreground' :
                    'bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent'
                  }`}>
                    {goal.title}
                  </CardTitle>
                  {goal.priority && (
                    <Badge className={`text-xs font-semibold shadow-sm ${getPriorityColor(goal.priority)} flex items-center gap-1`}>
                      {getPriorityIcon(goal.priority)}
                      {goal.priority.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm leading-relaxed line-clamp-2 text-gray-600 dark:text-gray-400">
                  {goal.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-grow flex flex-col justify-between pt-0">
            {/* Tags and Categories */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${getTypeColor(goal.type)} text-xs font-medium shadow-sm`}>
                  {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                </Badge>
                {goal.category && (
                  <Badge variant="outline" className="text-xs font-medium border-2 shadow-sm">
                    {goal.category}
                  </Badge>
                )}
              </div>

              {/* Goal Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{goal.timeAllotted} minutes</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className={`font-medium ${
                    isOverdue ? 'text-red-600 dark:text-red-400' :
                    isDueToday ? 'text-orange-600 dark:text-orange-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {isOverdue ? 'Overdue: ' : isDueToday ? 'Due today: ' : 'Due: '}
                    {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleGoalCompletion(goal.id, !goal.completed)}
                className={`transition-all hover:scale-110 ${
                  goal.completed ? 'text-green-600 hover:text-green-700 hover:bg-green-50' :
                  'text-gray-500 hover:text-green-600 hover:bg-green-50'
                }`}
                title={goal.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                <CheckCircle2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingGoal(goal)}
                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all hover:scale-110"
                title="Edit goal"
              >
                <Edit className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteGoal(goal.id)}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all hover:scale-110"
                title="Delete goal"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Completion Status */}
            {goal.completed && goal.completedAt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed on {new Date(goal.completedAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderBoardView = () => {
    const todoGoals = filteredGoals.filter(g => !g.completed);
    const completedGoals = filteredGoals.filter(g => g.completed);
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              To Do ({todoGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todoGoals.map((goal, index) => renderGoalCard(goal, index))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="w-5 h-5" />
              Completed ({completedGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedGoals.map((goal, index) => renderGoalCard(goal, index))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      <MotivationalBackground variant="floating" intensity="low" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            My Goals
          </h1>
          <p className="text-muted-foreground">
            {goals.length} total goals • {completedGoals.length} completed • {goals.length - completedGoals.length} remaining
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'board' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('board')}
            >
              <Columns className="w-4 h-4" />
            </Button>
          </div>

          {/* Add Goal Button */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a new goal to track your progress and stay motivated.
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
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newGoal.priority} onValueChange={(value: Priority) => setNewGoal({...newGoal, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid gap-2">
                    <Label htmlFor="timeAllotted">Time (minutes)</Label>
                    <Input
                      id="timeAllotted"
                      type="number"
                      value={newGoal.timeAllotted}
                      onChange={(e) => setNewGoal({...newGoal, timeAllotted: parseInt(e.target.value)})}
                    />
                  </div>
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
              <DialogFooter>
                <Button onClick={createGoal}>Create Goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Goal Dialog */}
          <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Goal</DialogTitle>
                <DialogDescription>
                  Update your goal details and settings.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    placeholder="Enter goal title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    placeholder="Describe your goal"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      placeholder="e.g., Health, Work"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select value={editForm.priority} onValueChange={(value: Priority) => setEditForm({...editForm, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-type">Type</Label>
                    <Select value={editForm.type} onValueChange={(value: any) => setEditForm({...editForm, type: value})}>
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
                  <div className="grid gap-2">
                    <Label htmlFor="edit-timeAllotted">Time (minutes)</Label>
                    <Input
                      id="edit-timeAllotted"
                      type="number"
                      value={editForm.timeAllotted}
                      onChange={(e) => setEditForm({...editForm, timeAllotted: parseInt(e.target.value) || 0})}
                      min="1"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-deadline">Deadline</Label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    value={editForm.deadline}
                    onChange={(e) => setEditForm({...editForm, deadline: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setEditingGoal(null)}>
                  Cancel
                </Button>
                <Button onClick={updateGoal} disabled={!editForm.title.trim()}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Compact Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search goals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Sort by Deadline</SelectItem>
                  <SelectItem value="priority">Sort by Priority</SelectItem>
                  <SelectItem value="created">Sort by Created</SelectItem>
                  <SelectItem value="category">Sort by Category</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(activeFilters.length > 0 || searchTerm) && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  Clear All
                </Button>
              )}
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {quickFilters.map(filter => (
                <Button
                  key={filter.key}
                  variant={activeFilters.includes(filter.key) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleFilter(filter.key)}
                  className="text-xs"
                >
                  {filter.label} ({filter.count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bulk Actions */}
      {selectedGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-20 z-40"
        >
          <Card className="border-2 border-primary/50 bg-primary/5 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedGoals.length} goal{selectedGoals.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => bulkAction('complete')}>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => bulkAction('archive')}>
                    <Archive className="w-4 h-4 mr-1" />
                    Archive
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => bulkAction('delete')}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MotivationalQuote variant="compact" />
      </motion.div>

      {/* Goals Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {viewMode === 'board' ? (
          renderBoardView()
        ) : (
          <AnimatePresence>
            <div className={viewMode === 'grid' ? "grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr" : "space-y-6"}>
              {filteredGoals.map((goal, index) => renderGoalCard(goal, index))}
            </div>
          </AnimatePresence>
        )}

        {filteredGoals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-border/50 bg-card/95 backdrop-blur-sm shadow-md">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
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
                  <Target className="w-12 h-12 text-muted-foreground mb-4" />
                </motion.div>
                <h3 className="text-lg font-medium mb-2">No goals found</h3>
                <p className="text-muted-foreground mb-4">
                  {goals.length === 0 
                    ? "Create your first goal to get started on your journey!"
                    : "Try adjusting your filters or search terms."
                  }
                </p>
                {goals.length === 0 && (
                  <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Your First Goal
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
