import path from "path";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// API routes are already defined in createServer()
// Add a health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Handle React Router - serve index.html for all non-API routes
app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.get("/goals", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.get("/calendar", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.get("/analytics", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Fallback for any other routes (must be last)
app.use((req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  // Serve index.html for any other routes
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Goal Tracker server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
