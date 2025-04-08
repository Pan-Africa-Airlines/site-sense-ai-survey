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

// ... keep existing code (App function and other components)
