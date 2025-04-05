
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AIProvider } from "@/contexts/AIContext";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Installation from "./pages/Installation";
import CarCheckup from "./pages/CarCheckup";
import Configuration from "./pages/Configuration";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAssessments from "./pages/AdminAssessments";
import AdminUsers from "./pages/AdminUsers";
import AdminInstallations from "./pages/AdminInstallations";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);
  
  if (isLoggedIn === null) {
    // Still loading auth state
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Apply the saved theme on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AIProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Routes>
                {/* Login route */}
                <Route path="/login" element={
                  <>
                    <Login />
                    <Footer />
                  </>
                } />
                
                {/* Admin login route */}
                <Route path="/admin/login" element={
                  <>
                    <AdminLogin />
                    <Footer />
                  </>
                } />
                
                {/* Regular user routes */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <div className="flex flex-col min-h-screen">
                        <Index />
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/assessment" 
                  element={
                    <ProtectedRoute>
                      <div className="flex flex-col min-h-screen">
                        <Assessment />
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/installation" 
                  element={
                    <ProtectedRoute>
                      <div className="flex flex-col min-h-screen">
                        <Installation />
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/car-check" 
                  element={
                    <ProtectedRoute>
                      <div className="flex flex-col min-h-screen">
                        <CarCheckup />
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/configuration" 
                  element={
                    <AdminProtectedRoute>
                      <div className="flex flex-col min-h-screen">
                        <Configuration />
                        <Footer />
                      </div>
                    </AdminProtectedRoute>
                  } 
                />
                
                {/* Admin routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/assessments" 
                  element={
                    <AdminProtectedRoute>
                      <AdminAssessments />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <AdminProtectedRoute>
                      <AdminUsers />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/installations" 
                  element={
                    <AdminProtectedRoute>
                      <AdminInstallations />
                    </AdminProtectedRoute>
                  } 
                />
                
                {/* Not found route */}
                <Route path="*" element={
                  <div className="flex flex-col min-h-screen">
                    <NotFound />
                    <Footer />
                  </div>
                } />
              </Routes>
            </div>
          </BrowserRouter>
        </AIProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
