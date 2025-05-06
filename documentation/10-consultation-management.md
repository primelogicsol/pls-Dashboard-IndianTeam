# Prime Logic Dashboard - Consultation Management

## Overview

The consultation management system handles consultation requests from users, allowing administrators to review, accept, or reject these requests. It includes interfaces for consultation management and scheduling.

## Consultation Data Structure

The consultation data structure is defined in `types/consultation.ts`:

\`\`\`typescript
export interface Consultation {
  id: string
  name: string
  email: string
  phone: string
  message: string
  bookingDate: string
  address: string
  status: "PENDING" | "ACCEPTED" | "REJECTED"
}
\`\`\`

## Consultation Management Interfaces

### Administrator Interfaces

- Consultation List: `app/dashboard/Administrator/consultations/page.tsx`

## Consultation Components

- Consultation table: Displays consultation requests with status and actions

## Consultation Workflow

1. User submits a consultation request
2. Administrator reviews the request
3. Administrator accepts or rejects the request
4. If accepted, a meeting is scheduled which is in future scope as it is not ready yet. 
5. Consultation takes place

## Consultation Status

Consultations can have one of three statuses:

- `PENDING`: Awaiting administrator review
- `ACCEPTED`: Approved by administrator
- `REJECTED`: Declined by administrator

## Trash Management

The system includes trash management for deleted consultations:

- Mock Trashed consultations data: `data/trashed-consultations.ts`
- View trashed consultations: Part of `app/dashboard/Administrator/trash/page.tsx`
- Restore or permanently delete consultations: `components/trash-management/ConsultationsTable.tsx`

## Consultation API Services

The API services for consultation management are defined in `lib/api/consultations.ts` and include:

- `getAllConsultations()`: Retrieves all consultations
- `acceptAConsultation(id)`: Accepts a consultation request
- `rejectAConsultation(id)`: Rejects a consultation request
- `trashAConsultation(id)`: Soft deletes a consultation (moves to trash)
- `untrashAConsultation(id)`: Restores a consultation from trash
- `deleteAConsultation(id)`: Permanently deletes a consultation

## Meeting Scheduling(Future Scope)

Once a consultation is accepted, a meeting can be scheduled:

- Meeting data structure: `types/meeting.ts`
- Meeting management: `data/meetings.ts`

## Security Considerations

- Validation of consultation requests
- Protection of personal information
- Secure communication channels
