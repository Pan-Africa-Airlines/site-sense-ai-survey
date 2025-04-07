
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Installation from './pages/Installation';
import MyAllocations from './pages/MyAllocations';
import CarCheckup from './pages/CarCheckup';
import EskomSurvey from './pages/EskomSurvey';
import EskomSurveys from './pages/EskomSurveys';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminAssessments from './pages/AdminAssessments';
import AdminInstallations from './pages/AdminInstallations';
import AdminMap from './pages/AdminMap';
import AdminUsers from './pages/AdminUsers';
import Configuration from './pages/Configuration';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import { Toaster } from "sonner";
import AdminSiteAllocation from './pages/AdminSiteAllocation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/installation" element={<Installation />} />
            <Route path="/my-allocations" element={<MyAllocations />} />
            <Route path="/car-checkup" element={<CarCheckup />} />
            <Route path="/eskom-survey/:id" element={<EskomSurvey />} />
            <Route path="/eskom-survey/new" element={<EskomSurvey />} />
            <Route path="/eskom-surveys" element={<EskomSurveys />} />
            {/* Add redirect for eskom-site-survey to eskom-survey/new */}
            <Route path="/eskom-site-survey" element={<Navigate to="/eskom-survey/new" replace />} />
            {/* Add redirect for car-check to car-checkup */}
            <Route path="/car-check" element={<Navigate to="/car-checkup" replace />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/assessments" element={<AdminAssessments />} />
            <Route path="/admin/installations" element={<AdminInstallations />} />
            <Route path="/admin/map" element={<AdminMap />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/site-allocation" element={<AdminSiteAllocation />} />
            <Route path="/configuration" element={<Configuration />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <Toaster />
        </Router>
      </div>
    </QueryClientProvider>
  );
};

export default App;
