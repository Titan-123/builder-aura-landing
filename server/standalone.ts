import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = process.env.PORT || 3000;

// Get directory path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = path.join(__dirname, "../spa");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(distPath));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached: any = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => {
      console.log("✅ Connected to MongoDB");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Goal Schema
const GoalSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "monthly"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    timeAllotted: { type: Number, required: true, min: 1, max: 1440 },
    deadline: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

const Goal = mongoose.models.Goal || mongoose.model("Goal", GoalSchema);

// JWT config
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-this";

// Auth middleware
const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "UNAUTHORIZED", message: "Authentication required" });
  }

  const token = authHeader.substring(7);
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
};

// Initialize database
connectDB().catch(console.error);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.get("/api/ping", (req, res) => {
  res.json({ message: process.env.PING_MESSAGE || "ping" });
});

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "VALIDATION_ERROR", message: "All fields required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "USER_EXISTS", message: "User already exists" });
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
    });
    await user.save();

    const accessToken = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
      accessToken,
      refreshToken: accessToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: "INVALID_CREDENTIALS", message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
      accessToken,
      refreshToken: accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

app.get("/api/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "UNAUTHORIZED", message: "No valid token provided" });
    }

    const token = authHeader.substring(7);
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ error: "UNAUTHORIZED", message: "User not found" });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res
      .status(401)
      .json({ error: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
});

// Goals routes
app.get("/api/goals", verifyToken, async (req: any, res) => {
  try {
    const { type, category, completed } = req.query;
    const filter: any = { userId: req.userId };

    if (type && type !== "all") filter.type = type;
    if (category && category !== "all") filter.category = category;
    if (completed !== undefined) filter.completed = completed === "true";

    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    const formattedGoals = goals.map((goal) => ({
      id: goal._id.toString(),
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      type: goal.type,
      priority: goal.priority,
      timeAllotted: goal.timeAllotted,
      deadline: goal.deadline,
      completed: goal.completed,
      completedAt: goal.completedAt,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    }));

    res.json({ goals: formattedGoals, total: formattedGoals.length });
  } catch (error) {
    console.error("Get goals error:", error);
    res
      .status(500)
      .json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

app.post("/api/goals", verifyToken, async (req: any, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      priority,
      timeAllotted,
      deadline,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !type ||
      !priority ||
      !deadline
    ) {
      return res
        .status(400)
        .json({
          error: "VALIDATION_ERROR",
          message:
            "Title, description, category, type, priority, and deadline are required",
        });
    }

    const goal = new Goal({
      userId: req.userId,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      type,
      priority,
      timeAllotted: timeAllotted || 30,
      deadline: new Date(deadline),
      completed: false,
    });

    await goal.save();
    res.status(201).json({
      id: goal._id.toString(),
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      type: goal.type,
      priority: goal.priority,
      timeAllotted: goal.timeAllotted,
      deadline: goal.deadline,
      completed: goal.completed,
      completedAt: goal.completedAt,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    });
  } catch (error) {
    console.error("Create goal error:", error);
    res
      .status(500)
      .json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

app.put("/api/goals/:goalId", verifyToken, async (req: any, res) => {
  try {
    const { goalId } = req.params;
    const updates = req.body;

    const goal = await Goal.findOne({ _id: goalId, userId: req.userId });
    if (!goal) {
      return res
        .status(404)
        .json({ error: "GOAL_NOT_FOUND", message: "Goal not found" });
    }

    if (updates.title !== undefined) goal.title = updates.title.trim();
    if (updates.description !== undefined)
      goal.description = updates.description.trim();
    if (updates.category !== undefined) goal.category = updates.category.trim();
    if (updates.type !== undefined) goal.type = updates.type;
    if (updates.priority !== undefined) goal.priority = updates.priority;
    if (updates.timeAllotted !== undefined)
      goal.timeAllotted = updates.timeAllotted;
    if (updates.deadline !== undefined)
      goal.deadline = new Date(updates.deadline);

    if (updates.completed !== undefined) {
      const wasCompleted = goal.completed;
      goal.completed = updates.completed;

      if (updates.completed && !wasCompleted) {
        goal.completedAt = new Date();
      } else if (!updates.completed && wasCompleted) {
        goal.completedAt = undefined;
      }
    }

    goal.updatedAt = new Date();
    await goal.save();

    res.json({
      id: goal._id.toString(),
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      type: goal.type,
      priority: goal.priority,
      timeAllotted: goal.timeAllotted,
      deadline: goal.deadline,
      completed: goal.completed,
      completedAt: goal.completedAt,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    });
  } catch (error) {
    console.error("Update goal error:", error);
    res
      .status(500)
      .json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

app.delete("/api/goals/:goalId", verifyToken, async (req: any, res) => {
  try {
    const { goalId } = req.params;

    const deletedGoal = await Goal.findOneAndDelete({
      _id: goalId,
      userId: req.userId,
    });

    if (!deletedGoal) {
      return res
        .status(404)
        .json({ error: "GOAL_NOT_FOUND", message: "Goal not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete goal error:", error);
    res
      .status(500)
      .json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

app.get("/api/streaks", verifyToken, async (req: any, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId });
    const today = new Date();

    // Helper function to check if all daily goals are completed for a specific date
    // This matches exactly how the calendar determines completion
    const isDayFullyCompleted = (checkDate) => {
      // Get all daily goals with deadline on this date (same logic as calendar)
      const allDailyGoals = goals.filter((goal) => {
        const goalDate = new Date(goal.deadline);
        return (
          goal.type === "daily" &&
          goalDate.getDate() === checkDate.getDate() &&
          goalDate.getMonth() === checkDate.getMonth() &&
          goalDate.getFullYear() === checkDate.getFullYear()
        );
      });

      if (allDailyGoals.length === 0) {
        return null; // No daily goals for this day
      }

      // Check if all daily goals are completed (regardless of when completed)
      const completedDailyGoals = allDailyGoals.filter(
        (goal) => goal.completed,
      );

      return completedDailyGoals.length === allDailyGoals.length;
    };

    // Calculate daily streak (consecutive days with all daily goals completed)
    // Find the CURRENT streak from the most recent date backwards

    // Get all dates that have daily goals
    const datesWithDailyGoals = [
      ...new Set(
        goals
          .filter((goal) => goal.type === "daily")
          .map((goal) => {
            const date = new Date(goal.deadline);
            return date.toDateString();
          }),
      ),
    ]
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => b.getTime() - a.getTime()); // Sort newest first

    console.log(
      "📊 Dates with daily goals (newest first):",
      datesWithDailyGoals.map((d) => d.toDateString()),
    );

    if (datesWithDailyGoals.length === 0) {
      console.log("❌ No daily goals found");
      const streaks = { dailyStreak: 0, weeklyStreak: 0, monthlyStreak: 0 };
      console.log("✅ Streaks calculated:", streaks);
      return res.json(streaks);
    }

    // Find the CURRENT streak starting from the most recent date and going backwards
    let currentStreak = 0;

    console.log(
      "🔍 Calculating current streak from most recent date backwards...",
    );

    for (let i = 0; i < datesWithDailyGoals.length; i++) {
      const currentDate = datesWithDailyGoals[i];
      const dayCompletion = isDayFullyCompleted(currentDate);

      // Check if this is today
      const isToday = currentDate.toDateString() === today.toDateString();

      console.log(
        `📅 Checking ${currentDate.toDateString()}: dayCompletion = ${dayCompletion}, isToday = ${isToday}`,
      );

      if (dayCompletion === true) {
        currentStreak++;
        console.log(`✅ Day completed! Current streak: ${currentStreak}`);

        // Check if this date is consecutive with the previous one (if any)
        if (i > 0) {
          const nextNewerDate = datesWithDailyGoals[i - 1]; // Next newer date in our list
          const daysDiff = Math.floor(
            (nextNewerDate.getTime() - currentDate.getTime()) /
              (1000 * 60 * 60 * 24),
          );

          if (daysDiff > 1) {
            // Gap found between this completed day and the next newer one, so streak ends here
            console.log(
              `⚠️ Gap of ${daysDiff} days found between ${currentDate.toDateString()} and ${nextNewerDate.toDateString()}, streak ends`,
            );
            break;
          }
        }
      } else if (isToday) {
        // Today is not completed yet, but day is still in progress
        // Don't break the streak, just skip today and continue with previous days
        console.log(
          `⏳ Today is incomplete but still in progress, continuing streak calculation...`,
        );
        continue;
      } else {
        // Past day not completed, streak ends
        console.log(`❌ Past day not completed, streak ends`);
        break;
      }
    }

    const dailyStreak = currentStreak;
    console.log(`🎯 Final daily streak: ${dailyStreak}`);

    // Calculate weekly and monthly streaks (simplified)
    let weeklyStreak = 0;
    let monthlyStreak = 0;

    // Weekly streak calculation
    const getWeekStart = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day;
      return new Date(d.setDate(diff));
    };

    let weekStart = getWeekStart(new Date(today));
    weekStart.setHours(0, 0, 0, 0);

    for (let week = 0; week < 52; week++) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weeklyGoals = goals.filter((goal) => {
        const goalDate = new Date(goal.deadline);
        return (
          goal.type === "weekly" && goalDate >= weekStart && goalDate <= weekEnd
        );
      });

      if (weeklyGoals.length === 0) {
        weekStart.setDate(weekStart.getDate() - 7);
        continue;
      }

      const completedWeekly = weeklyGoals.filter((goal) => goal.completed);

      if (completedWeekly.length === weeklyGoals.length) {
        weeklyStreak++;
        weekStart.setDate(weekStart.getDate() - 7);
      } else {
        break;
      }
    }

    // Monthly streak calculation
    let checkMonth = today.getMonth();
    let checkYear = today.getFullYear();

    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(checkYear, checkMonth, 1);
      const monthEnd = new Date(checkYear, checkMonth + 1, 0, 23, 59, 59, 999);

      const monthlyGoals = goals.filter((goal) => {
        const goalDate = new Date(goal.deadline);
        return (
          goal.type === "monthly" &&
          goalDate >= monthStart &&
          goalDate <= monthEnd
        );
      });

      if (monthlyGoals.length === 0) {
        checkMonth--;
        if (checkMonth < 0) {
          checkMonth = 11;
          checkYear--;
        }
        continue;
      }

      const completedMonthly = monthlyGoals.filter((goal) => goal.completed);

      if (completedMonthly.length === monthlyGoals.length) {
        monthlyStreak++;
        checkMonth--;
        if (checkMonth < 0) {
          checkMonth = 11;
          checkYear--;
        }
      } else {
        break;
      }
    }

    res.json({
      dailyStreak,
      weeklyStreak,
      monthlyStreak,
    });
  } catch (error) {
    console.error("Get streaks error:", error);
    res
      .status(500)
      .json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

app.get("/api/analytics", verifyToken, async (req: any, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    const completedGoals = goals.filter((g) => g.completed);
    const completionRate =
      goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0;

    // Category breakdown
    const categoryMap = new Map();
    goals.forEach((goal) => {
      const category = goal.category || "Uncategorized";
      const current = categoryMap.get(category) || { completed: 0, total: 0 };
      current.total++;
      if (goal.completed) current.completed++;
      categoryMap.set(category, current);
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(
      ([category, stats]) => ({
        category,
        completed: stats.completed,
        total: stats.total,
        percentage: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
      }),
    );

    // Weekly trends (last 4 weeks)
    const now = new Date();
    const weeklyTrends = [];

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7 - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekGoals = goals.filter((g) => {
        const goalDate = new Date(g.createdAt);
        return goalDate >= weekStart && goalDate <= weekEnd;
      });

      const weekCompleted = weekGoals.filter((g) => {
        if (!g.completed || !g.completedAt) return false;
        const completedDate = new Date(g.completedAt);
        return completedDate >= weekStart && completedDate <= weekEnd;
      });

      weeklyTrends.push({
        week: `Week ${4 - i}`,
        completed: weekCompleted.length,
        total: weekGoals.length,
      });
    }

    // Monthly trends (last 6 months)
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      const monthGoals = goals.filter((g) => {
        const goalDate = new Date(g.createdAt);
        return goalDate >= monthStart && goalDate <= monthEnd;
      });

      const monthCompleted = monthGoals.filter((g) => {
        if (!g.completed || !g.completedAt) return false;
        const completedDate = new Date(g.completedAt);
        return completedDate >= monthStart && completedDate <= monthEnd;
      });

      monthlyTrends.push({
        month: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        completed: monthCompleted.length,
        total: monthGoals.length,
      });
    }

    // Calculate current streak using the same logic as /api/streaks
    const calculateCurrentStreak = () => {
      const today = new Date();
      const isDayFullyCompleted = (checkDate) => {
        const allDailyGoals = goals.filter((goal) => {
          const goalDate = new Date(goal.deadline);
          return (
            goal.type === "daily" &&
            goalDate.getDate() === checkDate.getDate() &&
            goalDate.getMonth() === checkDate.getMonth() &&
            goalDate.getFullYear() === checkDate.getFullYear()
          );
        });

        if (allDailyGoals.length === 0) {
          return null;
        }

        const completedDailyGoals = allDailyGoals.filter(
          (goal) => goal.completed,
        );
        return completedDailyGoals.length === allDailyGoals.length;
      };

      // Get all dates that have daily goals
      const datesWithDailyGoals = [
        ...new Set(
          goals
            .filter((goal) => goal.type === "daily")
            .map((goal) => {
              const date = new Date(goal.deadline);
              return date.toDateString();
            }),
        ),
      ]
        .map((dateStr) => new Date(dateStr))
        .sort((a, b) => b.getTime() - a.getTime()); // Sort newest first

      if (datesWithDailyGoals.length === 0) {
        return 0;
      }

      // Find the CURRENT streak starting from the most recent date and going backwards
      let currentStreak = 0;

      for (let i = 0; i < datesWithDailyGoals.length; i++) {
        const currentDate = datesWithDailyGoals[i];
        const dayCompletion = isDayFullyCompleted(currentDate);

        // Check if this is today
        const isToday = currentDate.toDateString() === today.toDateString();

        if (dayCompletion === true) {
          currentStreak++;

          // Check if this date is consecutive with the previous one (if any)
          if (i > 0) {
            const nextNewerDate = datesWithDailyGoals[i - 1]; // Next newer date in our list
            const daysDiff = Math.floor(
              (nextNewerDate.getTime() - currentDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );

            if (daysDiff > 1) {
              // Gap found between this completed day and the next newer one, so streak ends here
              break;
            }
          }
        } else if (isToday) {
          // Today is not completed yet, but day is still in progress
          // Don't break the streak, just skip today and continue with previous days
          continue;
        } else {
          // Past day not completed, streak ends
          break;
        }
      }

      return currentStreak;
    };

    const currentStreakValue = calculateCurrentStreak();

    res.json({
      completionRate: Math.round(completionRate * 100) / 100,
      currentStreak: currentStreakValue,
      longestStreak: 0, // Can be enhanced later
      goalsCompleted: completedGoals.length,
      totalGoals: goals.length,
      categoryBreakdown,
      weeklyTrends,
      monthlyTrends,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res
      .status(500)
      .json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

// SPA fallback routes
const spaRoutes = [
  "/",
  "/dashboard",
  "/goals",
  "/calendar",
  "/analytics",
  "/login",
  "/register",
];

spaRoutes.forEach((route) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
});

// 404 for API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Final SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Goal Tracker server running on port ${port}`);
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
