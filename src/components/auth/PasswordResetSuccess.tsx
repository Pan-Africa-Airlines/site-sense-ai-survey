
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface PasswordResetSuccessProps {
  email: string;
  onClose: () => void;
}

const PasswordResetSuccess: React.FC<PasswordResetSuccessProps> = ({ email, onClose }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-green-100 p-2">
          <div className="rounded-full bg-green-500 p-1">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
      <p className="text-center text-sm">
        Password reset email sent to <span className="font-medium">{email}</span>.
        Please check your inbox and follow the instructions.
      </p>
      <Button 
        className="w-full" 
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  );
};

export default PasswordResetSuccess;
