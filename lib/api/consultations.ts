import axios from "axios";
import { apiInstance } from "./axiosInstance";
import { getUserDetails } from "./storage";

//Get all consultations
export async function getAllConsultations() {
  const userDetails = getUserDetails();
  const accessToken = userDetails?.accessToken;
  try {
    const response = await apiInstance.get(
      "/consultation/getAllRequestedConsultations",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
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
  const userDetails = getUserDetails();
  if (!userDetails || !userDetails.accessToken) {
    throw { message: "Unauthorized: No access token found." };
  }
  const accessToken = userDetails.accessToken;
  try {
    const response = await apiInstance.patch(
      `/consultation/acceptRequestedConsultation/${id}`,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
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
  const userDetails = getUserDetails();
  if (!userDetails || !userDetails.accessToken) {
    throw { message: "Unauthorized: No access token found." };
  }
  const accessToken = userDetails.accessToken;
  try {
    const response = await apiInstance.patch(
      `/consultation/rejectRequestedConsultation/${id}`,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
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
  if (!userDetails || !userDetails.accessToken) {
    throw { message: "Unauthorized: No access token found." };
  }
  const accessToken = userDetails.accessToken;
  const uid = userDetails.uid;
  try {
    const response = await apiInstance.patch(
      `/consultation/trashRequestedConsultation/${id}`,
      { uid },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
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

