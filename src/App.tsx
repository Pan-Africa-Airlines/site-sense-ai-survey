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
import CarCheckup from "./pages/CarCheckup";

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/car-checkup" 
            element={loggedIn ? <CarCheckup /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/eskom-survey/:id" 
            element={loggedIn ? <EskomSurvey /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/eskom-survey/new" 
            element={loggedIn ? <EskomSurvey /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/eskom-surveys" 
            element={loggedIn ? <EskomSurveys /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/installation" 
            element={loggedIn ? <Installation /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-allocations" 
            element={loggedIn ? <MyAllocations /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/assessment" 
            element={loggedIn ? <Assessment /> : <Navigate to="/login" />} 
          />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminProtectedRoute><Outlet /></AdminProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="assessments" element={<AdminAssessments />} />
            <Route path="installations" element={<AdminInstallations />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="map" element={<AdminMap />} />
            <Route path="site-allocation" element={<AdminSiteAllocation />} />
            <Route path="system-logs" element={<AdminSystemLogs />} />
            <Route path="configuration" element={<Configuration />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
