
import React from "react";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { Loader } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, onCancel }) => {
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
        ) : "Create User"}
      </Button>
    </SheetFooter>
  );
};

export default FormActions;
