export interface Meeting {
  id: string
  title: string
  date: string
  attendees: string[]
  status: "upcoming" | "attended" | "not_attended"
  notes?: string
  description?: string
}

export interface MeetingResponse {
  success: boolean
  data: {
    meetings: Meeting[]
    totalCount: number
  }
}

export interface MeetingDetailsResponse {
  success: boolean
  data: {
    meeting: Meeting
  }
}

