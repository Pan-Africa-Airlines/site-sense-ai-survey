
import React from "react";
import { DashboardProvider } from "@/contexts/DashboardContext";
import EngineerDashboardContainer from "@/components/dashboard/EngineerDashboardContainer";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Check for legacy login method (for backward compatibility)
          const loggedIn = localStorage.getItem("loggedIn");
          if (!loggedIn) {
            navigate("/login");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast("Authentication error. Please log in again.");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akhanya"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <DashboardProvider>
        <EngineerDashboardContainer />
      </DashboardProvider>
    </div>
  );
};

export default Dashboard;
