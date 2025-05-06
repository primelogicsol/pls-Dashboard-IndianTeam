# Frontend Components

## Overview

The Frontend Components section documents the reusable UI components used throughout the PLS system. These components provide consistent styling, behavior, and user experience across the application.

## Key Components

### Forgot Password Components
The forgot password flow is implemented through several components:
1. `email-input.tsx` - Collects the user's email
2. `otp-verification.tsx` - Verifies the OTP sent to the user's email
3. `password-reset.tsx` - Allows the user to set a new password
4. `forgot-password-form.tsx` - Fill the form for forgot password

### Project Components
The project-related components include:
1. `projectInformation.tsx` - Displays project details
2. `milestones.tsx` - Manages project milestones
3. `InterestedFreelancers.tsx` - Shows freelancers interested in a project
4. `feedback.tsx` - Allows clients to provide feedback on completed projects
5. `UpdateMilestoneModal.tsx` - Allows to modify the milestone.

### Trash Management
The trash management components incluede: 
1. `ConsultationsTable.tsx` - Consists of trasshed consultations
2. `ContactUsTable.tsx` - Consists of trashed Contact us messages
3. `HireUsTable.tsx` - Consists of trashed hire us requests.
4. `QuotesTable.tsx` - Consists of trashed quotes.
5. `UsersTable.tsx` - Consists of trashed users.

### freelancers
The freelancer components include:
1. `AllFreelancers.tsx` - Consists of all the freelancers.
2. `FreelancerRequests.tsx` - Consist of freelancer requests.

### Hire Us
The hireUs Components include: 
1. `RequestCard.tsx` - Consists of cards containing hire us requests.

### Blogs
The blogs component include:
1. `blogCard.tsx` - Consists of blog cards.

### Mobile Restriction Component

The `MobileRestriction.tsx` component displays a message when the application is accessed on mobile devices:

\`\`\`typescript
"use client";

import { useEffect, useState } from "react";

// Define mobile width limit
const MOBILE_BREAKPOINT = 768; 

export default function MobileRestriction({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleResize(); // Check initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-center p-4">
        <div className="max-w-md bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">🚫 Mobile Access Restricted</h2>
          <p className="mt-2 text-gray-600">
            Please use a **laptop or tablet** for a better experience.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

\`\`\`

## UI Component Library

The system uses a custom UI component library based on shadcn/ui, with components stored in the `components/ui` directory. These include:

- `accordian.tsx`
- `alert-dialog.tsx`
- `alert.tsx`
- `aspect-ratio.tsx`
- `avatar.tsx`
- `badge.tsx`
- `breadcrumb.tsx`
- `button.tsx`
- `calendar.tsx`
- `card.tsx`
- `carousel.tsx`
- `chart.tsx`
- `checkbox.tsx`
- `collapsible.tsx`
- `command.tsx`
- `context-menu.tsx`
- `date-range-picker.tsx`
- `dialog.tsx`
- `drawer.tsx`
- `dropdown-menu.tsx`
- `form.tsx`
- `hover-card.tsx`
- `input-otp.tsx`
- `input.tsx`
- `label.tsx`
- `menubar.tsx`
- `navigation-menu.tsx`
- `pagination.tsx`
- `popover.tsx`
- `progress.tsx`
- `radio-group.tsx`
- `resizable.tsx`
- `scroll-area.tsx`
- `select.tsx`
- `separator.tsx`
- `sheet.tsx`
- `sidebar.tsx`
- `skeleton.tsx`
- `slider.tsx`
- `sonner.tsx`
- `switch.tsx`
- `table.tsx`
- `tabs.tsx`
- `textarea.tsx`
- `toast.tsx`
- `toaster.tsx`
- `toggle-group.tsx`
- `toggle.tsx`
- `tooltip.tsx`

Each component is styled using Tailwind CSS and follows a consistent design language.
