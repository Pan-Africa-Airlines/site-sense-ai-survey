
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoginPageLayout from "@/components/auth/LoginPageLayout";
import LoginForm from "@/components/auth/LoginForm";
import { UserRole } from "@/types/user";

const Login = () => {
  const [initialRole, setInitialRole] = useState<UserRole>("engineer");
  const [initialEmail, setInitialEmail] = useState("");
  const [initialPassword, setInitialPassword] = useState("");
  const location = useLocation();

  // Check for role preselection from URL params and set up test credentials
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    
    if (roleParam === 'admin') {
      setInitialRole('admin');
    }
    
    // For development: pre-fill test credentials
    if (process.env.NODE_ENV === 'development') {
      if (roleParam === 'admin') {
        setInitialEmail("admin@akhanya.co.za");
        setInitialPassword("admin123");
      } else {
        setInitialEmail("siyanda@akhanya.co.za");
        setInitialPassword("password123");
      }
    }
  }, [location]);

  return (
    <LoginPageLayout 
      title="Sign in to your account"
      description="Enter your credentials to access the platform"
    >
      <LoginForm 
        initialRole={initialRole} 
        initialEmail={initialEmail}
        initialPassword={initialPassword}
      />
    </LoginPageLayout>
  );
};

export default Login;
