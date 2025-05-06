# Prime Logic Dashboard - Project Management

## Overview

The project management system is a core component of the Prime Logic Dashboard, enabling clients to post project request, freelancers to apply on them, and administrators(admin, moderator) to oversee the entire process. The system handles project creation, Applying for a project, assignment, tracking, and completion.

## Project Data Structure

The project data structure is defined in `types/project.ts` and includes:

\`\`\`typescript
export type TPROJECTSTATUS = "PENDING" | "CANCELLED" | "ONGOING" | "COMPLETED"
export type TKPIRANK = "BRONZE" | "SILVER" | "GOLD" | "PLATINIUM" | "DIAMOND" | "CROWN" | "ACE" | "CONQUERER"
export type TDIFFICULTYLEVEL = "EASY" | "MEDIUM" | "HARD"
export type TPROJECTTYPE = "INHOUSE" | "OUTSOURCE"

export type TPROJECT = {
  id: number
  title: string
  detail: string
  projectType: TPROJECTTYPE
  niche: string
  bounty: number
  deadline: string
  projectStatus: TPROJECTSTATUS
  progressPercentage: number
  isDeadlineNeedToBeExtend: boolean
  difficultyLevel: TDIFFICULTYLEVEL
  clientWhoPostedThisProjectForeignId?: string
  selectedFreelancers: string[]
  interestedFreelancers: string[]
  commentByClientAfterProjectCompletion?: string
  starsByClientAfterProjectCompletion?: string
  milestones: Milestone[]
}
\`\`\`

## Project Lifecycle

1. **Creation**: Admin creates a project with requirements and budget
2. **Bidding**: Freelancers submit requests on the project to join.
3. **Assignment**: Admin, moderator selects a freelancer from all the freelancer requests.
4. **Execution**: Freelancer works on the project, updating progress
5. **Completion**: Project is marked as completed
6. **Feedback**: Client provides feedback and rating

## Project Management Interfaces

### Administrator Interfaces

- Project Status Overview: `app/dashboard/Administrator/project-status/page.tsx`
- Project Creation: `app/dashboard/Administrator/project-status/create-project/page.tsx`
- Project Details: `app/dashboard/Administrator/project-status/[slug]/page.tsx`
- Project Requests: `app/dashboard/Administrator/project-requests/page.tsx`

### Client Interfaces

- Project Status: `app/dashboard/client/project-status/page.tsx`
- Project Details: Displays project information, progress, and freelancer details

### Freelancer Interfaces

- Available Projects: `app/dashboard/freelancer/projects/page.tsx`
- Project Details: `app/dashboard/freelancer/projects/[slug]/page.tsx`
- My Projects: `app/dashboard/freelancer/my-projects/page.tsx`
- Project Details: `app/dashboard/freelancer/my-projects/[slug]/page.tsx`


## Project Components

- `components/project-components/projectInformation.tsx`: Displays project details
- `components/project-components/milestones.tsx`: Manages project milestones
- `components/project-components/InterestedFreelancers.tsx`: Shows freelancers interested in a project
- `components/project-components/feedback.tsx`: Handles project feedback
- `components/project-status.tsx`: Displays project status information

## Milestone Management

Projects are broken down into milestones for better tracking:

\`\`\`typescript
export type Milestone = {
  createdAt: Date
  id: number
  deadline: Date
  mileStoneName: string
  description: string | null
  progress: number
  totalProgressPoints: number
  projectId: number
  priorityRank: number
  isMilestoneCompleted: boolean
}
\`\`\`

- Milestone display: `components/project-components/milestones.tsx`
- Milestone updates: `components/project-components/UpdateMilestoneModal.tsx`

## Project API Services

The API services for project management are defined in `lib/api/projects.ts` and include:

- `getAllProjects(page)`: Retrieves all projects
- `getAllProjectsWithTheirClient(page)` : Retrieves projects specific to clients.
- `selectFreelancerForProject(projectSlug, userName)`: Selects freelancer for a project.
- `removeInterestedFreelancerFromProject(projectSlug, fullName)`: Remove Interested freelancer from project
- `updateProjectBySlug(slug, data)`: Updates project details
- `fetchOutsourcedProjects(page, limit, difficultyLevel, createdAtOrder, bountyOrder, nicheName)`:- Fetch outsource project for freelancers.
- `showInterestInProject(projectSlug, uid)`: Freelancers can show interest in the project.
- `removeFreelancerInterestFromProject(projectSlug, uid)`: Freelancer can remove their interests from a project.
- `updateProgressOfProject(projectSlug, fullName, progressPercentage)` : Update progress of a project.
- `removeSelectedFreelancerFromProject(projectSlug, uid)`: Remove selected Freelancer from project.
- `getProjectsForSelectFreelancer(page, limit)` : Retrieves projects specific for freelancer.
- `getSingleProject(projectSlug)`: Retrieves a specific project
- `createAProject(projectData)`: Creates a new project
- `giveFeedbackAndRatings(projectSlug, data)`: Clients can give their feedback and ratings after project completion.


## Milestone API Services

The API services for milestone management are defined in `lib/api/milestones.ts`.
