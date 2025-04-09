
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import { UserRole } from "./types/user";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const hasSession = !!session;
        setIsAuthenticated(hasSession);
        
        if (hasSession) {
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userEmail", session.user.email || "");
          
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('engineer_profiles')
              .select('specializations')
              .eq('id', session.user.id)
              .single();
              
            if (!profileError && profileData) {
              const isAdmin = profileData.specializations && 
                              profileData.specializations.includes('Administrator');
              
              setUserRole(isAdmin ? 'admin' : 'engineer');
              
              if (isAdmin) {
                localStorage.setItem("adminLoggedIn", "true");
                localStorage.setItem("adminUsername", session.user.email || "");
              }
            } else {
              // No profile found - check if email suggests admin role
              const emailSuggestsAdmin = isAdminEmail(session.user.email || '');
              setUserRole(emailSuggestsAdmin ? 'admin' : 'engineer');
              
              if (emailSuggestsAdmin) {
                localStorage.setItem("adminLoggedIn", "true");
                localStorage.setItem("adminUsername", session.user.email || "");
              }
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("adminLoggedIn");
          localStorage.removeItem("adminUsername");
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const hasSession = !!session;
      setIsAuthenticated(hasSession);
      
      if (hasSession) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userEmail", session.user.email || "");
        
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('engineer_profiles')
            .select('specializations')
            .eq('id', session.user.id)
            .single();
            
          if (!profileError && profileData) {
            const isAdmin = profileData.specializations && 
                            profileData.specializations.includes('Administrator');
            
            setUserRole(isAdmin ? 'admin' : 'engineer');
            
            if (isAdmin) {
              localStorage.setItem("adminLoggedIn", "true");
              localStorage.setItem("adminUsername", session.user.email || "");
            }
          } else {
            // No profile found - check if email suggests admin role
            const emailSuggestsAdmin = isAdminEmail(session.user.email || '');
            setUserRole(emailSuggestsAdmin ? 'admin' : 'engineer');
            
            if (emailSuggestsAdmin) {
              localStorage.setItem("adminLoggedIn", "true");
              localStorage.setItem("adminUsername", session.user.email || "");
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to check if email suggests admin role
  const isAdminEmail = (email: string): boolean => {
    return email.includes('admin') || email.endsWith('@akhanya.co.za');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            {/* Redirect root to login page */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/eskom-survey/new" element={<EskomSurvey />} />
            <Route path="/installation" element={<Installation />} />
            <Route path="/my-allocations" element={<MyAllocations />} />

            <Route path="/dashboard" element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } />

            <Route path="/admin" element={<AdminProtectedRoute><Outlet /></AdminProtectedRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="assessments" element={<AdminAssessments />} />
              <Route path="installations" element={<AdminInstallations />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="map" element={<AdminMap />} />
              <Route path="site-allocation" element={<AdminSiteAllocation />} />
              <Route path="system-logs" element={<AdminSystemLogs />} />
            </Route>

            <Route path="/admin/login" element={<Navigate to="/login?role=admin" replace />} />
            <Route path="/configuration" element={<Configuration />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
