import type { Document } from "@/types/document"

export interface ClientDocument extends Document {
  uploadedBy: "client" | "freelancer" | "moderator"
}

export const clientDocuments: ClientDocument[] = [
  {
    id: "1",
    projectId: "1",
    name: "Project Scope Document",
    uploadedBy: "client",
    uploadedAt: "2024-03-01T10:00:00Z",
    fileSize: "2.5 MB",
  },
  {
    id: "2",
    projectId: "1",
    name: "Design Mockups.zip",
    uploadedBy: "freelancer",
    uploadedAt: "2024-03-15T14:30:00Z",
    fileSize: "10 MB",
  },
  {
    id: "3",
    projectId: "2",
    name: "App Requirements.docx",
    uploadedBy: "client",
    uploadedAt: "2024-03-10T09:15:00Z",
    fileSize: "1 MB",
  },
  {
    id: "4",
    projectId: "3",
    name: "SEO Report.pdf",
    uploadedBy: "freelancer",
    uploadedAt: "2024-03-08T12:00:00Z",
    fileSize: "5 MB",
  },
  // Add more client documents...
]

