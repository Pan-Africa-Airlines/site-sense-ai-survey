
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAssessments from "./pages/AdminAssessments";
import AdminInstallations from "./pages/AdminInstallations";
import AdminUsers from "./pages/AdminUsers";
import AdminMap from "./pages/AdminMap";
import AdminSiteAllocation from "./pages/AdminSiteAllocation";
import Configuration from "./pages/Configuration";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import EskomSurvey from "./pages/EskomSurvey";
import Installation from "./pages/Installation";
import MyAllocations from "./pages/MyAllocations";
import AdminSystemLogs from "./pages/AdminSystemLogs";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on load and listen for changes
  useEffect(() => {
    // Check if user is logged in from local storage first for quick UI response
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    setIsAuthenticated(loggedIn);

    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const hasSession = !!session;
        setIsAuthenticated(hasSession);
        if (hasSession) {
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userEmail", session.user.email || "");
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("adminLoggedIn");
          localStorage.removeItem("adminUsername");
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const hasSession = !!session;
      setIsAuthenticated(hasSession);
      if (hasSession) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userEmail", session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/eskom-survey/new" element={<EskomSurvey />} />
            <Route path="/installation" element={<Installation />} />
            <Route path="/my-allocations" element={<MyAllocations />} />

            {/* Engineer Protected Route */}
            <Route path="/dashboard" element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AdminProtectedRoute><Outlet /></AdminProtectedRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="assessments" element={<AdminAssessments />} />
              <Route path="installations" element={<AdminInstallations />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="map" element={<AdminMap />} />
              <Route path="site-allocation" element={<AdminSiteAllocation />} />
              <Route path="system-logs" element={<AdminSystemLogs />} />
            </Route>

            <Route path="/configuration" element={<Configuration />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
