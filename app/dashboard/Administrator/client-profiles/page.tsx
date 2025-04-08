"use client";

import { useEffect, useState } from "react";
import { getAllClientProfiles, trashUser } from "@/lib/api/users";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

interface User {
  uid: string;
  username: string;
  fullName: string;
  email: string;
  emailVerifiedAt: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  projects: any[];
  address: string | null;
  phone: string | null;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalUsers: 0,
    currentPage: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [pagination.currentPage]);


  const fetchUsers = async (page: number) => {
    try {
      const data = await getAllClientProfiles(page);
      setUsers(data.data.users);
      setFilteredUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(value) ||
          user.email.toLowerCase().includes(value) || 
          user.fullName.toLowerCase().includes(value) 
      )
    );
  };

  const handleTrashUser = async (uid: string) => {
    try {
      const response = await trashUser(uid);
      if (response) {
        toast.success("User has been trashed successfully");
        // Fetch the updated user list
        fetchUsers(pagination.currentPage);
      }
    } catch (error) {
      console.error("Error trashing user:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to trash user. Please try again."
      );
    }
  };
  
  if(!isAuthorized) return null;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="">Manage and Empower Your Users</h1>
      </div>
      {/* Search Bar */}
      <Input
        placeholder="Search by username or email..."
        value={search}
        onChange={handleSearch}
      />

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Email Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 border rounded text-sm font-medium ${
                      user.emailVerifiedAt
                        ? "border-green-500 text-green-500"
                        : "border-red-500 text-red-500"
                    }`}
                  >
                    {user.emailVerifiedAt ? "Verified" : "Not Verified"}
                  </span>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => {
                    setSelectedUser(user);
                    setIsDialogOpen(true);
                  }}>
                    <Eye className="h-2 w-2"/>
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={() => handleTrashUser(user.uid)}
                  >
                    <Trash2 className="w-4 h-4" /> Trash
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No clients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2">
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Email Verified:</strong> {selectedUser.emailVerifiedAt ? "Yes" : "No"}</p>
              <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</p>
              <p><strong>Phone:</strong> {selectedUser.phone || "N/A"}</p>
              <p><strong>Address:</strong> {selectedUser.address || "N/A"}</p>
              <p><strong>Projects:</strong> {selectedUser.projects.length > 0 ? selectedUser.projects.join(", ") : "None"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-600">
          Page {pagination.currentPage} - {pagination.totalPages} 
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!pagination.hasPreviousPage}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage - 1,
              }))
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
              }))
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
