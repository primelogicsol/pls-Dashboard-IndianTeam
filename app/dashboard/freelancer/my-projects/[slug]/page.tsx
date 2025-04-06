"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  getSingleProject,
  removeSelectedFreelancerFromProject,
  updateProgressOfProject,
} from "@/lib/api/projects";
import { toast } from "sonner";
import { format } from "date-fns";
import { getUserDetails } from "@/lib/api/storage";
import { Milestone, TKPIRANK } from "@/types/project";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import MilestonesTimeline from "@/components/project-components/milestones";

// Type definitions
interface Freelancer {
  username: string;
  uid: string;
  fullName: string;
  email: string;
  niche: string;
  portfolioUrl: string;
  kpiRankPoints: number;
  kpiRank: TKPIRANK;
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
  milestones: Milestone[];
  slug: string
}

export default function MyProjectDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [freelancerDetails, setFreelancerDetails] = useState<Freelancer | null>(
    null
  );
  const progressRef = useRef<HTMLInputElement>(null);
   const { isAuthorized } = useAuth(["FREELANCER"]);

  const userDetails = getUserDetails();
  const uid = userDetails?.uid;

  useEffect(() => {
    setLoading(true);
    fetchProjectDetails();
    setLoading(false);
  }, []);

  // Fetch Project Details
  const fetchProjectDetails = async () => {
    if (typeof slug === "string") {
      setLoading(true);
      try {
        const response = await getSingleProject(slug);
        if (response.status === 200) {
          setProject(response?.data);
          toast.success("Project fetched successfully");

          // Check if the logged-in user is in the selectedFreelancers list
          const isSelected = response.data.selectedFreelancers.some(
            (freelancer: any) => freelancer.uid === uid
          );

          if (isSelected) {
            // Find the freelancer details in the interestedFreelancers list
            const freelancerInfo = response.data.interestedFreelancers.find(
              (freelancer: any) => freelancer.uid === uid
            );
            if (freelancerInfo) {
              setFreelancerDetails(freelancerInfo);
            }
          }
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
  if(!isAuthorized) return null;
  const handleRemoveInterest = async (projectSlug: string) => {
    try {
      const response = await removeSelectedFreelancerFromProject(
        projectSlug,
        uid
      );
      if (response.status === 200) {
        toast.success("Interest removed Successfully");

        // Refresh project details after applying
        fetchProjectDetails();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply for the project");
    }
  };

  const handleUpdateProgress = async (
    projectSlug: string,
    fullName: string
  ) => {
    const progressValue = progressRef.current?.value;

    if (
      !progressValue ||
      isNaN(Number(progressValue)) ||
      Number(progressValue) < 0 ||
      Number(progressValue) > 100
    ) {
      toast.error("Please enter a valid progress percentage (0-100).");
      return;
    }

    try {
      console.log(typeof Number(progressValue));
      const response = await updateProgressOfProject(
        projectSlug,
        fullName,
        Number(progressValue)
      );
      if (response.status === 200) {
        toast.success("Progress updated successfully!");
        fetchProjectDetails();
      }
    } catch (error) {
      toast.error("Failed to update progress.");
      console.error(error);
    }
  };

  // Card component for freelancer details
  const FreelancerCard = ({ freelancer }: { freelancer: Freelancer }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Details</CardTitle>
          <CardDescription>Have a look In your Details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Full Name
                </h3>
                <p className="text-lg font-medium">{freelancer?.fullName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Niche
                </h3>
                <p className="text-lg font-medium">
                  {freelancer?.niche || "No data"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  KPI Rank Points
                </h3>
                <p className="text-lg font-medium">
                  {freelancer?.kpiRankPoints}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  KPI Rank
                </h3>

                <Badge className={getKpiRankColor(freelancer?.kpiRank)}>
                  {freelancer.kpiRank}
                </Badge>
              </div>
            </div>
          </div>
          {freelancer.portfolioUrl && (
            <p>
              <strong>Portfolio:</strong>{" "}
              <a
                href={freelancer.portfolioUrl}
                target="_blank"
                className="text-blue-500"
              >
                View Portfolio
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const refreshMilestones = async () => {
    if (typeof slug === "string") {
      await fetchProjectDetails();
    }
  };


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
            </div>
            <div className="mt-4 flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">Update Progress</Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Progress Percentage</DialogTitle>
                    <DialogDescription>
                      Enter the new progress percentage for this project.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-4">
                    <Input
                      ref={progressRef}
                      type="number"
                      placeholder="Enter progress (0-100%)"
                      min="0"
                      max="100"
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="default"
                      onClick={() => {
                        slug &&
                          typeof slug === "string" &&
                          freelancerDetails?.fullName &&
                          handleUpdateProgress(
                            slug,
                            freelancerDetails.fullName
                          );
                      }}
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Remove Interest</Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remove Interest?</DialogTitle>
                    <DialogDescription>
                      If you remove yourself from this project, your points will
                      decrease by <b>40 points.</b>
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
                        onClick={() =>
                          slug &&
                          typeof slug === "string" &&
                          handleRemoveInterest(slug)
                        }
                      >
                        Confirm
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* freelancer section */}
        <MilestonesTimeline milestones={project.milestones} slug={project.slug} onMilestoneChange={refreshMilestones}/> 

        {/* Freelancer Details Card */}
        {freelancerDetails && (
          <div className="mt-6">
            <FreelancerCard freelancer={freelancerDetails} />
          </div>
        )}
      </div>
    </div>
  );
}
