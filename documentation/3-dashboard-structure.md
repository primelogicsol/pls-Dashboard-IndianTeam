# Prime Logic Dashboard - Dashboard Structure

## Overview

The dashboard is the central interface of the application, providing role-specific functionality for administrators, clients, moderators and freelancers. Each role has a customized dashboard layout with relevant navigation and features.

## Dashboard Layout

The dashboard uses a consistent layout structure across all user roles:

- Header with user profile and notifications
- Sidebar navigation with role-specific menu items
- Main content area for displaying page content

## Role-Specific Dashboards

### Administrator Dashboard (`app/dashboard/Administrator/layout.tsx`)

The administrator dashboard provides access to all system management functions:

- User management (clients and freelancers)
- Project management
- Blog management
- Consultation management
- System settings

Navigation items include:
- Dashboard overview
- Project status
- Project requests
- Freelancer profiles
- Client profiles
- Blogs
- Consultations
- Contact us
- Trash management
- Settings

### Client Dashboard (`app/dashboard/client/layout.tsx`)

The client dashboard focuses on project management and communication:

- Project status tracking

Navigation items include:
- Dashboard overview
- Contact us
- Settings

### Freelancer Dashboard (`app/dashboard/freelancer/layout.tsx`)

The freelancer dashboard centers on finding and managing projects:

- Available projects
- Assigned project management
- Work submission

Navigation items include:
- Available projects
- My projects
- Contact us
- Settings

## Common Dashboard Components

### Dashboard Layout (`app/dashboard/layout.tsx`)

The base layout component that wraps all dashboard pages, providing the common structure and authentication checks.

### Mobile Restriction (`components/MobileRestriction.tsx`)

Component that displays a message for mobile users, as the dashboard is optimized for desktop use.

## Dashboard Pages

### Overview Pages

Each role has a dashboard overview page that displays relevant statistics and quick access to common functions:

- Admin, moderator: `app/dashboard/Administrator/page.tsx`
- Client: `app/dashboard/client/page.tsx`
- Freelancer: `app/dashboard/freelancer/page.tsx`

### Settings Pages

Each role has access to a settings page for managing their account:

- Admin, moderator: `app/dashboard/Administrator/settings/page.tsx`
- Client: `app/dashboard/client/settings/page.tsx`
- Freelancer: `app/dashboard/freelancer/settings/page.tsx`

### Contact Pages

Each role can access a contact page to communicate with support:

- Admin, moderator: `app/dashboard/Administrator/contact-us/page.tsx`
- Client: `app/dashboard/client/contact-us/page.tsx`
- Freelancer: `app/dashboard/freelancer/contact-us/page.tsx`

## Responsive Design

The dashboard is primarily designed for desktop use, with a mobile restriction component that displays a message for users on smaller screens. This ensures optimal user experience on the intended devices.
