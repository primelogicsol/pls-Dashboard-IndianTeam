# Prime Logic Dashboard - API Documentation

## Overview

This document provides comprehensive documentation for the API endpoints used in the Prime Logic Dashboard. The API follows RESTful principles and uses JWT for authentication.

## Authentication

All endpoints require authentication using a JWT token. The role-based access is determined by the 'Role' header in the requests. Include the following headers in all requests:

\`\`\`
Authorization: Bearer <token>
Role: <role>
\`\`\`

Where `<role>` is one of: `administrator`, `client`, or `freelancer`.

## Base URL

The base URL for all API endpoints is: `/api`

## API Interceptor

The application uses an API interceptor (`lib/api/apiInterceptor.ts`) to handle common request/response processing:

- Adding authentication headers
- Handling errors
- Refreshing tokens
- Logging

## Axios Instance

A configured Axios instance (`lib/api/axiosInstance.ts`) is used for all API requests, with base URL and default headers.

## API Endpoints

### Authentication API (`lib/api/auth.ts`)

- `POST /auth/login`: Authenticate user and get token
- `POST /auth/register`: Register a new user
- `POST /auth/forgot-password`: Initiate password reset
- `POST /auth/verify-otp`: Verify one-time password
- `POST /auth/reset-password`: Reset user password
- `POST /auth/refresh-token`: Refresh authentication token

### Users API (`lib/api/users.ts`)

- `GET /users`: Get all users
- `GET /users/:id`: Get user by ID
- `POST /users`: Create a new user
- `PUT /users/:id`: Update user information
- `DELETE /users/:id`: Delete a user
- `POST /users/:id/restore`: Restore a deleted user

### Projects API (`lib/api/projects.ts`)

- `GET /projects`: Get all projects
- `GET /projects/:id`: Get project by ID
- `POST /projects`: Create a new project
- `PUT /projects/:id`: Update project information
- `DELETE /projects/:id`: Delete a project
- `GET /projects/client/:clientId`: Get projects by client ID
- `GET /projects/freelancer/:freelancerId`: Get projects by freelancer ID

### Milestones API (`lib/api/milestones.ts`)

- `GET /milestones/project/:projectId`: Get milestones by project ID
- `POST /milestones`: Create a new milestone
- `PUT /milestones/:id`: Update milestone information
- `DELETE /milestones/:id`: Delete a milestone
- `PUT /milestones/:id/complete`: Mark milestone as completed

### Blogs API (`lib/api/blogs.ts`)

- `GET /blogs`: Get all blogs
- `GET /blogs/:id`: Get blog by ID
- `POST /blogs`: Create a new blog
- `PUT /blogs/:id`: Update blog information
- `DELETE /blogs/:id`: Delete a blog
- `POST /blogs/:id/restore`: Restore a deleted blog

### Newsletters API (`lib/api/newsletters.ts`)

- `GET /newsletters`: Get all newsletters
- `GET /newsletters/:id`: Get newsletter by ID
- `POST /newsletters`: Create a new newsletter
- `POST /newsletters/:id/send`: Send a newsletter
- `DELETE /newsletters/:id`: Delete a newsletter
- `POST /newsletters/:id/restore`: Restore a deleted newsletter

### Consultations API (`lib/api/consultations.ts`)

- `GET /consultations`: Get all consultations
- `GET /consultations/:id`: Get consultation by ID
- `POST /consultations`: Create a new consultation
- `PUT /consultations/:id`: Update consultation information
- `PUT /consultations/:id/accept`: Accept a consultation
- `PUT /consultations/:id/reject`: Reject a consultation
- `DELETE /consultations/:id`: Delete a consultation
- `POST /consultations/:id/restore`: Restore a deleted consultation

### Freelancers API (`lib/api/freelancers.ts`)

- `GET /freelancers`: Get all freelancers
- `GET /freelancers/:id`: Get freelancer by ID
- `POST /freelancers`: Create a new freelancer
- `PUT /freelancers/:id`: Update freelancer information
- `DELETE /freelancers/:id`: Delete a freelancer
- `PUT /freelancers/:id/approve`: Approve a freelancer
- `PUT /freelancers/:id/reject`: Reject a freelancer

### Contact API (`lib/api/contact.ts`)

- `GET /contact`: Get all contact messages
- `GET /contact/:id`: Get contact message by ID
- `POST /contact`: Create a new contact message
- `PUT /contact/:id/respond`: Respond to a contact message
- `DELETE /contact/:id`: Delete a contact message

## Response Format

All API responses follow a consistent format:

\`\`\`json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "error": string (optional)
}
\`\`\`

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a descriptive message:

\`\`\`json
{
  "success": false,
  "error": "Error message",
  "message": "Human-readable error message"
}
\`\`\`

## Pagination

Endpoints that return multiple items support pagination:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Example: `GET /api/blogs?page=2&limit=20`

## Filtering and Sorting
