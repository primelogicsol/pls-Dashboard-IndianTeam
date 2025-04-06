"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSingleProject, removeFreelancerInterestFromProject, showInterestInProject } from "@/lib/api/projects";
import { toast } from "sonner";
import { format } from "date-fns";
import { getUserDetails } from "@/lib/api/storage";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const { isAuthorized } = useAuth(["FREELANCER"]);

  const userDetails = getUserDetails();
  const uid = userDetails?.uid;

  useEffect(() => {
    // In a real app, you would fetch the specific project by slug from your API
    setLoading(true);
    fetchProjectDetails();
    setLoading(false);
  }, []);

  const fetchProjectDetails = async () => {
    if (typeof slug === "string") {
      setLoading(true);
      try {
        const response = await getSingleProject(slug);
        if (response.status === 200) {
          setProject(response?.data);
          // Check if user has already applied
          const isAlreadyApplied = response.data.interestedFreelancers.some(
            (freelancer: any) => freelancer.uid === uid
          );
          setIsApplied(isAlreadyApplied);
        }
      } catch (error) {
        toast.error("Failed to fetch project");
      }
      setLoading(false);
    } else {
      toast.error("Invalid project slug");
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "in progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
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

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Project not found.</p>
        </div>
      </div>
    );
  }

  // Handle Show Interest
  const handleShowInterest = async (projectSlug: string) => {
    try {
      const response = await showInterestInProject(projectSlug, uid);
      if (response.status === 200) {
        toast.success("Applied for this project successfully");

        // Refresh project details after applying
        fetchProjectDetails();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply for the project");
    }
  };

  const handleRemoveInterest = async(projectSlug: string) => {
    try {
      const response = await removeFreelancerInterestFromProject(projectSlug, uid);
      if (response.status === 200) {
        toast.success("Interest Removed successfully");

        // Refresh project details after applying
        fetchProjectDetails();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply for the project");
    }
  }

  if(!isAuthorized) return null;
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Button>

      <div className="grid">
        {/* Project Header */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>View and manage project details</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Title
                  </h3>
                  <p className="text-lg font-medium">{project?.title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Niche
                  </h3>
                  <p className="text-lg font-medium">{project?.niche}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Bounty
                  </h3>
                  <p className="text-lg font-medium">
                    ${project?.bounty.toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Deadline
                  </h3>
                  <p className="text-lg font-medium flex items-center">
                    {project?.deadline
                      ? format(new Date(project.deadline), "PPP")
                      : "No deadline"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Project Type
                  </h3>
                  <Badge variant="outline" className="mt-1">
                    {project?.projectType === "INHOUSE"
                      ? "In-house"
                      : "Outsource"}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Difficulty Level
                  </h3>
                  <Badge
                    className={`mt-1 ${
                      project?.difficultyLevel
                        ? getDifficultyColor(project.difficultyLevel)
                        : "bg-gray-500"
                    }`}
                  >
                    {project?.difficultyLevel}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h3>
                  <Badge
                    className={`mt-1 ${
                      project?.projectStatus
                        ? getStatusColor(project.projectStatus)
                        : "bg-gray-500"
                    }`}
                  >
                    {project?.projectStatus}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Progress
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress
                      value={project?.progressPercentage}
                      className="h-2"
                    />
                    <span className="text-sm font-medium">
                      {project?.progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Project Details
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {project?.detail}
                </p>
              </div>
              <div className="flex justify-start">
                <div className="flex justify-start gap-4">
                  <Button
                    variant="default"
                    onClick={() => handleShowInterest(project?.projectSlug!)}
                    disabled={isApplied}
                    className="bg-[#003087]"
                  >
                    {isApplied ? "Applied for this project" : "Show Interest"}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Remove Interest</Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove Interest?</DialogTitle>
                        <DialogDescription>
                          If you remove yourself from this project, your points
                          will decrease by <b>10 points.</b>
                          <br />
                          Are you sure you want to proceed?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            onClick={() => slug && typeof slug === 'string' && handleRemoveInterest(slug)}
                          >
                            Confirm
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
