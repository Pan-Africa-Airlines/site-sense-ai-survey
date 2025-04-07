
import React, { useEffect } from "react";
import NavigationBar from "@/components/navigation/NavigationBar";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
      return;
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <Dashboard />
    </div>
  );
};

export default Index;
