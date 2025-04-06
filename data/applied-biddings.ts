export interface AppliedBidding {
  id: string
  projectTitle: string
  projectDescription: string
  appliedQuotation: number
  proposedDelivery: number
  status: "selected" | "rejected" | "onhold"
  proposal: string
  clientFeedback?: string
}

export const appliedBiddings: AppliedBidding[] = [
  {
    id: "1",
    projectTitle: "E-commerce Website Redesign",
    projectDescription: "Redesign and improve the user experience of an existing e-commerce website.",
    appliedQuotation: 2500,
    proposedDelivery: 30,
    status: "selected",
    proposal:
      "I have extensive experience in e-commerce redesigns and can deliver a modern, user-friendly interface that will boost conversions.",
    clientFeedback: "Great proposal! We're excited to work with you.",
  },
  {
    id: "2",
    projectTitle: "Mobile App Development",
    projectDescription: "Develop a cross-platform mobile app for a fitness tracking service.",
    appliedQuotation: 5000,
    proposedDelivery: 45,
    status: "onhold",
    proposal:
      "With my expertise in React Native, I can deliver a high-performance app that works seamlessly on both iOS and Android.",
    clientFeedback: "We're considering your proposal and will get back to you soon.",
  },
  {
    id: "3",
    projectTitle: "Custom CRM Integration",
    projectDescription: "Integrate a custom CRM solution with existing business systems.",
    appliedQuotation: 3500,
    proposedDelivery: 25,
    status: "rejected",
    proposal:
      "I have successfully completed similar CRM integrations and can ensure a smooth implementation with minimal disruption to your existing workflows.",
    clientFeedback:
      "Thank you for your proposal, but we've decided to go with another freelancer who has more specific experience in our industry.",
  },
  {
    id: "4",
    projectTitle: "AI-powered Chatbot",
    projectDescription: "Develop an AI-powered chatbot for customer support.",
    appliedQuotation: 4000,
    proposedDelivery: 40,
    status: "onhold",
    proposal:
      "I can leverage my experience with natural language processing and machine learning to create an intelligent chatbot that will significantly improve your customer support efficiency.",
  },
  {
    id: "5",
    projectTitle: "Data Visualization Dashboard",
    projectDescription: "Create an interactive data visualization dashboard for business analytics.",
    appliedQuotation: 3000,
    proposedDelivery: 35,
    status: "selected",
    proposal:
      "I specialize in creating intuitive and informative data visualization dashboards using D3.js and React. I can deliver a solution that will help your team make data-driven decisions more effectively.",
    clientFeedback: "Excellent proposal! We're looking forward to seeing your data visualization skills in action.",
  },
]

