import axios from "axios";
import { apiInstance } from "./axiosInstance";

export async function createQuote(data: any) {
  try {
    const response = await apiInstance.post("/getQuotes/createQuote", data);

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

// Get all quotes
export async function getAllQuotes() {
  try {
    const response = await apiInstance.get("/getQuotes/getAllQuotes");

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

// Get all Trashed Quotes
export async function getTrashedQuotes() {
  try {
    const response = await apiInstance.get("/trash/getTrashedQuotes");
    if(response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw new Error("Failed to fetch the trashed messages");
    }
  }
}


// Trash a quote 

export async function trashQuote(id: number) {
  try {
    const response = await apiInstance.patch(`/getQuotes/trashQuote/${id}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to trash the quote");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

// Untrash a quote
export async function untrashQuote(id: number) {
    try {
      const response = await apiInstance.patch(`/getQuotes/untrashQuote/${id}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to trash the quote");
      } else {
        throw new Error("An unexpected error occurred.");
      }
    }
  }

// Delete a quote 
export async function deleteQuote(id: number) {
  try{
    const response = await apiInstance.delete(`/getQuotes/deleteQuote/${id}`);
    if(response.status === 200) {
      return response.data;
    }
  }catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to Delete the quote");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}
  