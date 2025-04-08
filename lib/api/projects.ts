import { apiInstance } from "./axiosInstance";
import { getUserDetails } from "./storage";
import axios from "axios";

export async function getAllProjects(page: number = 1) {
  try {
    const response = await apiInstance.get(
      `/project/getAllProjects?page=${page}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch projects"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getAllProjectsWithThierClient(page: number = 1) {
  try {
    const userDetails = getUserDetails();
    const accessToken = userDetails?.accessToken;
    const clientId = userDetails?.uid; // Ensure this is the correct client ID

    if (!accessToken) {
      throw new Error("User not authenticated");
    }
    if (!clientId) {
      throw new Error("Client ID is required");
    }

    const response = await apiInstance.get(
      `/project/getAllProjectsWithThierClient/${clientId}?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch projects"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

// Get single particular project according to the slug
export async function getSingleProject(projectSlug: string) {
  try {
    const response = await apiInstance.get(
      `/project/getSingleProject/${projectSlug}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch projects"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

// Select Freelancer for project
export async function selectFreelancerForProject(
  projectSlug: string,
  userName: string
) {
  try {
    const response = await apiInstance.patch(
      `/project/selectFreelancerForProject/${projectSlug}`,
      {
        selectedFreelancersForThisProject: [userName], // Sending body as required
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to select freelancer"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

//Remove Freelancer from Requested List
export async function removeInterestedFreelancerFromProject(
  projectSlug: string,
  fullName: string
) {
  try {
    const response = await apiInstance.patch(
      `/project/removeSelectedFreelancer/${projectSlug}`,
      {
        selectedFreelancersForThisProject: fullName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to select freelancer"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

// Update Project By Slug
export async function updateProjectBySlug(slug: string, data: any) {
  const {
    title,
    detail,
    deadline,
    projectType,
    projectStatus,
    bounty,
    difficultyLevel,
    niche,
    progressPercentage,
  } = data;
  try {
    const response = await apiInstance.patch(`/project/updateProjectBySlug/${slug}`, {
      title: title,
      detail: detail,
      deadline: deadline,
      projectType: projectType,
      projectStatus: projectStatus,
      bounty: bounty,
      difficultyLevel: difficultyLevel,
      niche: niche,
      progressPercentage: progressPercentage,
    });
    if(response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to update the Project"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export const fetchOutsourcedProjects = async (
  page: number = 1,
  limit: number = 10,
  difficultyLevel?: string,
  createdAtOrder: "latest" | "oldest" = "latest",
  bountyOrder: "highest" | "lowest" = "lowest",
  nicheName?: string
) => {
  try {
    const response = await apiInstance.get(`/project/getAllOutsourcedProjects`, {
      params: {
        page,
        limit,
        difficultyLevel,
        createdAtOrder,
        bountyOrder,
        nicheName,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching outsourced projects:", error);
    throw error;
  }
};


export async function showInterestInProject(projectSlug: string, uid: string) {
  try {
    const response = await apiInstance.patch(`/project/createInterestedFreelancers/${projectSlug}`, {
      interestedFreelancerWhoWantToWorkOnThisProject : [uid]
    });
    if(response?.status === 200) {
      return response?.data;
    } 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to show Interest in the Project"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function removeFreelancerInterestFromProject(projectSlug: string, uid: string) {
  try {
    const response = await apiInstance.patch(`/project/removeFreelancerFromInterestedList/${projectSlug}`, {
      freelancerUid : uid
    });
    if(response?.status === 200) {
      return response?.data;
    } 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to Remove Interest from the Project"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function updateProgressOfProject(projectSlug: string, fullName: string, progressPercentage: number) {
  try {
    const response = await apiInstance.patch(`/project/updateProgressOfProject/${projectSlug}`, {
      freelancerName : fullName,
      progressPercentage : progressPercentage
    });
    if(response?.status === 200) {
      return response?.data;
    } 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to Update the progress of the Project"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}


export async function removeSelectedFreelancerFromProject(projectSlug: string, uid: string) {
  try {
    const response = await apiInstance.patch(`/project/removeSelectedFreelancer/${projectSlug}`, {
      freelancerUid : uid
    });
    if(response?.status === 200) {
      return response?.data;
    } 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to Remove Interest from the Project"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export const getProjectsForSelectFreelancer = async (
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const response = await apiInstance.get(`/project/getProjectForSelectedFreelancers`, {
      params: {
        page,
        limit
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching projects for selected freelnacer:", error);
    throw error;
  }
};

export async function getTrashedConsultations() {
  try {
    const response = await apiInstance.get("/trash/getTrashedConsultations");
    if(response?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to Fetch trashed consultations"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function createAProject(data: any) {
  try {
    const response = await apiInstance.post("/project/createProject", data);
    if(response?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to Fetch trashed consultations"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

