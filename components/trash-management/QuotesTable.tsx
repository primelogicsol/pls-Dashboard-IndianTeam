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
import {
  deleteQuote,
  getAllQuotes,
  getTrashedQuotes,
  trashQuote,
  untrashQuote,
} from "@/lib/api/quotes";
import { toast } from "sonner";

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
}

export default function QuotesTable() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const router = useRouter();

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
      const response = await getTrashedQuotes();
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

  const handleMoveToUnTrash = async (id: number) => {
    try {
      const response = await untrashQuote(id);
      if (response.status === 200) {
        toast.success("Quote Untrashed successfully");
      }
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      setFilteredQuotes((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Error moving quote to trash:", error);
    }
  };

  const handleDeleteQuote = async (id: number) => {
    try {
      const response = await deleteQuote(id);
      if (response.status === 200) {
        toast.success("Quote has been successfully Deleted");
        setFilteredQuotes((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(filteredQuotes.length / entries);
  const displayedQuotes = filteredQuotes.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  return (
    <Suspense fallback={<p className="text-center p-4">Loading quotes...</p>}>
      <div>
        <div className="flex justify-between items-center mb-4"></div>
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
                            <p>
                              <strong>Services:</strong>{" "}
                              {selectedQuote.services}
                            </p>
                            <p>
                              <strong>Detail:</strong> {selectedQuote.detail}
                            </p>
                            <p>
                              <strong>Company:</strong>{" "}
                              {selectedQuote.company || "N/A"}
                            </p>
                            <p>
                              <strong>Deadline:</strong>{" "}
                              {selectedQuote.deadline || "N/A"}
                            </p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      onClick={() => handleMoveToUnTrash(quote.id)}
                    >
                      UnTrash
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteQuote(quote.id)}
                    >
                      Delete
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
