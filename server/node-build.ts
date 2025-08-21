import path from "path";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Manual server setup to avoid path-to-regexp issues
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

// Import and setup routes manually to avoid bundling issues
import("./index.js")
  .then(({ createServer }) => {
    const serverApp = createServer();

    // Copy over the routes from the created server
    serverApp._router.stack.forEach((layer) => {
      if (layer.route) {
        // Copy individual routes
        const method = Object.keys(layer.route.methods)[0];
        const path = layer.route.path;
        app[method](path, layer.route.stack[0].handle);
      }
    });
  })
  .catch(console.error);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Manual API routes to ensure they work
app.get("/api/ping", (req, res) => {
  res.json({ message: process.env.PING_MESSAGE || "ping" });
});

// SPA fallback routes - explicitly define them to avoid wildcards
const spaRoutes = [
  "/",
  "/dashboard",
  "/goals",
  "/calendar",
  "/analytics",
  "/login",
  "/register",
];

// Handle SPA routes
spaRoutes.forEach((route) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Final SPA fallback for any other routes
app.use((req, res) => {
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
