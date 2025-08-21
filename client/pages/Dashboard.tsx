import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Target, CheckCircle2, Edit, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Goal, CreateGoalRequest } from '@shared/api';

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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

  // Fetch goals
  useEffect(() => {
    fetchGoals();
  }, []);

  // Filter goals
  useEffect(() => {
    let filtered = goals;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(goal => goal.type === filterType);
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(goal => goal.category === filterCategory);
    }
    
    setFilteredGoals(filtered);
  }, [goals, filterType, filterCategory]);

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
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
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
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
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
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
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

  const categories = [...new Set(goals.map(g => g.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading your goals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Goal Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your daily, weekly, and monthly goals</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="typeFilter" className="text-sm font-medium">Type</Label>
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
            <div className="flex-1">
              <Label htmlFor="categoryFilter" className="text-sm font-medium">Category</Label>
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
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGoals.map((goal) => (
          <Card key={goal.id} className={`transition-all hover:shadow-md ${goal.completed ? 'ring-2 ring-success' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <CardDescription className="text-sm">{goal.description}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGoalCompletion(goal.id, !goal.completed)}
                    className={goal.completed ? 'text-success' : 'text-muted-foreground hover:text-success'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                    className="text-muted-foreground hover:text-destructive"
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
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {goal.streak} streak
                  </div>
                )}
              </div>
              {goal.completed && goal.completedAt && (
                <div className="text-xs text-success">
                  Completed on {new Date(goal.completedAt).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGoals.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No goals found</h3>
            <p className="text-muted-foreground mb-4">
              {goals.length === 0 
                ? "Create your first goal to get started on your journey!"
                : "Try adjusting your filters or create a new goal."
              }
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
