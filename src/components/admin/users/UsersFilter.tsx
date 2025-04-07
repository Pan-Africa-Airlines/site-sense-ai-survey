
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UsersFilterProps {
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

const UsersFilter: React.FC<UsersFilterProps> = ({
  searchQuery,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center relative flex-1">
            <Search className="absolute left-2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search users..." 
              className="pl-8" 
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
          <div className="flex gap-4">
            <Select 
              defaultValue="all" 
              value={roleFilter}
              onValueChange={onRoleFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="field engineer">Field Engineer</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="administrator">Administrator</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              defaultValue="all"
              value={statusFilter}
              onValueChange={onStatusFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersFilter;
