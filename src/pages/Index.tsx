
import React from "react";
import DynamicHeader from "@/components/DynamicHeader";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
      <DynamicHeader />
      <Dashboard />
    </>
  );
};

export default Index;
