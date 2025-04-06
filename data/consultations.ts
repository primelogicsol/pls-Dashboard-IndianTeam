import type { Consultation } from "@/types/consultation"

export const consultations: Consultation[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    message: "I need a consultation for my project",
    bookingDate: "2024-03-15T10:00:00Z",
    address: "123 Main St, City, Country",
    status: "pending",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543210",
    message: "Looking for advice on my startup idea",
    bookingDate: "2024-03-16T14:00:00Z",
    address: "456 Elm St, Town, Country",
    status: "accepted",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "5555555555",
    message: "Need help with my business plan",
    bookingDate: "2024-03-17T11:00:00Z",
    address: "789 Oak St, Village, Country",
    status: "rejected",
  },
]

