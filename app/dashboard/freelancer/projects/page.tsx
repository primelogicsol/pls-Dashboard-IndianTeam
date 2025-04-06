"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fetchOutsourcedProjects } from "@/lib/api/projects";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

// Type definitions
interface Freelancer {
  username: string;
  uid: string;
  fullName: string;
  email: string;
}

interface Client {
  username: string;
  uid: string;
  fullName: string;
  email: string;
}

interface Project {
  id: number;
  title: string;
  detail: string;
  deadline: string;
  bounty: number;
  progressPercentage: number;
  niche: string;
  difficultyLevel: string;
  projectType: string;
  projectStatus: string;
  selectedFreelancers: Freelancer[];
  clientWhoPostedThisProject: Client;
  projectSlug: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    difficultyLevel: "",
    createdAtOrder: "latest",
    bountyOrder: "lowest",
    nicheName: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useAuth(["FREELANCER"]);

  const limit = 5;

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      try {
        const response = await fetchOutsourcedProjects(
          pagination.page,
          limit,
          filters.difficultyLevel,
          filters.createdAtOrder as "latest" | "oldest",
          filters.bountyOrder as "highest" | "lowest",
          filters.nicheName
        );
        console.log(response);
        setProjects(response?.data?.projects);
        setPagination({
          page: response?.data?.pagination.page,
          totalPages: response?.data?.pagination.totalPages,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to load projects");
      }
    };
    getProjects();
  }, [pagination.page, filters]); // Fetch projects when page or filters change

  // Filter projects based on search term
  const filteredProjects = projects?.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.difficultyLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get difficulty level badge color
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };
  if(!isAuthorized) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">All Outsourced Projects</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Inputs */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
          <select
            value={filters.difficultyLevel}
            onChange={(e) =>
              setFilters({ ...filters, difficultyLevel: e.target.value })
            }
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={filters.nicheName}
            onChange={(e) =>
              setFilters({ ...filters, nicheName: e.target.value })
            }
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option value="">All Niches</option>
            <option value="web">Web Development</option>
            <option value="mobile">Mobile Development</option>
          </select>

          <select
            value={filters.createdAtOrder}
            onChange={(e) =>
              setFilters({ ...filters, createdAtOrder: e.target.value })
            }
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <select
            value={filters.bountyOrder}
            onChange={(e) =>
              setFilters({ ...filters, bountyOrder: e.target.value })
            }
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option value="lowest">Lowest Bounty</option>
            <option value="highest">Highest Bounty</option>
          </select>
        </div>
      </div>

      {/* Project List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading projects...</p>
        </div>
      ) : filteredProjects?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No projects found matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects?.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <Badge
                    className={getDifficultyColor(project.difficultyLevel)}
                  >
                    {project.difficultyLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Progress
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={project.progressPercentage}
                        className="h-2"
                      />
                      <span className="text-sm">
                        {project.progressPercentage}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p>{formatDate(project.deadline)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Niche</p>
                    <p>{project.niche}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/dashboard/freelancer/projects/${project.projectSlug}`}
                  className="w-full"
                >
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
            }))
          }
          disabled={pagination.page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          onClick={() =>
            setPagination((prev) =>
              prev.page < prev.totalPages
                ? { ...prev, page: prev.page + 1 }
                : prev
            )
          }
          disabled={pagination.page >= pagination.totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
