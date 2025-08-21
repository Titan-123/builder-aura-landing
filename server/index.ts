import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./database";
import { handleDemo } from "./routes/demo";
import { handleRegister, handleLogin, handleMe, verifyToken } from "./routes/auth";
import { handleGetGoals, handleCreateGoal, handleUpdateGoal, handleDeleteGoal, handleGetStreaks } from "./routes/goals";
import { handleGetAnalytics } from "./routes/analytics";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize database connection
  connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes (public)
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/me", handleMe);

  // Protected routes (require authentication)
  app.get("/api/goals", verifyToken, handleGetGoals);
  app.post("/api/goals", verifyToken, handleCreateGoal);
  app.put("/api/goals/:id", verifyToken, handleUpdateGoal);
  app.delete("/api/goals/:id", verifyToken, handleDeleteGoal);

  // Analytics routes (protected)
  app.get("/api/analytics", verifyToken, handleGetAnalytics);

  return app;
}
