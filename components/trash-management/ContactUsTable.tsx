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
import { getTrashedContactUs, UntrashAMessage } from "@/lib/api/contact"; // Adjust import if needed
import axios from "axios";
import { getUserDetails } from "@/lib/api/storage";
import { format } from "date-fns"; // Import date-fns
import { toast } from "sonner";

interface Message {
  id: number;
  email: string;
  message: string;
  trashedBy: string;
  trashedAt: string;
  createdAt: string;
}

export default function MessagesTable() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTrashedMessages();
  }, []);

  async function fetchTrashedMessages() {
    setLoading(true);
    try {
      const response = await getTrashedContactUs();
      if (response?.data) {
        setMessages(response.data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching trashed messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestoreMessage(id: number) {
    try {
      const response = await UntrashAMessage(id);
      console.log(response);
      if(response.status === 200) {
        toast.success("Message untrsahed successfully");
      }
      fetchTrashedMessages(); // Refresh the table
    } catch (error) {
      console.error("Error restoring message:", error);
    }
  }

  async function handleDeleteMessage() {
    if (!deleteMessageId) return;
    try {
      const userDetails = getUserDetails();
      const accessToken = userDetails?.accessToken;

      await axios.delete(`/api/v1/trash/deleteMessage/${deleteMessageId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      fetchTrashedMessages();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  // **Pagination Logic**
  const totalMessages = messages.length;
  const totalPages = Math.ceil((messages.length || 1) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, messages.length);
  const paginatedMessages = messages.slice(startIndex, endIndex);

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
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Trashed By</TableHead>
            <TableHead>Trashed At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMessages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No messages found
              </TableCell>
            </TableRow>
          ) : (
            paginatedMessages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell>{msg.email}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {msg.message}
                </TableCell>
                <TableCell>{msg.trashedBy}</TableCell>
                <TableCell>{msg.trashedAt ? format(new Date(msg.trashedAt), "PPP") : "N/A"}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => handleRestoreMessage(msg.id)}>
                    Restore
                  </Button>
                  <Dialog open={openDialog && deleteMessageId === msg.id} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" onClick={() => { setDeleteMessageId(msg.id); setOpenDialog(true); }}>
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete?</DialogTitle>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteMessage}>Yes, Delete</Button>
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
          Showing {startIndex + 1} - {endIndex} of {totalMessages} entries
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
