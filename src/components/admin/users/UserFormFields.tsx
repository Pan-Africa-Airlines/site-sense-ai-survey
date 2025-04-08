
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, Controller } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface UserFormFieldsProps {
  formData?: {
    name: string;
    email: string;
    password: string;
    role: string;
    experience?: string;
  };
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isEditing?: boolean;
  control?: Control<any>;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ 
  formData, 
  handleInputChange,
  isEditing = false,
  control
}) => {
  // If using react-hook-form with control prop
  if (control) {
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isEditing ? "New Password (leave blank to keep current)" : "Password"}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    required={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
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
                    <SelectItem value="Senior Engineer">Senior Engineer</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience (years)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }
  
  // If using controlled inputs with formData
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData?.name || ""}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData?.email || ""}
            onChange={handleInputChange}
            placeholder="john.doe@example.com"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">
            {isEditing ? "New Password (leave blank to keep current)" : "Password"}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData?.password || ""}
            onChange={handleInputChange}
            placeholder="••••••••"
            required={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select 
            name="role" 
            value={formData?.role || ""} 
            onValueChange={(value) => {
              if (handleInputChange) {
                const event = {
                  target: { name: "role", value }
                } as React.ChangeEvent<HTMLSelectElement>;
                handleInputChange(event);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Field Engineer">Field Engineer</SelectItem>
              <SelectItem value="Senior Engineer">Senior Engineer</SelectItem>
              <SelectItem value="Supervisor">Supervisor</SelectItem>
              <SelectItem value="Administrator">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="experience">Experience (years)</Label>
        <Input
          id="experience"
          name="experience"
          value={formData?.experience || ""}
          onChange={handleInputChange}
          placeholder="e.g. 5"
        />
      </div>
    </>
  );
};

export default UserFormFields;
