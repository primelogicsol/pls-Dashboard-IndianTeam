"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { getAllHireUsRequests, trashHireUsRequest } from "@/lib/api/hire-us";
import { Input } from "@/components/ui/input";
import RequestCard from "@/components/hire-us/RequestCard";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Document {
  url: string;
  name: string;
}

interface HireUsRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  detail: string;
  docs: Document[];
  createdAt: string;
  trashedBy: string | null;
  trashedAt: string | null;
  isDeleting?: boolean; 
}

export default function HireUsRequests() {
  const [requests, setRequests] = useState<HireUsRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredRequests, setFilteredRequests] = useState<HireUsRequest[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllHireUsRequests();
        if (response.status === 200) {
          setRequests(response.data.data);
          setFilteredRequests(response.data.data);
        } else {
          setError(response.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = requests.filter((request) =>
      [
        request.name,
        request.email,
        request.phone,
        request.company,
        request.address,
      ].some((field) => field?.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [search, requests]);

  

const handleTrash = async (id: number) => {
  setDeletingId(id);
  try {
    const response = await trashHireUsRequest(id);
    if(response.status === 200) {
        toast.success("Hire Us Request Trashed Successfully");
        setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
    }
  } catch (error) {
    console.error("Error trashing request:", error);
  } finally {
    setDeletingId(null); 
  }
};
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const displayedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  if(!isAuthorized) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Project Requests</h1>
        <div className="flex w-full max-w-2xl items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search Requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />{" "}
          </div>
          <select
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {[5, 10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num} entries
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {displayedRequests.length > 0 ? (
              displayedRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={{
                    ...request,
                    isDeleting: deletingId === request.id,
                  }} // Add isDeleting
                  onTrash={handleTrash}
                  formatDate={formatDate}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No requests found</p>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
