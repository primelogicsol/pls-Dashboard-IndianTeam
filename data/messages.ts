import type { ContactMessage } from "@/lib/api/contact"

export const messages: ContactMessage[] = [
  {
    id: "1",
    firstName: "Freelancer",
    lastName: "User",
    email: "freelancer@example.com",
    subject: "Payment Issue",
    message: "I haven't received my payment for the completed project.",
    priority: "high",
    status: "active",
    createdAt: "2024-02-10T12:00:00Z",
    response: null,
  },
  {
    id: "2",
    firstName: "Freelancer",
    lastName: "User",
    email: "freelancer@example.com",
    subject: "Project Clarification",
    message: "I need some clarification on the project requirements.",
    priority: "medium",
    status: "resolved",
    createdAt: "2024-02-08T15:30:00Z",
    response:
      "Thank you for reaching out. I've reviewed the project details and provided clarification in the project chat. Please let me know if you need any further information.",
  },
  // Add more messages as needed
]

