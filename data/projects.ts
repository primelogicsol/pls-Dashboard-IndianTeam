import type { TPROJECT } from "@/types/project"

export interface ProjectUpdate {
  id: string
  projectId: string
  date: string
  progress: number
  description: string
  proofOfWork?: string
}

export const projects: TPROJECT[] = [
  {
    id: "1",
    title: "E-commerce Website Development",
    detail: "Building a full-featured e-commerce platform",
    projectType: "OUTSOURCE",
    niche: "Web Development",
    bounty: 5000,
    deadline: "2024-06-30",
    projectStatus: "ONGOING",
    progressPercentage: 60,
    progress: 60,
    isDeadlineNeedToBeExtend: false,
    difficultyLevel: "MEDIUM",
    status: "in-progress",
    clientId: "1",
    team: ["1", "2"],
    clientWhoPostedThisProjectForeignId: "client123",
    selectedFreelancersForThisProject: ["freelancer1", "freelancer2"],
    interestedFreelancerWhoWantToWorkOnThisProject: [],
  },
  {
    id: "2",
    title: "Mobile App Development",
    detail: "Developing a cross-platform mobile application",
    projectType: "INHOUSE",
    niche: "Mobile Development",
    bounty: 8000,
    deadline: "2024-07-15",
    projectStatus: "ONGOING",
    progressPercentage: 30,
    progress: 30,
    isDeadlineNeedToBeExtend: false,
    difficultyLevel: "HARD",
    status: "at-risk",
    clientId: "2",
    team: ["3"],
    clientWhoPostedThisProjectForeignId: "client456",
    selectedFreelancersForThisProject: ["freelancer3"],
    interestedFreelancerWhoWantToWorkOnThisProject: [],
  },
  {
    id: "3",
    title: "Content Management System",
    detail: "Building a custom CMS for content management",
    projectType: "OUTSOURCE",
    niche: "Web Development",
    bounty: 6000,
    deadline: "2024-08-30",
    projectStatus: "COMPLETED",
    progressPercentage: 100,
    progress: 100,
    isDeadlineNeedToBeExtend: false,
    difficultyLevel: "MEDIUM",
    status: "completed",
    clientId: "3",
    team: ["1", "3"],
    clientWhoPostedThisProjectForeignId: "client789",
    selectedFreelancersForThisProject: ["freelancer1", "freelancer3"],
    interestedFreelancerWhoWantToWorkOnThisProject: [],
  },
]

export const projectUpdates: ProjectUpdate[] = [
  {
    id: "1",
    projectId: "1",
    date: "2024-03-20T10:00:00Z",
    progress: 60,
    description: "Completed the main e-commerce features including shopping cart and checkout",
    proofOfWork: "https://github.com/project/commit/abc123",
  },
  {
    id: "2",
    projectId: "1",
    date: "2024-03-15T14:30:00Z",
    progress: 45,
    description: "Implemented user authentication and product catalog",
    proofOfWork: "https://github.com/project/commit/def456",
  },
  {
    id: "3",
    projectId: "2",
    date: "2024-03-18T09:00:00Z",
    progress: 30,
    description: "Completed initial app setup and basic UI components",
    proofOfWork: "https://github.com/project/commit/ghi789",
  },
  {
    id: "4",
    projectId: "3",
    date: "2024-03-10T11:00:00Z",
    progress: 100,
    description: "Project completed and delivered to client",
    proofOfWork: "https://github.com/project/commit/jkl012",
  },
]

