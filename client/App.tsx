import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

// Public Route Component (redirect to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Placeholder component for unimplemented pages
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground max-w-md">
        This page is coming soon! Continue prompting to have this page content
        generated.
      </p>
    </div>
  );
}

const App = () => {
  // Suppress Vite overlay errors that cause frame issues
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message?.includes('frame') || e.message?.includes('ErrorOverlay')) {
        console.warn('Suppressed error overlay issue:', e.message);
        e.preventDefault();
        return false;
      }
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      if (e.reason?.message?.includes('frame') || e.reason?.message?.includes('ErrorOverlay')) {
        console.warn('Suppressed unhandled rejection:', e.reason);
        e.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HotToaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            color: "hsl(var(--foreground))",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
            fontSize: "14px",
            fontWeight: "500",
            padding: "16px 20px",
            maxWidth: "420px",
          },
          success: {
            style: {
              background: `
                linear-gradient(135deg,
                  rgba(34, 197, 94, 0.95) 0%,
                  rgba(16, 185, 129, 0.95) 50%,
                  rgba(20, 184, 166, 0.95) 100%
                )
              `,
              backdropFilter: "blur(20px)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              boxShadow: `
                0 25px 50px -12px rgba(34, 197, 94, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              fontWeight: "600",
            },
            iconTheme: {
              primary: "white",
              secondary: "rgba(34, 197, 94, 0.8)",
            },
          },
          error: {
            style: {
              background: `
                linear-gradient(135deg,
                  rgba(239, 68, 68, 0.95) 0%,
                  rgba(220, 38, 38, 0.95) 50%,
                  rgba(185, 28, 28, 0.95) 100%
                )
              `,
              backdropFilter: "blur(20px)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              boxShadow: `
                0 25px 50px -12px rgba(239, 68, 68, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              fontWeight: "600",
            },
            iconTheme: {
              primary: "white",
              secondary: "rgba(239, 68, 68, 0.8)",
            },
          },
          loading: {
            style: {
              background: `
                linear-gradient(135deg,
                  rgba(59, 130, 246, 0.95) 0%,
                  rgba(37, 99, 235, 0.95) 50%,
                  rgba(29, 78, 216, 0.95) 100%
                )
              `,
              backdropFilter: "blur(20px)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              boxShadow: `
                0 25px 50px -12px rgba(59, 130, 246, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              fontWeight: "600",
            },
            iconTheme: {
              primary: "white",
              secondary: "rgba(59, 130, 246, 0.8)",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Index />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
