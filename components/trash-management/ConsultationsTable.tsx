"use client";

import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getTrashedConsultations } from "@/lib/api/projects";
import { Consultation } from "@/types/consultation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { deleteAConsultation, untrashAConsultation } from "@/lib/api/consultations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function ConsultationsTable() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<
    { from: Date; to: Date } | undefined
  >(undefined);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 entries per page

  const { isAuthorized } = useAuth(["ADMIN"]);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTrashedConsultations();
      if (response.success) {
        setConsultations(response.data);
      } else {
        throw new Error("Invalid data format received from the server");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch consultations";
      setError(errorMessage);
      toast.error(errorMessage);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search, filters, or itemsPerPage change
  }, [searchTerm, dateRange, itemsPerPage]);

  const filteredConsultations = (consultations ?? []).filter((consultation) => {
    const name = consultation.name?.toLowerCase() || "";
    const email = consultation.email?.toLowerCase() || "";
    const phone = consultation.phone?.toLowerCase() || "";
    const subject = consultation.subject?.toLowerCase() || "";
    const message = consultation.message?.toLowerCase() || "";

    const searchQuery = searchTerm.toLowerCase();

    const matchesSearch =
      name.includes(searchQuery) ||
      email.includes(searchQuery) ||
      phone.includes(searchQuery) ||
      subject.includes(searchQuery) ||
      message.includes(searchQuery);

    let matchesDateRange = true;
    if (dateRange?.from && dateRange?.to) {
      const consultationDate = new Date(consultation.bookingDate);
      matchesDateRange =
        consultationDate >= dateRange.from && consultationDate <= dateRange.to;
    }

    return matchesSearch && matchesDateRange;
  });

  const sortedConsultations = [...filteredConsultations].sort((a, b) => {
    if (!a.bookingDate || !b.bookingDate) return 0;
    const dateA = new Date(a.bookingDate).getTime();
    const dateB = new Date(b.bookingDate).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredConsultations.length / itemsPerPage)
  );

  const paginatedConsultations = sortedConsultations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!isAuthorized) return null;

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteAConsultation(id);
      if (response?.status === 200) {
        toast.success("Successfully deleted the consultation");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleUntrash = async (id: string) => {
    try {
      const response = await untrashAConsultation(id);
      if (response?.status === 200) {
        toast.success("Successfully Untrashed the consultation");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Consultation Requests</h1>
      </div>

      <div className="mb-4 flex justify-between items-center space-x-4">
        <Input
          type="text"
          placeholder="Search by name, email, phone, subject, or message"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} entries
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <div className="grid gap-2">
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              type="date"
              onChange={(e) => {
                const from = e.target.value
                  ? new Date(e.target.value)
                  : undefined;
                const to = dateRange?.to;
                setDateRange(from ? { from, to: to || from } : undefined);
              }}
              value={
                dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="date"
              onChange={(e) => {
                const to = e.target.value
                  ? new Date(e.target.value)
                  : undefined;
                const from = dateRange?.from;
                setDateRange(to && from ? { from, to } : undefined);
              }}
              value={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-left py-3 px-4">Name</TableHead>
              <TableHead className="text-left py-3 px-4">
                Contact Number
              </TableHead>
              <TableHead className="text-left py-3 px-4">Message</TableHead>
              <TableHead className="text-center py-3 px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedConsultations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No consultations found
                </TableCell>
              </TableRow>
            ) : (
              paginatedConsultations.map((consultation) => (
                <TableRow key={consultation.id} className="border-b">
                  <TableCell className="py-3 px-4">
                    {consultation.name}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {consultation.phone}
                  </TableCell>
                  <TableCell className="py-3 px-4 max-w-xs truncate">
                    {consultation.message.length > 50 ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="text-blue-500">
                            {consultation.message.substring(0, 25)}...
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Full Message</DialogTitle>
                          </DialogHeader>
                          <p className="whitespace-pre-wrap">
                            {consultation.message}
                          </p>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      consultation.message
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedConsultation(consultation)}
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Consultation Details</DialogTitle>
                        </DialogHeader>
                        {selectedConsultation && (
                          <div className="grid grid-cols-1 gap-2">
                            <p>
                              <strong>Name:</strong> {selectedConsultation.name}
                            </p>
                            <p>
                              <strong>Email:</strong>{" "}
                              {selectedConsultation.email}
                            </p>
                            <p>
                              <strong>Phone:</strong>{" "}
                              {selectedConsultation.phone}
                            </p>
                            <p>
                              <strong>Subject:</strong>{" "}
                              {selectedConsultation.subject}
                            </p>
                            <p>
                              <strong>Message:</strong>{" "}
                              {selectedConsultation.message}
                            </p>
                            <p>
                              <strong>Status:</strong>{" "}
                              {selectedConsultation.status}
                            </p>
                            <p>
                              <strong>Address:</strong>{" "}
                              {selectedConsultation.address}
                            </p>
                            <p>
                              <strong>Trashed By:</strong>{" "}
                              {selectedConsultation.trashedBy}
                            </p>
                            <p>
                              <strong>Trashed At:</strong>{" "}
                              {format(
                                new Date(selectedConsultation.trashedAt),
                                "PPP"
                              )}
                            </p>
                            <p>
                              <strong>Booking Date:</strong>{" "}
                              {format(
                                new Date(selectedConsultation.bookingDate),
                                "PPP"
                              )}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 mt-4">
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(consultation.id)}
                              >
                                Delete
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleUntrash(consultation.id)}
                              >
                                Untrash
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredConsultations.length)}{" "}
          of {filteredConsultations.length} entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default ConsultationsTable;
