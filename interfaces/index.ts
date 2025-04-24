export interface Project {
    id: number;
    title: string;
    detail: string;
    deadline: string;
    bounty: number;
    progressPercentage: number;
    niche: string;
    difficultyLevel: "EASY" | "MEDIUM" | "HARD";
    projectType: string;
    projectStatus: string;
    projectSlug: string;
    createdAt: string;
    selectedFreelancersForThisProject: string[];
    selectedFreelancers?: {
      uid: string;
      fullName: string;
      username: string;
      email: string;
      phone?: string;
      yearsOfExperience?: number;
      niche?: string;
      kpiRank: string;
    }[];
  }