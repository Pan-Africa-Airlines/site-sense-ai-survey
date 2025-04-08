
import React from "react";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { Loader } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  submitLabel?: string;
  submitText?: string; // Added for backward compatibility
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  onCancel, 
  submitLabel,
  submitText
}) => {
  // Use submitText or submitLabel or fall back to default
  const buttonText = submitText || submitLabel || "Create User";
  
  return (
    <SheetFooter className="mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-akhanya hover:bg-akhanya-dark"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className="h-4 w-4 animate-spin mr-2" />
            Creating...
          </>
        ) : buttonText}
      </Button>
    </SheetFooter>
  );
};

export default FormActions;
