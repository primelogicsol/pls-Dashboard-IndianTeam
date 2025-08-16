"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  AcceptFreeLancerRequests,
  getAllFreelancersRequest,
  TrashAFreeLancer,
} from "@/lib/api/freelancers";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Data, FreelancersData } from "@/types/freelancers";


export default function FreelancerRequests() {
  const [requests, setRequests] = useState<Data[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Data | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<{ [key: number]: string | undefined }>(
    {}
  );

  useEffect(() => {
    fetchFreelancerRequests();
  }, []);

  const fetchFreelancerRequests = async () => {
    try {
      const response = await getAllFreelancersRequest();
        
      if (response?.data && Array.isArray(response.data)) {
        setRequests(response.data as Data[]);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    }
  };
  // 🔒 Guard against `null`
  if (!requests) return <div>Loading or failed to fetch requests.</div>;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (value: string) => {
    setEntriesPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleTrash = async (id: number) => {
    setLoading((prev) => ({ ...prev, [id]: "Trashing..." }));
    try {
      const response = await TrashAFreeLancer(id);
      if (response.status === 200) {
        setRequests((prev) => prev.filter((request) => String(request?.id) !== String(id)));
        toast.success("Freelancer Request Trashed Successfully");
      }
    } catch (error) {
      console.error("Error trashing request:", error);
      toast.error("Failed to trash request");
    }
    setLoading((prev) => ({ ...prev, [id]: undefined }));
  };

  const acceptFreelancer = async (id: number) => {
    setLoading((prev) => ({ ...prev, [id]: "Accepting..." }));
    try {
      const response = await AcceptFreeLancerRequests(id);
      if (response.status === 200) {
        toast.success("Freelancer accepted successfully");
        setRequests((prev) => prev.filter((request) => String(request?.id) !== String(id)));
      }
    } catch (error) {
      console.error("Error accepting freelancer:", error);
      toast.error("Failed to accept freelancer");
    }
    setLoading((prev) => ({ ...prev, [id]: undefined }));
  };

  const filteredRequests = (requests || []).filter(
    (request) =>
      request?.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request?.whoYouAre?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request?.whoYouAre?.phone.includes(searchTerm) ||
      request?.whoYouAre?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredRequests.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredRequests.length / entriesPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mt-4">
        {/* <Input
          type="text"
          placeholder="Search..."
          className="w-1/3"
          value={searchTerm}
          onChange={handleSearch}
        /> */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search freelancers..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Select onValueChange={handleEntriesChange}>
          <SelectTrigger className="w-[120px]">
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
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEntries.length > 0 ? (
            currentEntries.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request?.whoYouAre?.fullName}</TableCell>
                <TableCell>{request?.whoYouAre?.email}</TableCell>
                <TableCell>{request?.whoYouAre?.phone}</TableCell>
                <TableCell className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                      </DialogHeader>
                      {selectedRequest && (
                        <div className="space-y-2">
                          <p>
                            <strong>Name:</strong> {selectedRequest?.whoYouAre?.fullName}
                          </p>
                          <p>
                            <strong>Email:</strong> {selectedRequest?.whoYouAre?.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {selectedRequest?.whoYouAre?.phone}
                          </p>
                     
                          <p>
                            <strong>Country:</strong>{" "}
                            {selectedRequest?.whoYouAre?.country
                              ? selectedRequest?.whoYouAre?.country
                              : "N/A"}
                          </p>
                          {/* <p>
                            <strong>Portfolio:</strong>{" "}
                            <a
                              href={selectedRequest.yourPortfolio}
                              className="text-blue-500"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {selectedRequest.yourPortfolio}
                            </a>
                          </p> */}
                          {/* <p>
                            <strong>Projects:</strong>
                          </p>
                          <ul className="list-disc ml-6">
                            <li>
                              <a
                                href={selectedRequest.yourTopProject1}
                                className="text-blue-500"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedRequest.yourTopProject1}
                              </a>
                            </li>
                            <li>
                              <a
                                href={selectedRequest.yourTopProject2}
                                className="text-blue-500"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedRequest.yourTopProject2}
                              </a>
                            </li>
                            <li>
                              <a
                                href={selectedRequest.yourTopProject3}
                                className="text-blue-500"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedRequest.yourTopProject3}
                              </a>
                            </li>
                          </ul> */}

                          <Button
                            variant="default"
                            size="sm"
                            className="mt-4"
                            onClick={() => acceptFreelancer(Number(selectedRequest?.id))}
                            disabled={!!loading[Number(selectedRequest?.id)]}
                          >
                            {loading[Number(selectedRequest?.id)] || "Accept Freelancer"}
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleTrash(Number(request.id))}
                    disabled={!!loading[Number(request.id)]}
                  >
                    {loading[Number(request.id)] || "Trash"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
