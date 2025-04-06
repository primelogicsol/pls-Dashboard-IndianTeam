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

interface Request {
  id: number;
  name: string;
  email: string;
  phone: string;
  niche: string;
  address: string;
  detail: string;
  yourPortfolio: string;
  yourTopProject1: string;
  yourTopProject2: string;
  yourTopProject3: string;
  isAccepted: boolean;
  createdAt: string;
  yearOfExperience: string;
  country: string;
}

export default function FreelancerRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
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
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

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
        setRequests((prev) => prev.filter((request) => request.id !== id));
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
        setRequests((prev) => prev.filter((request) => request.id !== id));
      }
    } catch (error) {
      console.error("Error accepting freelancer:", error);
      toast.error("Failed to accept freelancer");
    }
    setLoading((prev) => ({ ...prev, [id]: undefined }));
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm) ||
      request.niche.toLowerCase().includes(searchTerm.toLowerCase())
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
            <TableHead>Niche</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEntries.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.name}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.phone}</TableCell>
              <TableCell>{request.niche}</TableCell>
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
                          <strong>Name:</strong> {selectedRequest.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedRequest.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {selectedRequest.phone}
                        </p>
                        <p>
                          <strong>Address:</strong> {selectedRequest.address}
                        </p>
                        <p>
                          <strong>Detail:</strong> {selectedRequest.detail}
                        </p>
                        <p>
                          <strong>Year of Experience:</strong> {selectedRequest.yearOfExperience? selectedRequest.yearOfExperience: "N/A"}
                        </p>
                        <p>
                          <strong>Country:</strong> {selectedRequest.country? selectedRequest.country: "N/A"}
                        </p>
                        <p>
                          <strong>Portfolio:</strong>{" "}
                          <a
                            href={selectedRequest.yourPortfolio}
                            className="text-blue-500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {selectedRequest.yourPortfolio}
                          </a>
                        </p>
                        <p>
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
                        </ul>

                        <Button
                          variant="default"
                          size="sm"
                          className="mt-4"
                          onClick={() => acceptFreelancer(selectedRequest.id)}
                          disabled={!!loading[selectedRequest.id]}
                        >
                          {loading[selectedRequest.id] || "Accept Freelancer"}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleTrash(request.id)}
                  disabled={!!loading[request.id]}
                >
                  {loading[request.id] || "Trash"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
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
