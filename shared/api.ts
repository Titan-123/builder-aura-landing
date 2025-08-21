export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for frontend
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  type: 'daily' | 'weekly' | 'monthly';
  timeAllotted: number; // in minutes
  deadline: Date;
  completed: boolean;
  completedAt?: Date;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export interface CreateGoalRequest {
  title: string;
  description: string;
  category: string;
  type: 'daily' | 'weekly' | 'monthly';
  timeAllotted: number;
  deadline: string; // ISO date string
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  completed?: boolean;
}

export interface GoalsResponse {
  goals: Goal[];
  total: number;
}

export interface AnalyticsResponse {
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  goalsCompleted: number;
  totalGoals: number;
  categoryBreakdown: Array<{
    category: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
  weeklyTrends: Array<{
    week: string;
    completed: number;
    total: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    completed: number;
    total: number;
  }>;
}

// Error response
export interface ErrorResponse {
  error: string;
  message: string;
}
