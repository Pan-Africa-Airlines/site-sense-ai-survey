
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import NetworkingBanner from "@/components/NetworkingBanner";
import FormFieldsConfiguration from "@/components/FormFieldsConfiguration";
import { toast } from "sonner";

const Configuration = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem("adminLoggedIn") === "true";
    const adminUsername = localStorage.getItem("adminUsername");
    
    if (!isAdmin || !adminUsername) {
      toast.error("Unauthorized access. Admin login required.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <NetworkingBanner
        title="Form Configuration"
        subtitle="Customize assessment and installation forms to meet your needs"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-akhanya">Form Configuration</h2>
          <p className="text-gray-600">
            Add, delete, or modify form fields to create custom assessment forms
          </p>
        </div>
        
        <FormFieldsConfiguration />
      </div>
    </div>
  );
};

export default Configuration;
