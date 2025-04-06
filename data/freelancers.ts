export interface Technology {
  name: string
  category: "frontend" | "backend" | "database" | "cloud"
}

export interface Freelancer {
  id: string
  name: string
  role: string
  avatar?: string
  rating: number
  reviews: number
  availability: {
    status: string
    weeks: number
  }
  experience: number
  industries: string[]
  technologies: {
    frontend: string[]
    backend: string[]
    database: string[]
    cloud: string[]
  }
  certifications: string[]
}

export const freelancers: Freelancer[] = [
  {
    id: "1",
    name: "Jane Doe",
    role: "Software Engineer",
    rating: 4.8,
    reviews: 45,
    availability: {
      status: "Available",
      weeks: 2,
    },
    experience: 4,
    industries: ["EdTech", "Travel", "Logistics"],
    technologies: {
      frontend: ["Vue.js", "JavaScript", "Nuxt.js", "Bootstrap"],
      backend: ["Ruby on Rails", "Go", "REST API"],
      database: ["MySQL", "SQLite", "Cassandra"],
      cloud: ["Azure", "Terraform", "Jenkins"],
    },
    certifications: ["Azure Certified Developer", "Google Cloud Certified"],
  },
  {
    id: "2",
    name: "John Smith",
    role: "Backend Developer",
    rating: 4.5,
    reviews: 32,
    availability: {
      status: "Available",
      weeks: 3,
    },
    experience: 6,
    industries: ["Healthcare", "Finance", "E-Commerce"],
    technologies: {
      frontend: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      backend: ["Node.js", "Express", "GraphQL"],
      database: ["PostgreSQL", "MongoDB", "Redis"],
      cloud: ["AWS", "Docker", "Kubernetes"],
    },
    certifications: ["AWS Certified Solutions Architect", "Docker Certified Associate"],
  },
  // Add more freelancers...
]

