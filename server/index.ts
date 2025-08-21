import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleRegister, handleLogin, handleMe } from "./routes/auth";
import { handleGetGoals, handleCreateGoal, handleUpdateGoal, handleDeleteGoal } from "./routes/goals";
import { handleGetAnalytics } from "./routes/analytics";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/me", handleMe);

  // Goals routes
  app.get("/api/goals", handleGetGoals);
  app.post("/api/goals", handleCreateGoal);
  app.put("/api/goals/:id", handleUpdateGoal);
  app.delete("/api/goals/:id", handleDeleteGoal);

  // Analytics routes
  app.get("/api/analytics", handleGetAnalytics);

  return app;
}
