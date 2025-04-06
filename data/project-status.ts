import type { TPROJECT } from "@/types/project"

export interface ProjectUpdate {
  id: string
  projectId: string
  date: string
  progress: number
  description: string
  proofOfWork?: string
}

export const projectStatusData = {
  projects: [
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
      isDeadlineNeedToBeExtend: false,
      difficultyLevel: "MEDIUM",
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
      isDeadlineNeedToBeExtend: false,
      difficultyLevel: "HARD",
      clientWhoPostedThisProjectForeignId: "client456",
      selectedFreelancersForThisProject: ["freelancer3"],
      interestedFreelancerWhoWantToWorkOnThisProject: [],
    },
  ] as TPROJECT[],

  updates: [
    {
      id: "1",
      projectId: "1",
      date: "2024-03-20T10:00:00Z",
      progress: 60,
      description: "Completed the main e-commerce features",
      proofOfWork: "https://example.com/proof/123",
    },
    {
      id: "2",
      projectId: "2",
      date: "2024-03-19T15:30:00Z",
      progress: 30,
      description: "Mobile app UI implementation in progress",
      proofOfWork: "https://example.com/proof/124",
    },
  ] as ProjectUpdate[],
}

