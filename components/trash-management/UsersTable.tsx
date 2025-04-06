"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { deleteUser, getTrashedUsers, unTrashUser } from "@/lib/api/users"; // Adjust import if needed
import axios from "axios";
import { getUserDetails } from "@/lib/api/storage";
import { format } from "date-fns"; // Import date-fns
import { toast } from "sonner";

interface User {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  trashedBy: string;
  trashedAt: string;
  createdAt: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTrashedUsers();
  }, []);

  async function fetchTrashedUsers() {
    setLoading(true);
    try {
      const response = await getTrashedUsers();
      if (response?.data) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching trashed users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUntrashUser(uid: string) {
    try {
      const response = await unTrashUser(uid);
      if(response) {
        toast.success("Successfully Untrashed the User");
      }
      fetchTrashedUsers(); // Refresh the table
    } catch (error) {
      console.error("Error untrashing user:", error);
    }
  }

  async function handleDeleteUser() {
    if (!deleteUserId) return;
    try {
      const response = await deleteUser(deleteUserId);
      if(response) {
        toast.success("User has been deleted successfully");
      }
      fetchTrashedUsers();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  // **Pagination Logic**
  const totalUsers = users.length;
  const totalPages = Math.ceil((users.length || 1) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, users.length);
  const paginatedUsers = users.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {/* Dropdown to select number of entries per page */}
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-500">Show entries:</label>
        <Select
          onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}
          defaultValue="10"
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Entries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Trashed By</TableHead>
            <TableHead>Trashed At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            paginatedUsers.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.trashedBy}</TableCell>
                <TableCell>{user.trashedAt ? format(new Date(user.trashedAt), "PPP") : "N/A"}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => handleUntrashUser(user.uid)}>
                    Untrash
                  </Button>
                  <Dialog open={openDialog && deleteUserId === user.uid} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" onClick={() => { setDeleteUserId(user.uid); setOpenDialog(true); }}>
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete?</DialogTitle>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>Yes, Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1} - {endIndex} of {totalUsers} entries
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
