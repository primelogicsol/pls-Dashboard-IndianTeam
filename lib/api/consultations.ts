import axios from "axios";
import { apiInstance } from "./axiosInstance";
import { getUserDetails } from "./storage";

//Get all consultations
export async function getAllConsultations() {
  try {
    const response = await apiInstance.get(
      "/consultation/getAllRequestedConsultations"
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "failed to fetch the consultations" };
    }
  }
}

// Accept a consultation
export async function acceptAConsultation(id: string) {
  try {
    const response = await apiInstance.patch(
      `/consultation/acceptRequestedConsultation/${id}`,
      {}, // Empty body
      
    );
    if (response.status === 200) {
      return response.data;
    }
    return null; // Fallback return value
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "Failed to accept the consultation" };
    }
  }
}

// Reject consultation
export async function rejectAConsultation(id: string) {
  
  try {
    const response = await apiInstance.patch(
      `/consultation/rejectRequestedConsultation/${id}`,
      {}, // Empty body
    );
    if (response.status === 200) {
      return response.data;
    }
    return null; // Fallback return value
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "Failed to reject the consultation" };
    }
  }
}

// Trash a consultation
export async function trashAConsultation(id: string) {
  const userDetails = getUserDetails();
  const uid = userDetails.uid;
  try {
    const response = await apiInstance.patch(
      `/consultation/trashRequestedConsultation/${id}`,
      { uid },
    );
    if (response.status === 200) {
      return response.data;
    }
    return null; // Fallback return value
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "Failed to trash the consultation" };
    }
  }
}

//Untrash a consultation
export async function untrashAConsultation(id: string) {
  try {
    const response = await apiInstance.patch(
      `/consultation/untrashRequestedConsultation/${id}`
    );
    if (response.status === 200) {
      return response.data;
    }
    return null; // Fallback return value
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "Failed to untrash the consultation" };
    }
  }
}

// Delete a consultation
export async function deleteAConsultation(id: string) {
  try {
    const response = await apiInstance.delete(
      `/consultation/deleteRequestedConsultation/${id}`
    );
    if (response.status === 200) {
      return response.data;
    }
    return null; // Fallback return value
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "Failed to delete the consultation" };
    }
  }
}

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