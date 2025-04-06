export const supportTickets = [
  {
    id: "1",
    title: "Payment Issue",
    description: "Unable to process payment for project completion",
    status: "open",
    type: "client",
    priority: "high",
    userId: "1",
    userName: "John Doe",
    createdAt: "2024-02-07T12:00:00Z",
  },
  {
    id: "2",
    title: "Account Access",
    description: "Cannot access my freelancer dashboard",
    status: "in-progress",
    type: "freelancer",
    priority: "medium",
    userId: "2",
    userName: "Alice Johnson",
    createdAt: "2024-02-07T10:30:00Z",
  },
  // Add more support tickets...
] as const

