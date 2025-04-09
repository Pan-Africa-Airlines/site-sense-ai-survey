
import React, { useState } from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserFormFieldsProps {
  control?: Control<any>;
  formData?: any;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isEditing?: boolean;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  control,
  formData,
  handleInputChange,
  isEditing = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  // Determine if we're using React Hook Form or controlled inputs
  const isUsingHookForm = !!control;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const roles = [
    { value: "Field Engineer", label: "Field Engineer" },
    { value: "Supervisor", label: "Supervisor" },
    { value: "Administrator", label: "Administrator" },
  ];

  const experienceLevels = [
    { value: "Junior", label: "Junior (0-2 years)" },
    { value: "Mid-level", label: "Mid-level (2-5 years)" },
    { value: "Senior", label: "Senior (5+ years)" },
  ];

  if (isUsingHookForm) {
    // Using React Hook Form
    return (
      <>
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
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditing ? "New Password (Optional)" : "Password"}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={isEditing ? "Leave blank to keep current" : "••••••••"} 
                    {...field} 
                    required={!isEditing}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  } else {
    // Using controlled components
    return (
      <>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData?.name || ""}
            onChange={handleInputChange}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            value={formData?.email || ""}
            onChange={handleInputChange}
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            {isEditing ? "New Password (Optional)" : "Password"}
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData?.password || ""}
              onChange={handleInputChange}
              placeholder={isEditing ? "Leave blank to keep current" : "••••••••"}
              required={!isEditing}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData?.role || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="experience" className="text-sm font-medium">
            Experience Level
          </label>
          <select
            id="experience"
            name="experience"
            value={formData?.experience || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            {experienceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  }
};

export default UserFormFields;
