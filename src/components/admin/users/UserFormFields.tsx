
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFormFieldsProps {
  formData: {
    name: string;
    email: string;
    password: string;
    role: string;
    experience?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isEditing?: boolean;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ 
  formData, 
  handleInputChange,
  isEditing = false
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
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
            value={formData.email}
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
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            required={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select 
            name="role" 
            value={formData.role} 
            onValueChange={(value) => {
              const event = {
                target: { name: "role", value }
              } as React.ChangeEvent<HTMLSelectElement>;
              handleInputChange(event);
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
          value={formData.experience || ""}
          onChange={handleInputChange}
          placeholder="e.g. 5"
        />
      </div>
    </>
  );
};

export default UserFormFields;
