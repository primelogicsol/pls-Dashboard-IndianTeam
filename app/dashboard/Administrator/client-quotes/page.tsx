"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Trash2, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllQuotes, trashQuote } from "@/lib/api/quotes";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Quote {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  services: string;
  detail: string;
  company?: string;
  deadline?: string;
  niche: string;
  budget: string
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const router = useRouter();
  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);

  useEffect(() => {
    fetchQuotes().then((data) => {
      if (Array.isArray(data)) {
        setQuotes(data);
        setFilteredQuotes(data);
      } else {
        console.error("Unexpected data format:", data);
      }
    });
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await getAllQuotes();
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching quotes:", error);
      return [];
    }
  };

  useEffect(() => {
    const filtered = quotes.filter(
      (q) =>
        q.name.toLowerCase().includes(search.toLowerCase()) ||
        q.email.toLowerCase().includes(search.toLowerCase()) ||
        q.phone.includes(search) ||
        q.address.toLowerCase().includes(search.toLowerCase()) ||
        (q.company ?? "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredQuotes(filtered);
    setCurrentPage(1);
  }, [search, quotes]);

  const handleMoveToTrash = async (id: number) => {
    try {
      const response = await trashQuote(id);
      if (response.status === 200) {
        toast.success("Quote trashed successfully");
      }
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      setFilteredQuotes((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Error moving quote to trash:", error);
    }
  };

  const totalPages = Math.ceil(filteredQuotes.length / entries);
  const displayedQuotes = filteredQuotes.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  if(!isAuthorized) return null;
  return (
    <Suspense fallback={<p className="text-center p-4">Loading quotes...</p>}>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Quotes</h2>
          <Button
            onClick={() =>
              router.push("/dashboard/Administrator/quotes/create")
            }
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Quote
          </Button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <div className="flex gap-2 items-center">
            Show Entries:
            <Select onValueChange={(val) => setEntries(Number(val))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedQuotes.length > 0 ? (
              displayedQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell>{quote.name}</TableCell>
                  <TableCell>{quote.email}</TableCell>
                  <TableCell>{quote.phone}</TableCell>
                  <TableCell>{quote.address}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedQuote(quote)}>
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Quote Details</DialogTitle>
                        {selectedQuote && (
                          <div>
                            <p className="mb-1">
                              <strong>Name:</strong>{" "}
                              {selectedQuote.name}
                            </p>
                            <p className="mb-1">
                              <strong>Email:</strong>{" "}
                              {selectedQuote.email}
                            </p>
                            <p className="mb-1">
                              <strong>Phone Number:</strong>{" "}
                              {selectedQuote.phone}
                            </p>
                            <p className="mb-1">
                              <strong>Address:</strong>{" "}
                              {selectedQuote.address}
                            </p>
                            <p className="mb-1">
                              <strong>Niche:</strong>{" "}
                              {selectedQuote.niche? selectedQuote.niche : "N/A"}
                            </p>
                            <p className="mb-1">
                              <strong>Services:</strong>{" "}
                              {selectedQuote.services}
                            </p>
                            <p className="mb-1">
                              <strong>Detail:</strong> {selectedQuote.detail}
                            </p>
                            <p className="mb-1">
                              <strong>Budget:</strong> {selectedQuote.budget? selectedQuote.budget: "N/A"}
                            </p>
                            <p className="mb-1"> 
                              <strong>Company:</strong>{" "}
                              {selectedQuote.company || "N/A"}
                            </p>
                            <p className="mb-1">
                              <strong>Deadline:</strong>{" "}
                              {selectedQuote.deadline || "N/A"}
                            </p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      onClick={() => handleMoveToTrash(quote.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-4">
                  No Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </Suspense>
  );
}
