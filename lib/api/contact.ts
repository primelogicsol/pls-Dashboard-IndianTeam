import { getUserDetails } from "./storage";
import { contactUsInstance, trashInstance } from "./axiosInstance";
import axios from "axios";

// Create new message
export const createMessage = async (values: any) => {
  try {
    const response = await contactUsInstance.post("/createMessage", values);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "Failed to Create a message" };
    }
  }
};

// Get all Contact Us messages
export async function getAllContactUsMessages(page = 1) {
  try {
    const response = await contactUsInstance.get(
      `/getAllMessages?page=${page}`
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "Failed to fetch messages" };
    }
  }
}

export async function deleteAMessage(messageId: number) {
  try {
    const response = await contactUsInstance.delete(
      `deleteMessage/${messageId}`
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw { message: "Failed to Delete message" };
    }
  }
}

// Trash a Contact Us message
export async function trashAMessage(uid: string) {
  try {
    const response = await contactUsInstance.patch(
      "/moveMessageToTrash",
      { victimUid: uid } // Sending the request body
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw new Error("Failed to trash the message");
    }
  }
}

//Untrash Contact Us message
export async function UntrashAMessage(id: number) {
  try {
    const response = await contactUsInstance.patch(
      "/unTrashMessage",
      { victimUid: id },
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw new Error("Failed to Un trash the message");
    }
  }
}

// Get trashed Contact Us Messages
export async function getTrashedContactUs() {
  try {
  
    const response = await trashInstance.get("/getTrashedMessages");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch trashed Contact Us Messages"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}
