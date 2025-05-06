# Technical Specifications

This document provides detailed answers to technical questions about the Prime Logic Dashboard system.

## Tech Stack & Architecture

### What backend language and framework does the website use?
The Prime Logic Dashboard uses Node.js with Next.js framework (App Router) for both frontend and backend functionality. The backend API routes are implemented as Next.js API routes, providing a seamless full-stack JavaScript/TypeScript environment.

### Is the site monolithic, modular, or already microservice-based?
The site follows a modular monolithic architecture. While it's built as a single Next.js application, the codebase is organized in a modular fashion with clear separation of concerns:
- `/app` directory contains page components organized by user roles
- `/components` contains reusable UI components
- `/lib/api` contains API client code organized by domain
- `/data` contains mock data structures
- `/types` contains TypeScript type definitions

### What database(s) are used?
The application is designed to work with a RESTful API backend. Based on the API client code in `/lib/api`, the system appears to communicate with a backend service that likely uses a relational database. The specific database technology isn't explicitly defined in the frontend code, but the data structures suggest a relational database system like PostgreSQL or MySQL.

### Are there any APIs currently exposed by the site?
Yes, the site consumes several APIs through the client code in `/lib/api`:
- Authentication API (`/lib/api/auth.ts`)
- Users API (`/lib/api/users.ts`)
- Projects API (`/lib/api/projects.ts`)
- Blogs API (`/lib/api/blogs.ts`)
- Consultations API (`/lib/api/consultations.ts`)
- Freelancers API (`/lib/api/freelancers.ts`)
- Contact API (`/lib/api/contact.ts`)
- Quotes API (`/lib/api/quotes.ts`)
- Milestones API (`/lib/api/milestones.ts`)
- Hire Us API (`/lib/api/hire-us.ts`)
- API Interceptors (`lib/api/apiInterceptor.ts`)
- Axios Instances (`lib/api/axiosInstance.ts`)
- Storage (`lib/api/storage.ts`)

## Authentication & Security

### How is user authentication handled?
Authentication is handled through a token-based system implemented in the `/lib/api/auth.ts` and `/hooks/useAuth.tsx` files. Also the refresh token logic is in `/lib/api/axiosInstance.ts` and storage of userdetails is in `/lib/api/storage.ts` The system uses:
- JWT tokens for authentication
- Role-based access control (Administrator, Client, Freelancer, moderator)
- Login/registration forms with email verification
- Password reset functionality with OTP verification

The authentication flow includes:
1. User login/registration
2. Token generation and storage
3. Token validation on protected routes
4. Role-based access control for different dashboard sections

### Is there an existing Single Sign-On (SSO) or token mechanism?
Yes, the application uses a token-based authentication mechanism. Tokens are stored in cookie and included in API requests through an axios interceptor (`/lib/api/apiInterceptor.ts`). There's no evidence of external SSO integration in the current codebase.

### Are there any security requirements (CORS policy, IP whitelisting, firewall rules, etc.)?
The codebase includes:
- CORS handling in API requests
- Token validation middleware (`middleware.ts`)
- Route protection based on user roles
- Secure password handling for reset functionality

## Integration Preferences

### How do you prefer to integrate external microservices?
Based on the codebase structure, the preferred integration method is:

**API-based (HTTP/REST)**
The system is built around RESTful API communication, with a structured API client layer in `/lib/api`. Any new microservices would ideally follow this pattern, exposing RESTful endpoints that the main application can consume.

### Do you have an internal API gateway or reverse proxy?
The codebase doesn't explicitly show an API gateway, but the `axiosInstance.ts` file serves as a centralized client for API communication, providing a consistent interface for all API requests with base URL configuration and interceptors for authentication.

## Deployment & Hosting

### Where is the main site hosted?
Based on the presence of `next.config.mjs` and other Next.js configuration files, the application appears to be designed for deployment on Vercel or a similar Next.js-compatible hosting platform.

### Can third party microservices be deployed on the same server/network?
The architecture suggests that the frontend is separate from backend services. Third-party microservices would likely need to be deployed separately and accessed via API endpoints.

### Is there a CI/CD pipeline the microservice should plug into?
There's no explicit CI/CD configuration in the codebase. However, the project structure is compatible with standard Next.js deployment workflows, which typically involve:
- Git-based version control
- Automated builds on commit
- Environment-specific deployments (development, staging, production)

## Data Exchange

### What data format do you expect?
The application expects JSON data format for all API communications, as evidenced by the API client code and data structures.

### Do we need to pull or push data from/to your database?
The architecture follows a pull model where the frontend pulls data from the backend APIs. For data modifications, the frontend pushes updates through API calls.

### Will the microservice have direct database access or should it go through your API?
Based on the current architecture, microservices should interact through the established API layer rather than accessing the database directly. This maintains the separation of concerns and security of the data layer.

## Documentation & Access

### Do you have API documentation (Swagger/OpenAPI)?
The codebase doesn't include explicit Swagger/OpenAPI documentation. However, the API client code in `/lib/api` provides implicit documentation of the expected endpoints and data structures.

### System architecture diagrams?
No architecture diagrams are included in the codebase. The structure can be inferred from the directory organization and component relationships.

### Environment setup guide?
The project includes environment variable references but no explicit setup guide. Required environment variables include:
- `NEXT_PUBLIC_PLS_AUTH`
- `NEXT_PUBLIC_PLS`
- `NEXT_PUBLIC_PLS_CONTACT_US`
- `NEXT_PUBLIC_PLS_TRASH`

### Can you provide a staging environment or test credentials for integration?
This would need to be requested separately as it's not included in the codebase.

## Testing and Monitoring

### Do you expect integration tests from the microservice?
The codebase doesn't include explicit testing frameworks or test files, suggesting that formal testing requirements may need to be established.

### What logging, monitoring, or alerting standards should we follow (if any)?
No explicit logging or monitoring tools are integrated into the codebase. Standard Next.js error handling and console logging are used throughout.

### How should errors or failures in the microservice be reported or handled?
The current error handling approach includes:
- Try/catch blocks around API calls
- Error state management in React components
- User-facing error messages for authentication failures

Any microservice integration should follow similar patterns, with structured error responses that can be interpreted and displayed by the frontend application.
