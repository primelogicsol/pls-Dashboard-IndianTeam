"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2 } from "lucide-react";
import { getAllContactUsMessages, trashAMessage } from "@/lib/api/contact";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

const MessagesPage = () => {
  interface Message {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    message: string;
    createdAt: string;
    from: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllContactUsMessages(page);
      if (response.data) {
        setMessages(response.data.messages || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handleTrashMessage = useCallback(async (id: string) => {
    try {
      await trashAMessage(id);
      toast.success("Message successfully moved to trash!");
      // setMessages((prev) => prev.filter((msg) => msg.id !== id)); // Optimistic UI update (optional)
      fetchMessages(); // Refetch messages after trashing
    } catch (error) {
      console.error("Error trashing message:", error);
      toast.error("Failed to trash the message. Please try again.");
    }
  }, []);

  // **Optimized Filtering with useMemo**
  const filteredMessages = useMemo(() => {
    const searchQuery = search.toLowerCase().trim();
    return messages.filter((msg) => {
      const messageDate = new Date(msg.createdAt);
      const matchesSearch =
        msg.email.toLowerCase().includes(searchQuery) ||
        msg.firstName.toLowerCase().includes(searchQuery) ||
        msg.lastName.toLowerCase().includes(searchQuery) ||
        msg.from.toLowerCase().includes(searchQuery);

      const matchesDate =
        (!fromDate || messageDate >= new Date(fromDate)) &&
        (!toDate || messageDate <= new Date(toDate));

      return matchesSearch && matchesDate;
    });
  }, [messages, search, fromDate, toDate]);

  if(!isAuthorized) return null;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Messages for Review!!</h2>

      {/* Search & Filters Row */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search by Name or Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />

        {/* Date Inputs (Native) */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">From:</label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label className="text-sm font-medium">To:</label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-bold">Name</TableHead>
              <TableHead className="text-center font-bold">Email</TableHead>
              <TableHead className="text-center font-bold">Message</TableHead>
              <TableHead className="text-center font-bold">Date</TableHead>
              <TableHead className="text-center font-bold">User Role</TableHead>
              <TableHead className="text-center font-bold">Actions</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <Loader2 className="animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="text-center">
                    {msg.firstName} {msg.lastName}
                  </TableCell>
                  <TableCell className="text-center">{msg.email}</TableCell>
                  <TableCell className="text-center">
                    {msg.message.length > 50 ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="text-blue-500">
                            {msg.message.substring(0, 25)}...
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Full Message</DialogTitle>
                          </DialogHeader>
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      msg.message
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {format(new Date(msg.createdAt), "PPP")}
                  </TableCell>
                  <TableCell className="text-center">{msg.from}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="destructive"
                      onClick={() => handleTrashMessage(msg.id)}
                    >
                      <Trash2 className="w-5 h-5 mr-2" /> Trash
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No messages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
