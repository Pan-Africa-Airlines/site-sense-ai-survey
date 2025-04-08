
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import our new components
import LoginForm from "@/components/auth/LoginForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import PasswordResetSuccess from "@/components/auth/PasswordResetSuccess";
import LoginBranding from "@/components/auth/LoginBranding";
import LoginHeader from "@/components/auth/LoginHeader";

const Login = () => {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Background with overlay and image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90 dark:from-gray-950/90 dark:via-gray-900/90 dark:to-black/90">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" 
             style={{backgroundImage: "url('/lovable-uploads/47596378-d2cb-4456-a4b6-34e2a2abfdba.png')"}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/20 to-gray-900/50"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md border-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
            <CardHeader className="space-y-1 pt-6 pb-2">
              <LoginBranding />
            </CardHeader>
            <CardContent className="pt-6">
              <LoginHeader />
              <LoginForm onForgotPassword={() => setForgotPasswordOpen(true)} />
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 pt-4 pb-6 px-8">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Powered by Akhanya IT Innovations
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          {resetSent ? (
            <PasswordResetSuccess 
              email={resetEmail} 
              onClose={() => {
                setForgotPasswordOpen(false);
                setResetSent(false);
                setResetEmail("");
              }} 
            />
          ) : (
            <ForgotPasswordForm 
              email={resetEmail}
              setEmail={setResetEmail}
              onSuccess={() => setResetSent(true)}
              onCancel={() => setForgotPasswordOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
