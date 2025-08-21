import path from "path";
import { createServer } from "./index.js";
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

// SPA routes - serve index.html for specific routes
const spaRoutes = ["/", "/dashboard", "/goals", "/calendar", "/analytics", "/login", "/register"];

spaRoutes.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Catch-all handler for remaining routes (must be last)
app.use("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  // Serve index.html for any other routes (SPA fallback)
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
