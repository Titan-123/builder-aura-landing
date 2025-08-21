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
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Goal Schema
const GoalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ["daily", "weekly", "monthly"] },
  timeAllotted: { type: Number, required: true, min: 1, max: 1440 },
  deadline: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { timestamps: true });

const Goal = mongoose.models.Goal || mongoose.model('Goal', GoalSchema);

// JWT config
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';

// Auth middleware
const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required" });
  }

  const token = authHeader.substring(7);
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid or expired token" });
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
      return res.status(400).json({ error: "VALIDATION_ERROR", message: "All fields required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "USER_EXISTS", message: "User already exists" });
    }

    const user = new User({ name: name.trim(), email: email.toLowerCase(), password });
    await user.save();

    const accessToken = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
      accessToken,
      refreshToken: accessToken
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "VALIDATION_ERROR", message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "INVALID_CREDENTIALS", message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
      accessToken,
      refreshToken: accessToken
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "INTERNAL_ERROR", message: "Internal server error" });
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
    const formattedGoals = goals.map(goal => ({
      id: goal._id.toString(),
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      type: goal.type,
      timeAllotted: goal.timeAllotted,
      deadline: goal.deadline,
      completed: goal.completed,
      completedAt: goal.completedAt,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt
    }));

    res.json({ goals: formattedGoals, total: formattedGoals.length });
  } catch (error) {
    console.error("Get goals error:", error);
    res.status(500).json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

app.post("/api/goals", verifyToken, async (req: any, res) => {
  try {
    const { title, description, category, type, timeAllotted, deadline } = req.body;
    
    if (!title || !description || !category || !type || !timeAllotted || !deadline) {
      return res.status(400).json({ error: "VALIDATION_ERROR", message: "All fields required" });
    }

    const goal = new Goal({
      userId: req.userId,
      title: title.trim(),
      description: description.trim(), 
      category: category.trim(),
      type,
      timeAllotted,
      deadline: new Date(deadline),
      completed: false
    });

    await goal.save();
    res.status(201).json({
      id: goal._id.toString(),
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      type: goal.type,
      timeAllotted: goal.timeAllotted,
      deadline: goal.deadline,
      completed: goal.completed,
      completedAt: goal.completedAt,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt
    });
  } catch (error) {
    console.error("Create goal error:", error);
    res.status(500).json({ error: "INTERNAL_ERROR", message: "Internal server error" });
  }
});

// SPA fallback routes
const spaRoutes = ["/", "/dashboard", "/goals", "/calendar", "/analytics", "/login", "/register"];

spaRoutes.forEach(route => {
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
