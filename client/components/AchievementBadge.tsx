import { motion } from 'framer-motion';
import { Trophy, Target, Flame, Calendar, Star, Award, Zap, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export default function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const Icon = achievement.icon;
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center space-y-2 group cursor-pointer"
    >
      <div className="relative">
        <motion.div
          className={`
            ${sizeClasses[size]} rounded-full flex items-center justify-center relative
            ${achievement.unlocked 
              ? `bg-gradient-to-br ${achievement.color} shadow-lg`
              : 'bg-muted border-2 border-dashed border-muted-foreground/30'
            }
          `}
          whileHover={achievement.unlocked ? { rotate: [0, -5, 5, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Icon 
            className={`
              ${iconSizes[size]}
              ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'}
            `}
          />
          
          {achievement.unlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Progress Ring for Incomplete Achievements */}
        {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
          <svg 
            className={`absolute inset-0 ${sizeClasses[size]} -rotate-90`}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground/20"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-primary"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ 
                strokeDashoffset: 283 - (achievement.progress / achievement.maxProgress) * 283 
              }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </svg>
        )}
      </div>

      <div className="text-center space-y-1">
        <h4 className={`font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
          {achievement.title}
        </h4>
        <p className="text-xs text-muted-foreground max-w-20 line-clamp-2">
          {achievement.description}
        </p>
        {achievement.progress !== undefined && achievement.maxProgress && (
          <Badge variant="secondary" className="text-xs">
            {achievement.progress}/{achievement.maxProgress}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}

// Achievement definitions
export const achievements: Achievement[] = [
  {
    id: 'first_goal',
    title: 'First Step',
    description: 'Create your first goal',
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    unlocked: false
  },
  {
    id: 'goal_complete',
    title: 'Achiever',
    description: 'Complete your first goal',
    icon: CheckCircle,
    color: 'from-green-500 to-green-600',
    unlocked: false
  },
  {
    id: 'week_streak',
    title: 'Consistent',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    unlocked: false
  },
  {
    id: 'goal_master',
    title: 'Goal Master',
    description: 'Complete 10 goals',
    icon: Trophy,
    color: 'from-yellow-500 to-yellow-600',
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: '100% completion rate',
    icon: Star,
    color: 'from-purple-500 to-purple-600',
    unlocked: false
  },
  {
    id: 'dedication',
    title: 'Dedicated',
    description: '30-day streak',
    icon: Calendar,
    color: 'from-indigo-500 to-indigo-600',
    unlocked: false,
    progress: 0,
    maxProgress: 30
  },
  {
    id: 'productive',
    title: 'Productive',
    description: 'Complete 5 goals in one day',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    unlocked: false
  },
  {
    id: 'champion',
    title: 'Champion',
    description: 'Complete 50 goals',
    icon: Award,
    color: 'from-pink-500 to-rose-500',
    unlocked: false,
    progress: 0,
    maxProgress: 50
  }
];

// Hook to calculate achievements based on user data
export const useAchievements = (goals: any[], analytics: any) => {
  const calculateAchievements = (): Achievement[] => {
    return achievements.map(achievement => {
      const completed = goals.filter(g => g.completed);
      
      switch (achievement.id) {
        case 'first_goal':
          return { ...achievement, unlocked: goals.length > 0 };
        
        case 'goal_complete':
          return { ...achievement, unlocked: completed.length > 0 };
        
        case 'week_streak':
          return { ...achievement, unlocked: analytics?.currentStreak >= 7 };
        
        case 'goal_master':
          return { 
            ...achievement, 
            unlocked: completed.length >= 10,
            progress: Math.min(completed.length, 10)
          };
        
        case 'perfectionist':
          return { 
            ...achievement, 
            unlocked: analytics?.completionRate === 100 && goals.length >= 5
          };
        
        case 'dedication':
          return { 
            ...achievement, 
            unlocked: analytics?.currentStreak >= 30,
            progress: Math.min(analytics?.currentStreak || 0, 30)
          };
        
        case 'productive':
          // Check if user completed 5 goals in one day
          const today = new Date().toDateString();
          const todayCompleted = completed.filter(g => 
            g.completedAt && new Date(g.completedAt).toDateString() === today
          );
          return { ...achievement, unlocked: todayCompleted.length >= 5 };
        
        case 'champion':
          return { 
            ...achievement, 
            unlocked: completed.length >= 50,
            progress: Math.min(completed.length, 50)
          };
        
        default:
          return achievement;
      }
    });
  };

  return calculateAchievements();
};
