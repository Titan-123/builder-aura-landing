import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Target, CheckCircle2, Edit, Trash2, Filter, Search, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
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

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newGoal, setNewGoal] = useState<CreateGoalRequest>({
    title: '',
    description: '',
    category: '',
    type: 'daily',
    timeAllotted: 30,
    deadline: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  // Filter and search goals
  useEffect(() => {
    let filtered = goals;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(goal => goal.type === filterType);
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(goal => goal.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      if (filterStatus === 'completed') {
        filtered = filtered.filter(goal => goal.completed);
      } else if (filterStatus === 'pending') {
        filtered = filtered.filter(goal => !goal.completed);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredGoals(filtered);
  }, [goals, filterType, filterCategory, filterStatus, searchTerm]);

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
          deadline: new Date().toISOString().split('T')[0]
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
        body: JSON.stringify(newGoal)
      });
      
      if (response.ok) {
        await fetchGoals();
        setEditingGoal(null);
        setNewGoal({
          title: '',
          description: '',
          category: '',
          type: 'daily',
          timeAllotted: 30,
          deadline: new Date().toISOString().split('T')[0]
        });
        
        toast.success('Goal updated successfully! ✨');
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
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#6366f1', '#8b5cf6', '#ec4899']
          });
          toast.success('Goal completed! Amazing work! 🎉');
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

  const startEditing = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      type: goal.type,
      timeAllotted: goal.timeAllotted,
      deadline: new Date(goal.deadline).toISOString().split('T')[0]
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'weekly': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'monthly': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

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

  return (
    <div className="space-y-6">
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
          <p className="text-muted-foreground">Create and manage your personal goals</p>
        </div>
        
        <div className="flex items-center gap-3">
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
          </div>
          
          <Dialog open={isCreateOpen || !!editingGoal} onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) setEditingGoal(null);
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
                <DialogDescription>
                  {editingGoal ? 'Update your goal details.' : 'Set a new goal to track your progress and stay motivated.'}
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
                <Button onClick={editingGoal ? updateGoal : createGoal}>
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search goals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFilterType('all');
                      setFilterCategory('all');
                      setFilterStatus('all');
                      setSearchTerm('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.length}</div>
              <p className="text-xs text-muted-foreground">across all categories</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
              <p className="text-xs text-muted-foreground">goals finished</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">completion rate</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Goals Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {filteredGoals.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            <AnimatePresence>
              {filteredGoals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className={`transition-all hover:shadow-lg ${goal.completed ? 'ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-950/20' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className={`text-lg ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {goal.title}
                          </CardTitle>
                          <CardDescription className="text-sm">{goal.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleGoalCompletion(goal.id, !goal.completed)}
                            className={`transition-all ${goal.completed ? 'text-green-600 hover:text-green-700' : 'text-muted-foreground hover:text-green-600'}`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(goal)}
                            className="text-muted-foreground hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGoal(goal.id)}
                            className="text-muted-foreground hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getTypeColor(goal.type)}>{goal.type}</Badge>
                        {goal.category && (
                          <Badge variant="outline">{goal.category}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {goal.timeAllotted}m
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                        {goal.streak > 0 && (
                          <div className="flex items-center gap-1 text-orange-500">
                            <Target className="w-3 h-3" />
                            {goal.streak}
                          </div>
                        )}
                      </div>
                      {goal.completed && goal.completedAt && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs text-green-600 bg-green-100 dark:bg-green-950 p-2 rounded"
                        >
                          ✅ Completed on {new Date(goal.completedAt).toLocaleDateString()}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Card>
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
                  ? "Create your first goal to get started!"
                  : "Try adjusting your search or filters."
                }
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
