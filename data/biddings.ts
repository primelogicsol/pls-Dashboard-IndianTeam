export interface Bidding {
  id: string
  title: string
  description: string
  budget: number
  deadline: string
  applicants: number
  status: "ongoing" | "completed" | "hold" | "cancelled"
  requiredSkills: string[]
  assignedFreelancer?: string
  documents?: Array<{ name: string; url: string }>
  holdReason?: string
  cancelReason?: string
}

export interface BidSubmission {
  id: string
  biddingId: string
  freelancerId: string
  freelancerName: string
  bidAmount: number
  deliveryTime: number
  proposal: string
  paymentType: string
  documents: string[]
  status: "pending" | "accepted" | "rejected"
  submittedAt: string
}

export const availableProjects: Bidding[] = [
  {
    id: "1",
    title: "E-commerce Website Development",
    description:
      "Develop a fully functional e-commerce website with product catalog, shopping cart, and payment integration.",
    budget: 5000,
    deadline: "2024-06-30",
    applicants: 8,
    status: "ongoing",
    requiredSkills: ["React", "Node.js", "MongoDB", "Payment Gateway Integration"],
  },
  {
    id: "2",
    title: "Mobile App UI/UX Design",
    description: "Design user interface and experience for a new fitness tracking mobile application.",
    budget: 3000,
    deadline: "2024-05-15",
    applicants: 12,
    status: "ongoing",
    requiredSkills: ["UI/UX Design", "Figma", "Mobile App Design", "User Research"],
  },
  {
    id: "3",
    title: "Content Management System (CMS) Development",
    description: "Build a custom CMS for a media company to manage articles, videos, and podcasts.",
    budget: 7000,
    deadline: "2024-08-31",
    applicants: 5,
    status: "ongoing",
    requiredSkills: ["PHP", "Laravel", "MySQL", "RESTful API"],
  },
]

export const submittedBids: BidSubmission[] = [
  {
    id: "1",
    biddingId: "1",
    freelancerId: "f1",
    freelancerName: "John Doe",
    bidAmount: 4800,
    deliveryTime: 45,
    proposal: "I have extensive experience in e-commerce development and can deliver a high-quality solution.",
    paymentType: "Milestone",
    documents: ["portfolio.pdf", "previous-work.pdf"],
    status: "pending",
    submittedAt: "2024-03-20T10:00:00Z",
  },
]

