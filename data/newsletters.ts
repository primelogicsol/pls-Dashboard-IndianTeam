import type { Newsletter } from "@/lib/api/newsletter"

export const newsletters: Newsletter[] = [
  {
    id: "1",
    subject: "Welcome to Our Platform",
    content: "<h1>Hello there how are you doing</h1><strong>Welcome to our platform!</strong>",
    sentAt: "2024-02-08T10:00:00Z",
    recipientType: "all",
  },
  {
    id: "2",
    subject: "Special Offer for You",
    content: "<h1>Exclusive Offer</h1><strong>Check out our latest features</strong>",
    sentAt: "2024-02-07T15:30:00Z",
    recipientType: "single",
    recipientEmail: "user@example.com",
  },
  // Add more newsletters...
]

