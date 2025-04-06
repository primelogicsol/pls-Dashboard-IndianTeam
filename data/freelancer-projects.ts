export interface Document {
  id: string
  name: string
  uploadedAt: string
}

export interface Project {
  id: string
  title: string
  client: string
  deadline: string
  status: "in-progress" | "completed" | "on-hold"
  documents: Document[]
}

export const freelancerProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Website Redesign",
    client: "TechStore Inc.",
    deadline: "2024-06-30",
    status: "in-progress",
    documents: [
      { id: "doc1", name: "Project Brief.pdf", uploadedAt: "2024-03-01T10:00:00Z" },
      { id: "doc2", name: "Design Mockups.zip", uploadedAt: "2024-03-15T14:30:00Z" },
    ],
  },
  {
    id: "2",
    title: "Mobile App Development",
    client: "FitTrack",
    deadline: "2024-08-15",
    status: "in-progress",
    documents: [{ id: "doc3", name: "App Requirements.docx", uploadedAt: "2024-03-10T09:15:00Z" }],
  },
  {
    id: "3",
    title: "Custom CRM Integration",
    client: "Sales Pro LLC",
    deadline: "2024-07-31",
    status: "completed",
    documents: [
      { id: "doc4", name: "Integration Specs.pdf", uploadedAt: "2024-02-20T11:45:00Z" },
      { id: "doc5", name: "Final Report.pdf", uploadedAt: "2024-03-25T16:00:00Z" },
    ],
  },
  {
    id: "4",
    title: "AI Chatbot Implementation",
    client: "Support Solutions",
    deadline: "2024-09-30",
    status: "in-progress",
    documents: [{ id: "doc6", name: "Chatbot Flow.pdf", uploadedAt: "2024-04-05T11:00:00Z" }],
  },
  {
    id: "5",
    title: "Data Visualization Dashboard",
    client: "Analytics Co.",
    deadline: "2024-07-15",
    status: "on-hold",
    documents: [
      { id: "doc7", name: "Dashboard Wireframes.pdf", uploadedAt: "2024-03-20T09:45:00Z" },
      { id: "doc8", name: "Data Sources.xlsx", uploadedAt: "2024-03-22T14:20:00Z" },
    ],
  },
]

