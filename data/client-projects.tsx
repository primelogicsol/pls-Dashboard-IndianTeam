import type { Project } from "@/types/project"

export interface ClientProject extends Project {
  freelancer: string
  updates: {
    date: string
    message: string
    link?: string
  }[]
}

export const clientProjects: ClientProject[] = [
  {
    id: "1",
    title: "E-commerce Website Redesign",
    detail: "Redesign the UI/UX of our e-commerce platform for better user engagement",
    projectType: "OUTSOURCE",
    niche: "Web Development",
    bounty: 5000,
    deadline: "2024-06-30",
    projectStatus: "ONGOING",
    progressPercentage: 65,
    isDeadlineNeedToBeExtend: false,
    difficultyLevel: "MEDIUM",
    freelancer: "Alice Johnson",
    updates: [
      {
        date: "2024-03-10",
        message: "Completed homepage redesign",
        link: "https://example.com/homepage-preview",
      },
      {
        date: "2024-03-05",
        message: "Started product catalog implementation",
        link: "https://example.com/catalog-preview",
      },
    ],
  },
  {
    id: "2",
    title: "Mobile App Development",
    detail: "Develop a cross-platform mobile app for fitness tracking",
    projectType: "INHOUSE",
    niche: "Mobile Development",
    bounty: 8000,
    deadline: "2024-08-15",
    projectStatus: "COMPLETED",
    progressPercentage: 100,
    isDeadlineNeedToBeExtend: false,
    difficultyLevel: "HARD",
    freelancer: "Bob Wilson",
    updates: [
      {
        date: "2024-03-20",
        message: "Finished backend development",
      },
      {
        date: "2024-03-15",
        message: "Completed frontend development",
      },
    ],
  },
  {
    id: "3",
    title: "Custom CRM Integration",
    detail: "Integrate a custom CRM solution with existing business systems",
    projectType: "OUTSOURCE",
    niche: "Software Integration",
    bounty: 7000,
    deadline: "2024-07-31",
    projectStatus: "COMPLETED",
    progressPercentage: 100,
    isDeadlineNeedToBeExtend: false,
    difficultyLevel: "MEDIUM",
    freelancer: "Charlie Davis",
    updates: [
      {
        date: "2024-03-25",
        message: "Successfully integrated CRM with existing systems",
        link: "https://example.com/crm-integration-report",
      },
    ],
  },
]

