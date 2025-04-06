import { getUserDetails } from "./storage";
import { contactUsInstance, trashInstance } from "./axiosInstance";
import axios from "axios";

// Create new message
export const createMessage = async (values:any) => {
  try {
    const userDetails = getUserDetails();
    const uid = userDetails?.uid;
    const accessToken = userDetails?.accessToken;

    if (!uid || !accessToken) {
      throw new Error("User not authenticated");
    }

    const response = await contactUsInstance.post(
      "/createMessage",
       values , // ✅ Directly sending required fields
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error sending message:", error);
    throw error;
  }
};

// // Get all messages
// export const getAllMessages = async () => {
//   try {
//     const response = await apiInstance.get("/messages")
//     return response.data
//   } catch (error) {
//     console.error("Failed to fetch messages:", error)
//     throw error
//   }
// }

// // Move message to trash
// export const moveMessageToTrash = async (id: string) => {
//   try {
//     const response = await apiInstance.patch(`/messages/${id}/trash`, {
//       victimUid: id,
//     })
//     return response.data
//   } catch (error) {
//     console.error("Failed to trash message:", error)
//     throw error
//   }
// }

// Get all Contact Us messages
export async function getAllContactUsMessages(page = 1) {
  const userDetails = getUserDetails();
  const accessToken = userDetails?.accessToken;
  
  try {
    const response = await contactUsInstance.get(`/getAllMessages?page=${page}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

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



// Trash a Contact Us message
export async function trashAMessage(uid: string) {
  const userDetails = getUserDetails();
  const accessToken = userDetails?.accessToken;
  if (!accessToken) {
    throw new Error("Unauthorized: No access token found.");
  }
  try {
    const response = await contactUsInstance.patch( // Change GET to POST or PATCH
      "/moveMessageToTrash",
      { victimUid: uid }, // Sending the request body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
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
  const userDetails = getUserDetails();
  const accessToken = userDetails?.accessToken;
  if (!accessToken) {
    throw new Error("Unauthorized: No access token found.");
  }
  try {
    const response = await contactUsInstance.patch( 
      "/unTrashMessage",
      { victimUid: id }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
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

// Get trashed Contact Us Messages
export async function getTrashedContactUs() {
  try {
    const userDetails = getUserDetails();
    const accessToken = userDetails?.accessToken;
    if (!accessToken) {
      throw new Error("User not authenticated");
    }
    const response = await trashInstance.get("/getTrashedMessages", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch trashed Contact Us Messages"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}



