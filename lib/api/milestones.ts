import axios from "axios";
import { apiInstance } from "./axiosInstance";

export async function createAMilestone(data: any, projectId?: number) {
  try {
    const response = await apiInstance.post(
      `/milestone/createMilestone/${projectId}`,
      data
    );
    if (response?.status === 200 || response?.status === 201) {
      return response;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to Create a milestone"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function updateAMilestone(data: any, milestoneId?: number) {
  try {
    const response = await apiInstance.patch(
      `/milestone/updateMilestone/${milestoneId}`,
      data
    );
    if (response?.status === 200 || response?.status === 201) {
      return response;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to Update the milestone"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function deleteAMilestone(milestoneId?: number) {
  try {
    const response = await apiInstance.delete(
      `/milestone/deleteMilestone/${milestoneId}`
    );
    if (response?.status === 200 || response?.status === 201) {
      return response;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to Delete a milestone"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function completeMilestone(milestoneId?: number) {
  try {
    const response = await apiInstance.patch(
      `/milestone/completeMilestone/${milestoneId}`
    );
    if (response?.status === 200 || response?.status === 201) {
      return response;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message ||
          "Failed to mark the milestone as completed"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function updateProgressOfAMilestone(
  milestoneId?: number,
  completedProgress?: any
) {
  try {
    const response = await apiInstance.patch(
      `/milestone/updateMilestoneProgress/${milestoneId}`,
      {
        progress: completedProgress,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message ||
          "Failed to update progress of the milestone"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}
