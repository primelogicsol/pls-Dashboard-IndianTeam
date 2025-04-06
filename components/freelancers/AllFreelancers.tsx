"use client";

import { useState, useEffect } from "react";
import { getAllFreelancers } from "@/lib/api/freelancers";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TKPIRANK } from "@/types/project";

export type Freelancer = {
    username: string
    fullName: string
    niche: string | null
    detail: string | null
    kpiRankPoints: number
    kpiRank: TKPIRANK
    portfolioUrl: string | null
    projects: {
      projectStatus: string
      projectSlug: string
      progressPercentage: number
    }[]
  }
  
export default function FreelancersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("kpiRank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [currentPage, sortBy, sortOrder]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFreelancers(currentPage);
      setFreelancers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Get badge color based on KPI rank
  const getRankBadgeColor = (rank: TKPIRANK) => {
    switch (rank) {
      case "BRONZE":
        return "bg-amber-700 hover:bg-amber-700";
      case "SILVER":
        return "bg-gray-400 hover:bg-gray-400";
      case "GOLD":
        return "bg-yellow-500 hover:bg-yellow-500";
      case "PLATINIUM":
        return "bg-blue-300 hover:bg-blue-300";
      case "DIAMOND":
        return "bg-cyan-400 hover:bg-cyan-400";
      case "CROWN":
        return "bg-purple-500 hover:bg-purple-500";
      case "ACE":
        return "bg-red-500 hover:bg-red-500";
      case "CONQUERER":
        return "bg-black hover:bg-black";
      default:
        return "bg-gray-500 hover:bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Freelancers Directory</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search freelancers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fullName">Full Name</SelectItem>
              <SelectItem value="username">Username</SelectItem>
              <SelectItem value="kpiRank">KPI Rank</SelectItem>
              <SelectItem value="kpiRankPoints">KPI Points</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={toggleSortOrder}>
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : freelancers.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-lg text-muted-foreground">No freelancers found</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>KPI Rank</TableHead>
                  <TableHead>KPI Points</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Portfolio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {freelancers.map((freelancer) => (
                  <TableRow key={freelancer.username}>
                    <TableCell className="font-medium">
                      {freelancer.username}
                    </TableCell>
                    <TableCell>{freelancer.fullName}</TableCell>
                    <TableCell>
                      <Badge className={getRankBadgeColor(freelancer.kpiRank)}>
                        {freelancer.kpiRank}
                      </Badge>
                    </TableCell>
                    <TableCell>{freelancer.kpiRankPoints}</TableCell>
                    <TableCell>
                      {freelancer.projects.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {freelancer.projects.map(
                            (project: any, index: any) => (
                              <div key={index} className="text-xs">
                                <span className="font-medium">
                                  {project.projectSlug}
                                </span>
                                <span className="ml-2 text-muted-foreground">
                                  ({project.projectStatus},{" "}
                                  {project.progressPercentage}%)
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No projects
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {freelancer.portfolioUrl ? (
                        <a
                          href={freelancer.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Not available
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} freelancers
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={!pagination.hasPrevPage}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(pagination.totalPages)}
                disabled={!pagination.hasNextPage}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
