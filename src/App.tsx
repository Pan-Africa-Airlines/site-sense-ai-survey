
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import Dashboard from "./pages/Dashboard";
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
import EngineerDashboard from "./pages/EngineerDashboard";
import LandingPage from "./pages/LandingPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            {/* Landing Page with dashboard choices */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Engineer routes */}
            <Route path="/dashboard" element={
              <>
                <NavigationBar />
                <Dashboard />
              </>
            } />
            
            <Route path="/engineer-dashboard" element={<EngineerDashboard />} />
            
            <Route path="/eskom-survey/new" element={
              <>
                <NavigationBar />
                <EskomSurvey />
              </>
            } />
            
            <Route path="/installation" element={
              <>
                <NavigationBar />
                <Installation />
              </>
            } />
            
            <Route path="/my-allocations" element={
              <>
                <NavigationBar />
                <MyAllocations />
              </>
            } />
            
            <Route path="/car-checkup" element={
              <>
                <NavigationBar />
                <div className="container mx-auto py-8">
                  <h1 className="text-2xl font-bold mb-4">Vehicle Check</h1>
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                    <p>Vehicle check functionality will be implemented here.</p>
                  </div>
                </div>
              </>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminProtectedRoute><Outlet /></AdminProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="assessments" element={<AdminAssessments />} />
              <Route path="installations" element={<AdminInstallations />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="map" element={<AdminMap />} />
              <Route path="site-allocation" element={<AdminSiteAllocation />} />
              <Route path="system-logs" element={<AdminSystemLogs />} />
            </Route>

            <Route path="/configuration" element={<Configuration />} />
            
            {/* Catch any other routes and redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
