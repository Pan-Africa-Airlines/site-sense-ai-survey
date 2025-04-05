
import React from "react";
import NavigationBar from "@/components/NavigationBar";
import Dashboard from "./Dashboard";
import NetworkingBanner from "@/components/NetworkingBanner";

const Index = () => {
  return (
    <>
      <NavigationBar />
      <NetworkingBanner 
        title="SiteSense Network Monitoring" 
        subtitle="AI-powered real-time insights for your network infrastructure"
      />
      <Dashboard />
    </>
  );
};

export default Index;
