import type { TPROJECT } from "@/types/project"
import type { ProjectUpdate } from "@/data/projects"

export const assignedProjects: TPROJECT[] = [
  {
    id: "1",
    title: "E-commerce Website Redesign",
    detail: "Redesign the UI/UX of our e-commerce platform for better user engagement",
    projectType: "OUTSOURCE",
    niche: "Web Development",
    bounty: 5000,
    deadline: "2024-06-30",
    projectStatus: "ONGOING",
    progressPercentage: 60,
    isDeadlineNeedToBeExtend: false,
    difficultyLevel: "MEDIUM",
    clientWhoPostedThisProjectForeignId: "client123",
    selectedFreelancersForThisProject: ["freelancer1"],
    interestedFreelancerWhoWantToWorkOnThisProject: [],
  },
  {
    id: "2",
    title: "Mobile App Development",
    detail: "Develop a cross-platform mobile app for fitness tracking",
    projectType: "INHOUSE",
    niche: "Mobile Development",
    bounty: 8000,
    deadline: "2024-08-15",
    projectStatus: "ONGOING",
    progressPercentage: 30,
    isDeadlineNeedToBeExtend: false,
    difficultyLevel: "HARD",
    clientWhoPostedThisProjectForeignId: "client456",
    selectedFreelancersForThisProject: ["freelancer1"],
    interestedFreelancerWhoWantToWorkOnThisProject: [],
  },
]

export const assignedProjectUpdates: ProjectUpdate[] = [
  {
    id: "1",
    projectId: "1",
    date: "2024-03-20T10:00:00Z",
    progress: 60,
    description: "Completed the homepage redesign and started work on the product catalog",
    proofOfWork: "https://example.com/proof/123",
  },
  {
    id: "2",
    projectId: "1",
    date: "2024-03-15T14:30:00Z",
    progress: 45,
    description: "Implemented user authentication and shopping cart functionality",
    proofOfWork: "https://example.com/proof/124",
  },
  {
    id: "3",
    projectId: "2",
    date: "2024-03-18T09:00:00Z",
    progress: 30,
    description: "Completed initial app setup and basic UI components",
    proofOfWork: "https://example.com/proof/125",
  },
]

export const projectStats = {
  totalProjects: 2,
  completedProjects: 0,
  ongoingProjects: 2,
  averageProgress: 45,
}

