
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import UserFormFields from "./UserFormFields";
import RegionSelector from "./RegionSelector";
import FormActions from "./FormActions";
import { useUserCreation } from "@/hooks/useUserCreation";

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string(),
  regions: z.string().array().min(1, "Please select at least one region"),
  experience: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface CreateUserFormProps {
  onUserCreated: (newUser: any) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onUserCreated }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const { createUser, isSubmitting } = useUserCreation();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Field Engineer",
      regions: [],
      experience: "",
    },
  });

  const handleRegionChange = (region: string) => {
    setSelectedRegions((current) => {
      const isSelected = current.includes(region);
      if (isSelected) {
        return current.filter(r => r !== region);
      } else {
        return [...current, region];
      }
    });
  };

  useEffect(() => {
    form.setValue("regions", selectedRegions);
  }, [selectedRegions, form]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      const newUser = await createUser(data);
      onUserCreated(newUser);
      form.reset();
      setSelectedRegions([]);
      setIsSheetOpen(false);
    } catch (error) {
      // Error is already handled in the hook
      console.error("Error in form submission:", error);
    }
  };

  const handleCloseSheet = () => {
    form.reset();
    setSelectedRegions([]);
    setIsSheetOpen(false);
  };

  const regions = [
    "Gauteng",
    "Western Cape",
    "Eastern Cape",
    "KwaZulu-Natal",
    "Free State",
    "North West",
    "Mpumalanga",
    "Limpopo",
    "Northern Cape",
  ];

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button className="bg-akhanya hover:bg-akhanya-dark" onClick={() => setIsSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Add New User</SheetTitle>
          <SheetDescription>
            Create a new user account for an engineer or supervisor.
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserFormFields control={form.control} />
            
            <FormField
              control={form.control}
              name="regions"
              render={() => (
                <RegionSelector 
                  selectedRegions={selectedRegions}
                  onRegionChange={handleRegionChange}
                  regions={regions}
                />
              )}
            />
            
            <FormActions 
              isSubmitting={isSubmitting} 
              onCancel={handleCloseSheet} 
            />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateUserForm;
