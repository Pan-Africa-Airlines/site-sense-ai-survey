
import React from "react";
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
import EskomSurvey from "./pages/EskomSurvey";
import EskomSurveys from "./pages/EskomSurveys";
import AdminMap from "./pages/AdminMap";
import MyAllocations from "./pages/MyAllocations";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);
  
  React.useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);
  
  if (isLoggedIn === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AIProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="flex flex-col min-h-screen">
              <Routes>
                <Route path="/login" element={
                  <>
                    <Login />
                    <Footer />
                  </>
                } />
                
                <Route path="/admin/login" element={
                  <>
                    <AdminLogin />
                    <Footer />
                  </>
                } />
                
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
                  path="/my-allocations" 
                  element={
                    <ProtectedRoute>
                      <div className="flex flex-col min-h-screen">
                        <MyAllocations />
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/eskom-survey" 
                  element={
                    <ProtectedRoute>
                      <div className="flex flex-col min-h-screen">
                        <EskomSurvey />
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/eskom-surveys" 
                  element={
                    <ProtectedRoute>
                      <div className="flex flex-col min-h-screen">
                        <EskomSurveys />
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
                      <Configuration />
                    </AdminProtectedRoute>
                  } 
                />
                
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
                <Route 
                  path="/admin/map" 
                  element={
                    <AdminProtectedRoute>
                      <AdminMap />
                    </AdminProtectedRoute>
                  } 
                />
                
                <Route path="*" element={
                  <div className="flex flex-col min-h-screen">
                    <NotFound />
                    <Footer />
                  </div>
                } />
              </Routes>
            </div>
          </TooltipProvider>
        </BrowserRouter>
      </AIProvider>
    </QueryClientProvider>
  );
};

export default App;
