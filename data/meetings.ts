import type { Meeting } from "@/types/meeting"

export const meetings: Meeting[] = [
  {
    id: "1",
    title: "Project Kickoff Meeting",
    date: "2024-03-25T10:00:00Z",
    attendees: ["John Doe", "Jane Smith"],
    status: "upcoming",
    description: "Initial project discussion and planning session",
  },
  {
    id: "2",
    title: "Weekly Progress Review",
    date: "2024-03-26T14:30:00Z",
    attendees: ["Alice Johnson", "Bob Wilson"],
    status: "upcoming",
    description: "Review progress and discuss next steps",
  },
  {
    id: "3",
    title: "Client Consultation",
    date: "2024-03-20T11:00:00Z",
    attendees: ["Sarah Brown", "Mike Davis"],
    status: "attended",
    notes: "Discussed project requirements and timeline. Client approved initial designs.",
    description: "Initial consultation with new client",
  },
  {
    id: "4",
    title: "Team Sync",
    date: "2024-03-19T15:00:00Z",
    attendees: ["Tom Harris", "Emma Wilson"],
    status: "not_attended",
    description: "Team synchronization meeting",
  },
]

export const clients = [
  { id: "c1", name: "John Doe" },
  { id: "c2", name: "Jane Smith" },
  { id: "c3", name: "Sarah Brown" },
]

export const freelancers = [
  { id: "f1", name: "Alice Johnson" },
  { id: "f2", name: "Bob Wilson" },
  { id: "f3", name: "Mike Davis" },
]

