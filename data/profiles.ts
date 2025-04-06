export interface Profile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  avatar?: string
  role: string
  status: "active" | "inactive"
  type: "client" | "freelancer"
  skills?: string[]
  bio?: string
}

export const clientProfiles = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Enterprise Client",
    status: "active",
    type: "client",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234 567 891",
    location: "Los Angeles, USA",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Small Business",
    status: "active",
    type: "client",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+1 234 567 892",
    location: "Chicago, USA",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Enterprise Client",
    status: "active",
    type: "client",
  },
] as const

export const freelancerProfiles = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 234 567 893",
    location: "London, UK",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Full Stack Developer",
    status: "active",
    type: "freelancer",
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: "2",
    name: "Bob Wilson",
    email: "bob@example.com",
    phone: "+1 234 567 894",
    location: "Berlin, Germany",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "UI/UX Designer",
    status: "active",
    type: "freelancer",
    skills: ["Figma", "Adobe XD", "User Research"],
  },
  {
    id: "3",
    name: "Charlie Davis",
    email: "charlie@example.com",
    phone: "+1 234 567 895",
    location: "Toronto, Canada",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Backend Developer",
    status: "active",
    type: "freelancer",
    skills: ["Python", "Django", "PostgreSQL"],
  },
] as const

