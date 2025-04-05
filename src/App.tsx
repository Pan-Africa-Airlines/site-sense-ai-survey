
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
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
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
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessment" 
                element={
                  <ProtectedRoute>
                    <Assessment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/installation" 
                element={
                  <ProtectedRoute>
                    <Installation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/car-check" 
                element={
                  <ProtectedRoute>
                    <CarCheckup />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AIProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
