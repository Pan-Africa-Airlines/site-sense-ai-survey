
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, Eye, Edit, Trash2 } from "lucide-react";
import EditUserForm from "./EditUserForm";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: string;
  experience: string;
  regions: string[];
}

interface UsersListProps {
  users: User[];
  isLoading: boolean;
  onUserUpdated?: (updatedUser: User) => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, isLoading, onUserUpdated = () => {} }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader className="h-8 w-8 animate-spin text-akhanya" />
        <span className="ml-2">Loading engineer profiles...</span>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Regions</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              No users found matching your criteria
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.experience}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.regions && user.regions.length > 0 ? user.regions.map((region, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {region}
                    </Badge>
                  )) : (
                    <span className="text-gray-400 text-sm">No regions</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <EditUserForm user={user} onUserUpdated={onUserUpdated} />
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UsersList;
