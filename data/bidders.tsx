export interface Bidder {
  id: string
  name: string
  avatar: string
  rating: number
  completedProjects: number
  bidAmount: string
  deliveryTime: string
  proposal: string
}

export const bidders: Bidder[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/placeholder-avatar.jpg",
    rating: 4.8,
    completedProjects: 15,
    bidAmount: "1500",
    deliveryTime: "15",
    proposal:
      "I have extensive experience in e-commerce development using modern technologies like React and Node.js. I can deliver a high-performance, scalable solution that meets all your requirements.",
  },
  {
    id: "2",
    name: "Bob Wilson",
    avatar: "/placeholder-avatar.jpg",
    rating: 4.5,
    completedProjects: 12,
    bidAmount: "1200",
    deliveryTime: "20",
    proposal:
      "With my background in both front-end and back-end development, I can create a seamless e-commerce experience. I specialize in secure payment integrations and optimized product catalogs.",
  },
  {
    id: "3",
    name: "Charlie Davis",
    avatar: "/placeholder-avatar.jpg",
    rating: 4.2,
    completedProjects: 8,
    bidAmount: "1000",
    deliveryTime: "25",
    proposal:
      "As a UI/UX specialist with a focus on fitness and health apps, I can create an intuitive and engaging design that motivates users to achieve their fitness goals.",
  },
  // Add more bidders...
]

