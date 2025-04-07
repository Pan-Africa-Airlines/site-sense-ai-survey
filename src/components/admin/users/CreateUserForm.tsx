
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
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
    setIsSubmitting(true);
    
    try {
      console.log("Creating new user with data:", data);
      
      const newUserId = uuidv4();
      
      const { data: newEngineer, error } = await supabase
        .from("engineer_profiles")
        .insert({
          id: newUserId,
          name: data.name,
          email: data.email,
          specializations: [data.role],
          regions: data.regions,
          experience: data.experience || "New",
          average_rating: 0,
          total_reviews: 0,
        })
        .select();
      
      if (error) {
        console.error("Error creating user:", error);
        throw error;
      }
      
      if (newEngineer && newEngineer.length > 0) {
        const newUser = {
          id: newEngineer[0].id,
          name: newEngineer[0].name,
          email: newEngineer[0].email,
          role: newEngineer[0].specializations[0],
          status: "active",
          experience: newEngineer[0].experience,
          regions: newEngineer[0].regions,
        };
        
        onUserCreated(newUser);
      }
      
      toast.success("User created successfully");
      form.reset();
      setSelectedRegions([]);
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setIsSubmitting(false);
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Field Engineer">Field Engineer</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="regions"
              render={() => (
                <FormItem>
                  <FormLabel>Regions</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <Badge 
                        key={region}
                        variant={selectedRegions.includes(region) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleRegionChange(region)}
                      >
                        {region}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 3 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <SheetFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseSheet}
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
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateUserForm;
