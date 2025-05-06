# Freelancer Management System

## Overview

The Freelancer Management System handles all freelancer-specific operations including profile management, Apply for a project, project assignment, and milestone tracking. This system is designed to facilitate the workflow for freelancers within the platform.

## Key Components

### Freelancer Types

The system defines freelancer-specific types:

\`\`\`typescript
export interface Request {
  id: number;
  name: string;
  email: string;
  phone: string;
  niche: string;
  address: string;
  detail: string;
  yourPortfolio: string;
  yourTopProject1: string;
  yourTopProject2: string;
  yourTopProject3: string;
  isAccepted: boolean;
  createdAt: string;
  yearOfExperience: string;
  country: string;
}

export type Freelancer = {
    username: string
    fullName: string
    niche: string | null
    detail: string | null
    kpiRankPoints: number
    kpiRank: TKPIRANK
    portfolioUrl: string | null
    projects: {
      projectStatus: string
      projectSlug: string
      progressPercentage: number
    }[]
  }
  
\`\`\`

### Freelancer API Integration

Freelancer-related API calls are defined in `lib/api/freelancers.ts`:

 - getAllFreelancersRequest() - Retrieves all freelancer requests.
 - getAllFreelancers(params) - Get All freelancers.
 - TrashAFreeLancer() - Trash a freelancer.
 - AcceptFreeLancerRequests(id) - Accept a freelancer requests.


### Freelancer Dashboard

The freelancer dashboard (`app/dashboard/freelancer/projects/page.tsx`) provides an overview of the freelancer's projects from where he can apply for a project.

## Project Bidding Process

1. Freelancer browses available projects
2. Freelancer Applies for a project.
3. Admin/ Moderator reviews the request and selects a freelancer
4. Freelancer is notified of his acceptance
5. Project is assigned to the freelancer

## Milestone Management

Freelancers can track and update milestones for their assigned projects:

\`\`\`typescript
export const updateAMilestone = (data: any, milestoneId?: number) => {
  const response = await apiInstance.patch(
      `/milestone/updateMilestone/${milestoneId}`,
      data
    );
    if (response?.status === 200 || response?.status === 201) {
      return response;
    }
};

export const completeMilestone = (milestoneId?: number) => {
 const response = await apiInstance.patch(
      `/milestone/completeMilestone/${milestoneId}`
    );
    if (response?.status === 200 || response?.status === 201) {
      return response;
    }
};
\`\`\`

The `components/project-components/milestones.tsx` component allows freelancers to view and update milestone status.

## Freelancer Registration Process

1. User submits a request with email and password and all it's details
2. After submitting the request, he need to wait for his credentials.
3. Admin/moderator reviews the freelancer request and accepts the request.
4. After the freelancer request is accpted. Automatically freelancer credential is created via the backend and sent to the freelancer. 
5. Freelancer gains access to the freelancer dashboard
