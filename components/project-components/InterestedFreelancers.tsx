"use client";

import { useState } from "react";
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { TKPIRANK, TPROJECT } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  removeInterestedFreelancerFromProject,
  selectFreelancerForProject,
} from "@/lib/api/projects";
import { toast } from "sonner";
import Link from "next/link";

interface ProjectInformationProps {
  project: TPROJECT | null;
  slug: string;
}

export default function InterestedFreelancersForProject({
  project,
  slug,
}: ProjectInformationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRank, setFilterRank] = useState<string | null>("all");
  const itemsPerPage = 10;

  // Get KPI rank color
  const getKpiRankColor = (rank: TKPIRANK) => {
    switch (rank) {
      case "BRONZE":
        return "bg-amber-700";
      case "SILVER":
        return "bg-gray-400";
      case "GOLD":
        return "bg-yellow-400";
      case "PLATINIUM":
        return "bg-blue-300";
      case "DIAMOND":
        return "bg-cyan-400";
      case "CROWN":
        return "bg-purple-500";
      case "ACE":
        return "bg-red-500";
      case "CONQUERER":
        return "bg-gradient-to-r from-red-500 to-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  // Extract interested freelancers
  const interestedFreelancers = project?.interestedFreelancers || [];
  const selectedFreelancers = project?.selectedFreelancers || [];

  // Convert selected freelancers to a Set for faster lookups
  const selectedFreelancerIds = new Set(
    selectedFreelancers.map((freelancer: any) => freelancer.uid)
  );

  // Filter freelancers based on search term and rank
  const filteredFreelancers = interestedFreelancers.filter(
    (freelancer: any) => {
      const matchesSearch =
        searchTerm === "" ||
        freelancer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRank =
        filterRank === "all" || freelancer.kpiRank === filterRank;

      return matchesSearch && matchesRank;
    }
  );

  const totalPages = Math.ceil(filteredFreelancers.length / itemsPerPage);
  const paginatedFreelancers = filteredFreelancers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRemoveInterestedFreeLancers = async (
    userName: string,
    slug: string
  ) => {
    try {
      const response = await removeInterestedFreelancerFromProject(
        slug,
        userName
      );
      if (response.status === 200) {
        toast.success("Successfully Removed the freelancer");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectFreelancer = async (userName: string, slug: string) => {
    try {
      const response = await selectFreelancerForProject(slug, userName);
      if (response.status === 200) {
        toast.success("Successfully Selected the freelancer");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <section>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Interested Freelancers</CardTitle>
                <CardDescription>
                  {filteredFreelancers.length} freelancers interested in this
                  project
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search freelancers..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
                <Select
                  value={filterRank || "all"}
                  onValueChange={(value) => {
                    setFilterRank(value === "all" ? null : value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                >
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by rank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranks</SelectItem>
                    <SelectItem value="BRONZE">Bronze</SelectItem>
                    <SelectItem value="SILVER">Silver</SelectItem>
                    <SelectItem value="GOLD">Gold</SelectItem>
                    <SelectItem value="PLATINIUM">Platinum</SelectItem>
                    <SelectItem value="DIAMOND">Diamond</SelectItem>
                    <SelectItem value="CROWN">Crown</SelectItem>
                    <SelectItem value="ACE">Ace</SelectItem>
                    <SelectItem value="CONQUERER">Conquerer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFreelancers.length > 0 ? (
                    paginatedFreelancers.map((freelancer: any) => (
                      <TableRow key={freelancer.uid}>
                        <TableCell className="font-medium">
                          {freelancer.username}
                          {selectedFreelancerIds.has(freelancer.uid) && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-green-100 text-green-800"
                            >
                              Selected
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{freelancer.fullName}</TableCell>
                        <TableCell className="text-xs">
                          {freelancer.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getKpiRankColor(freelancer.kpiRank)}
                          >
                            {freelancer.kpiRank}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex gap-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">View</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Freelancer Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-2">
                                <p>
                                  <strong>Username:</strong>{" "}
                                  {freelancer.username}
                                </p>
                                <p>
                                  <strong>Full Name:</strong>{" "}
                                  {freelancer.fullName}
                                </p>
                                <p>
                                  <strong>Email:</strong> {freelancer.email}
                                </p>
                                <p>
                                  <strong>Phone Number:</strong> {freelancer.phone}
                                </p>
                                <p>
                                  <strong>Rank:</strong> {freelancer.kpiRank}
                                </p>
                                <p>
                                  <strong>KPI Rank Points:</strong> {freelancer.kpiRankPoints}
                                </p>
                                <p>
                                  <strong>Niche:</strong>{" "}
                                  {freelancer.niche ? freelancer.niche : "N/A"}
                                </p>
                                <p>
                                  <strong>Portfolio Url:</strong>{" "}
                                  {freelancer.portfolioUrl ? (
                                    <Link href={freelancer.portfolioUrl} />
                                  ) : (
                                    "N/A"
                                  )}
                                </p>
                                <Button
                                  variant="default"
                                  onClick={() =>
                                    handleSelectFreelancer(
                                      freelancer.username,
                                      slug
                                    )
                                  }
                                >
                                  Select Freelancer
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleRemoveInterestedFreeLancers(
                                freelancer.fullName,
                                slug
                              )
                            }
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        {searchTerm || filterRank
                          ? "No freelancers match your search criteria"
                          : "No interested freelancers yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          {totalPages > 1 && (
            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </section>
    </div>
  );
}
