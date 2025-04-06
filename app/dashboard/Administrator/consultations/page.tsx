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
import { Textarea } from "@/components/ui/textarea";
import {
  acceptAConsultation,
  getAllConsultations,
  rejectAConsultation,
  trashAConsultation,
} from "@/lib/api/consultations";
import { Consultation } from "@/types/consultation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Link, Plus, RefreshCw, Trash2 } from "lucide-react";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<
    { from: Date; to: Date } | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllConsultations();
      if (response.success && Array.isArray(response.data)) {
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
  }, []);

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchTerm.toLowerCase());

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
    Math.ceil(sortedConsultations.length / itemsPerPage)
  );
  const paginatedConsultations = sortedConsultations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Consultations
          </h2>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (id: string, status: string) => {
    if (status === "ACCEPTED") {
      try {
        const response = await acceptAConsultation(id);
        if (response.success) {
          setConsultations((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...c,
                    status: status as "PENDING" | "ACCEPTED" | "REJECTED",
                  }
                : c
            )
          );
          toast.success("Consultation request accepted successfully");
        }
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          error?.response?.data?.message ||
          "Failed to trash the consultation request";
        toast.error(errorMessage);
      }
    }
    if (status === "REJECTED") {
      try {
        const response = await rejectAConsultation(id);
        if (response.success) {
          setConsultations((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...c,
                    status: status as "PENDING" | "ACCEPTED" | "REJECTED",
                  }
                : c
            )
          );
          toast.success("Consultation request Rejected successfully");
        }
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          error?.response?.data?.message ||
          "Failed to trash the consultation request";
        toast.error(errorMessage);
      }
    }
  };

  const handleTrashConsultation = async (id: string) => {
    try {
      const response = await trashAConsultation(id);
      if (response.success) {
        setConsultations((prev) => prev.filter((c) => c.id !== id));
        toast.success("Consultation request trashed successfully");
      } else {
        toast.error(
          response.message || "Failed to trash the consultation request"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to trash the consultation request";
      toast.error(errorMessage);
    }
  };

  if(!isAuthorized) return null;

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
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
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
      <Tabs defaultValue="PENDING">
        <TabsList>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="ACCEPTED">Accepted</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>
        {["PENDING", "ACCEPTED", "REJECTED"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="overflow-x-auto w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Phone</TableHead>
                    <TableHead className="text-center">Booking Date</TableHead>
                    <TableHead className="text-center">Message</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedConsultations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No consultations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedConsultations
                      .filter((consultation) => consultation.status === status)
                      .map((consultation) => (
                        <TableRow key={consultation.id}>
                          <TableCell className="text-center">
                            {consultation.name}
                          </TableCell>
                          <TableCell className="text-center">
                            {consultation.email}
                          </TableCell>
                          <TableCell className="text-center">
                            {consultation.phone}
                          </TableCell>
                          <TableCell className="text-center">
                            {format(new Date(consultation.bookingDate), "PPP")}
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-center">
                            {consultation.message.length > 50 ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="link"
                                    className="text-blue-500"
                                  >
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
                          <TableCell className="space-x-2">
                            {consultation.status === "PENDING" && (
                              <>
                                <Button
                                  onClick={() =>
                                    handleStatusChange(
                                      consultation.id,
                                      "ACCEPTED"
                                    )
                                  }
                                  className="mr-2"
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Accept
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleStatusChange(
                                      consultation.id,
                                      "REJECTED"
                                    )
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {consultation.status === "ACCEPTED" && (
                              <>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button>Respond</Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Respond to Consultation #
                                        {consultation.id}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4">
                                      <Label htmlFor="message">Message</Label>
                                      <Textarea
                                        id="message"
                                        placeholder="Enter your response here..."
                                        value={responseMessage}
                                        onChange={(e) =>
                                          setResponseMessage(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        onClick={() =>
                                          setSelectedConsultation(null)
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button>Send</Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleTrashConsultation(consultation.id)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Trash
                                </Button>
                              </>
                            )}
                            {consultation.status === "REJECTED" && (
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  handleTrashConsultation(consultation.id)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Trash
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing{" "}
          {Math.min(
            (currentPage - 1) * itemsPerPage + 1,
            sortedConsultations.length
          )}{" "}
          to {Math.min(currentPage * itemsPerPage, sortedConsultations.length)}{" "}
          of {sortedConsultations.length} entries
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

export default ConsultationsPage;