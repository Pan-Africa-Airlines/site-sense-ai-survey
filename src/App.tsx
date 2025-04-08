
import React, { useState } from "react";
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
import NotFound from "./pages/NotFound";
import Assessment from "./pages/Assessment";
import EskomSurveys from "./pages/EskomSurveys";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Landing and public pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Engineer pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/eskom-survey/new" element={<EskomSurvey />} />
          <Route path="/eskom-survey/:id" element={<EskomSurvey />} />
          <Route path="/eskom-surveys" element={<EskomSurveys />} />
          <Route path="/installation" element={<Installation />} />
          <Route path="/my-allocations" element={<MyAllocations />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/car-checkup" element={<CarCheckup />} />
          
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
          
          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
