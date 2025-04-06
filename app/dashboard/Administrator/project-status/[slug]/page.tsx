"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { getSingleProject } from "@/lib/api/projects";
import { toast } from "sonner";
import { TPROJECT } from "@/types/project";
import ProjectInformation from "@/components/project-components/projectInformation";
import { Feedback } from "@/components/project-components/feedback";
import InterestedFreeLancersForProject from "@/components/project-components/InterestedFreelancers";
import { useAuth } from "@/hooks/useAuth";
import MilestonesTimeline from "@/components/project-components/milestones";

// // Get KPI rank color
// const getKpiRankColor = (rank: TKPIRANK) => {
//   switch (rank) {
//     case "BRONZE":
//       return "bg-amber-700";
//     case "SILVER":
//       return "bg-gray-400";
//     case "GOLD":
//       return "bg-yellow-400";
//     case "PLATINIUM":
//       return "bg-blue-300";
//     case "DIAMOND":
//       return "bg-cyan-400";
//     case "CROWN":
//       return "bg-purple-500";
//     case "ACE":
//       return "bg-red-500";
//     case "CONQUERER":
//       return "bg-gradient-to-r from-red-500 to-purple-500";
//     default:
//       return "bg-gray-500";
//   }
// };

export default function ProjectDetailsPage() {
  const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);
  const { slug } = useParams();

  // State hooks (must be called before any return)
  const [project, setProject] = useState<TPROJECT | null>(null);

  const getSingleProjectByProjectSlug = async (slug: string) => {
    try {
      const response = await getSingleProject(slug);
      if (response.status === 200) {
        toast.success("Project data fetched successfully");
        setProject(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "An Error Occured");
    }
  };

  useEffect(() => {
    if (typeof slug === "string") {
      getSingleProjectByProjectSlug(slug);
    } else {
      console.error("Invalid slug:", slug);
    }
  }, [slug]);

  // Conditional rendering happens after all hooks have been called
  if (!isAuthorized) return null;

  const refreshMilestones = async () => {
    if (typeof slug === "string") {
      await getSingleProjectByProjectSlug(slug);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Project Details</h1>

      <div>
        {/* Project Details Section */}
        {typeof slug === "string" && (
          <ProjectInformation project={project} slug={slug} />
        )}

        {/* Milestones section */}
        {typeof slug === "string" && project && (
          <MilestonesTimeline
            milestones={project.milestones}
            slug={slug}
            projectId={project.id}
            onMilestoneChange={refreshMilestones}
          />
        )}

        {/* Interested Freelancers Section */}
        {typeof slug === "string" && (
          <InterestedFreeLancersForProject project={project} slug={slug} />
        )}

        {/* Project Timeline/Comments Section */}
        <Feedback project={project} />
      </div>
    </div>
  );
}
