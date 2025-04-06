export interface Newsletter {
  id: string
  subject: string
  content: string
  sentAt: string
  recipientType: "all" | "single"
  recipientEmail?: string
}

export interface NewsletterResponse {
  success: boolean
  data: {
    newsletters: Newsletter[]
    totalCount: number
  }
}

