
import React from "react";
import { AIProvider } from "@/contexts/AIContext";
import NavigationBar from "@/components/NavigationBar";
import Dashboard from "./Dashboard";

const Index = () => {
  return (
    <AIProvider>
      <NavigationBar />
      <Dashboard />
    </AIProvider>
  );
};

export default Index;
