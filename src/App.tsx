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
import EngineerLogin from "./pages/EngineerLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminLoginRedirect from "./pages/AdminLoginRedirect";
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
import NavigationBar from "@/components/navigation/NavigationBar";

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
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<EngineerLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/login/redirect" element={<AdminLoginRedirect />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login/legacy" element={<Login />} />
            
            <Route path="/dashboard" element={
              isAuthenticated ? (
                <>
                  <NavigationBar />
                  <Dashboard />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            
            <Route path="/eskom-survey/new" element={
              isAuthenticated ? (
                <>
                  <NavigationBar />
                  <EskomSurvey />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            
            <Route path="/installation" element={
              isAuthenticated ? (
                <>
                  <NavigationBar />
                  <Installation />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            
            <Route path="/my-allocations" element={
              isAuthenticated ? (
                <>
                  <NavigationBar />
                  <MyAllocations />
                </>
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

            <Route path="/configuration" element={<Configuration />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
