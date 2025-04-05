
import React from "react";
import DynamicHeader from "@/components/DynamicHeader";
import Dashboard from "./Dashboard";
import NetworkingBanner from "@/components/NetworkingBanner";

const Index = () => {
  return (
    <>
      <DynamicHeader />
      <NetworkingBanner 
        title="EskomSiteIQ Network Monitoring" 
        subtitle="AI-powered real-time insights for your network infrastructure"
      />
      <Dashboard />
    </>
  );
};

export default Index;
