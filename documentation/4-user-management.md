# Prime Logic Dashboard - User Management

## Overview

The user management system handles the creation, management, and authentication of users across four primary roles: Admin, Moderator, Client, and Freelancer. The system provides interfaces for user registration, profile management, and administrative user control.

## User Types

### Admin
- Has full access to the system
- Can manage all users, projects, and content
- Can access administrative functions

### Moderator
- Has all functionalities that of admin
- Can't permanently delete anything

### Client
- Raise project requests and admin/moderator creates the project for that client
- Track their own projects

### Freelancer
- Can apply on available projects
- Works on assigned projects
- Manages their profile and portfolio


## User Management Interfaces

### User Profiles

The system maintains separate profile management for different user types:

- Freelancer profiles (`app/dashboard/Administrator/freelancer-profiles/`)
- Client profiles (`app/dashboard/Administrator/client-profiles/`)

### Profile Components

- `components/profile-card.tsx`: Displays user profile information
- `components/freelancer-card.tsx`: Specialized card for freelancer information

## Administrative User Management

Administrators have access to comprehensive user management tools:

### Freelancer Management

- View all freelancers: `app/dashboard/Administrator/freelancer-profiles/page.tsx`
- Approve/reject freelancer applications: `components/freelancers/FreelancerRequests.tsx`

### Client Management

- View all clients: `app/dashboard/Administrator/client-profiles/page.tsx`
- Manage client accounts and permissions

## User Settings

Each user role has access to a settings page to manage their account:

- Admin, moderator: `app/dashboard/Administrator/settings/page.tsx`
- Client: `app/dashboard/client/settings/page.tsx`
- Freelancer: `app/dashboard/freelancer/settings/page.tsx`

## Trash Management

The system includes a trash management system for soft-deleted users:

- View trashed users: `app/dashboard/Administrator/trash/page.tsx`
- Restore or permanently delete users: `components/trash-management/UsersTable.tsx`

## Security Considerations

- User passwords are securely hashed
- Role-based access control prevents unauthorized access
- User data is validated before storage
- Sensitive operations require additional verification
