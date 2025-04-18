
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Loader } from "lucide-react";
import { toast } from "sonner";
import RegionSelector from "./RegionSelector";
import UserFormFields from "./UserFormFields";
import FormActions from "./FormActions";
import { supabase } from "@/integrations/supabase/client";
import { updateEngineerProfile } from "@/utils/dbHelpers";

interface EditUserFormProps {
  user: {
    id: string | number;
    name: string;
    email: string;
    role: string;
    status: string;
    experience: string;
    regions: string[];
  };
  onUserUpdated: (updatedUser: any) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onUserUpdated }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: "", // Password field will be optional for editing
    role: user.role,
    regions: user.regions || [],
    experience: user.experience || ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionsChange = (regions: string[]) => {
    setFormData((prev) => ({ ...prev, regions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      console.log("Updating user:", user.id, "with data:", formData);
      
      // Update engineer profile in the database
      await updateEngineerProfile(user.id.toString(), {
        name: formData.name,
        email: formData.email,
        specializations: [formData.role], // Store role as a specialization
        regions: formData.regions,
        experience: formData.experience || user.experience
      });
      
      // Update password if provided (note: this would typically require special handling)
      if (formData.password && formData.password.trim() !== "") {
        console.log("Password updates would typically require an Auth API call");
        toast.info("Password updates are simulated in this demo");
      }
      
      // Log the action in system_logs
      await supabase
        .from("system_logs")
        .insert({
          user_id: user.id.toString(),
          user_name: formData.name,
          action: "user_updated",
          details: { 
            id: user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role
          }
        });
      
      const updatedUser = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: user.status,
        experience: formData.experience || user.experience,
        regions: formData.regions
      };
      
      onUserUpdated(updatedUser);
      
      toast.success(`User ${formData.name} has been updated successfully.`);
      setOpen(false);
    } catch (error) {
      console.error("Error in edit user form:", error);
      toast.error("Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <UserFormFields 
            formData={formData} 
            handleInputChange={handleInputChange} 
            isEditing={true}
          />
          
          <RegionSelector
            selectedRegions={formData.regions}
            onChange={handleRegionsChange}
            regions={[
              "Gauteng",
              "Western Cape",
              "Eastern Cape",
              "KwaZulu-Natal",
              "Free State",
              "North West",
              "Mpumalanga",
              "Limpopo",
              "Northern Cape",
            ]}
          />
          
          <DialogFooter>
            <FormActions 
              onCancel={() => setOpen(false)} 
              isSubmitting={isSubmitting} 
              submitText="Update User"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;
