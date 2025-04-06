export interface Consultation {
  subject: ReactNode
  trashedBy: ReactNode
  trashedAt: string | number | Date
  id: string
  name: string
  email: string
  phone: string
  message: string
  bookingDate: string
  address: string
  status: "PENDING" | "ACCEPTED" | "REJECTED"
}

