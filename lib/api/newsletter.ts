import { apiInstance } from "@/lib/api/axiosInstance"

export interface Newsletter {
  id: string
  subject: string
  content: string
  sentAt: string
  recipientType: "all" | "single"
  recipientEmail?: string
}

// Send newsletter to all subscribers
export const sendNewsletterToAll = async (newsletter: string) => {
  try {
    const response = await apiInstance.post("/PLS_NEWSLETTER/sendToAll", {
      newsLetter: newsletter,
    })
    return response.data
  } catch (error) {
    console.error("Failed to send newsletter:", error)
    throw error
  }
}

// Send newsletter to single subscriber
export const sendNewsletterToSingle = async (email: string, newsletter: string) => {
  try {
    const response = await apiInstance.post("/PLS_NEWSLETTER/sendToSingle", {
      email,
      newsLetter: newsletter,
    })
    return response.data
  } catch (error) {
    console.error("Failed to send newsletter:", error)
    throw error
  }
}

// Get all newsletters
export const getAllNewsletters = async () => {
  try {
    const response = await apiInstance.get("/newsletters")
    return response.data
  } catch (error) {
    console.error("Failed to fetch newsletters:", error)
    throw error
  }
}
