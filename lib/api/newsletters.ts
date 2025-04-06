import { apiInstance } from "@/lib/axios"

// Get all newsletters for freelancer
export const getFreelancerNewsletters = async () => {
  try {
    const response = await apiInstance.get("/freelancer/newsletters")
    return response.data
  } catch (error) {
    console.error("Failed to fetch newsletters:", error)
    throw error
  }
}

// Get newsletter by ID
export const getNewsletterById = async (id: string) => {
  try {
    const response = await apiInstance.get(`/freelancer/newsletters/${id}`)
    return response.data
  } catch (error) {
    console.error("Failed to fetch newsletter:", error)
    throw error
  }
}

// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string) => {
  try {
    const response = await apiInstance.post("/freelancer/newsletters/subscribe", { email })
    return response.data
  } catch (error) {
    console.error("Failed to subscribe to newsletter:", error)
    throw error
  }
}

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = async (email: string) => {
  try {
    const response = await apiInstance.post("/freelancer/newsletters/unsubscribe", { email })
    return response.data
  } catch (error) {
    console.error("Failed to unsubscribe from newsletter:", error)
    throw error
  }
}

