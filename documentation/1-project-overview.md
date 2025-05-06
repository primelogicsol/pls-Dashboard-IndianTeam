# Prime Logic Dashboard - Project Overview

## Introduction

Prime Logic Dashboard is a comprehensive platform designed to manage freelancers, clients, projects, and various administrative functions. The application follows a role-based access control system with three primary user roles: Administrator, Client, and Freelancer.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based authentication
- **API Communication**: Axios

## Project Structure

The project follows a standard Next.js App Router structure:

- `/app`: Contains all pages and layouts
  - `/dashboard`: Dashboard pages for different user roles
    - `/Administrator`: Admin-specific pages
    - `/client`: Client-specific pages
    - `/freelancer`: Freelancer-specific pages
  - `/login`, `/register`, etc.: Authentication pages
- `/components`: Reusable UI components
- `/contexts`: React context providers
- `/data`: Mock data for development
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and API services
- `/types`: TypeScript type definitions
- `/styles`: Global CSS styles

## Role-Based Access Control

The application implements role-based access control with three primary roles:

1. **Administrator**: Has access to all features and can manage users, projects, blogs, newsletters, etc.
2. **Client**: Can post projects, manage their projects, and interact with freelancers
3. **Freelancer**: Can browse available projects, submit bids, and manage assigned projects
4. **Moderator**: Can perform all the operations as that of admin, but cannot permanently delete anything.

## Key Features

1. **User Management**: Registration, authentication, and profile management
2. **Project Management**: Creating, assigning, and tracking project
3. **Blog Management**: Creating and managing blog content
4. **Consultation Management**: Handling consultation requests
5. **Document Management**: Uploading and managing project-related documents

## Getting Started

To run the application locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at `http://localhost:3000`

## Authentication Flow

The application uses a JWT-based authentication system:

1. User logs in with credentials
2. Server validates credentials and returns a JWT token
3. Token is stored in cookie.
4. Token is included in the Authorization header for subsequent API requests
5. Role-based access is determined by the 'Role' header in requests
