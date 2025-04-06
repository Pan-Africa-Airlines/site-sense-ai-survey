
import React, { useEffect } from "react";
import NavigationBar from "@/components/NavigationBar";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);
  
  return (
    <>
      <NavigationBar />
      <Dashboard />
    </>
  );
};

export default Index;
