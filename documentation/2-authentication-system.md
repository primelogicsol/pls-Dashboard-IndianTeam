# Prime Logic Dashboard - Authentication System

## Overview

The authentication system in Prime Logic Dashboard is built using JWT (JSON Web Tokens) and implements role-based access control. The system handles user registration, login, password reset, and session management.

## Authentication Flow

1. **Registration**: Users register with their email, password and other datas.
2. **Login**: Users authenticate with credentials and receive a JWT token
3. **Token Storage**: JWT token is stored in cookie.
4. **Request Authorization**: Token is included in API requests via Authorization header
5. **Role Verification**: User roles are verified for protected routes
6. **Session Management**: Token expiration and refresh mechanisms

## Components

### Login Form (`components/LoginForm.tsx`)

Handles user login with email and password, making API requests to authenticate users and storing the JWT token and redirecting user to his respective dashboard based on the userRole.

### Sign Up Form (`components/signUp-form.tsx`)

Manages user registration with form validation and API integration.

### Forgot Password Flow

The forgot password flow consists of multiple components:

- `components/forgot-password/email-input.tsx`: Email submission form
- `components/forgot-password/otp-verification.tsx`: OTP verification component
- `components/forgot-password/password-reset.tsx`: Password reset form

### OTP Verification (`components/otp-verification.tsx`)

Handles one-time password verification for email verification.

## API Services

### Auth API (`lib/api/auth.ts`)

Contains functions for authentication-related API calls:

- `login(email, password)`: Authenticates user credentials
- `registerUser(userData)`: Registers a new user
- `sendOtp(email)` : Sends a otp for entered email for forgot password request. 
- `forgotPasswordVerifyOtp(otp)`: Verifies password reset otp
- `updatePassword(newPassword, uid)` : Updates a password 
- `sendOtpForVerifyingUser(email)`: Verifies one-time email verification otp.
- `verifyEmail(email, otp)` - Verifies the email and otp one time. 
- `updateUserInfo(username, fullname, address, phone)` - Updates user info
- `updateUserEmail(email)` - Updates user email.
- `getCurrentUserDetails()` - Retrieves the details of current logged in user.
- `logout()` - Removes the stored credentials from cookie.


## Custom Hooks

### useAuth Hook (`hooks/useAuth.tsx`)

Custom hook for accessing authentication context:

\`\`\`typescript
const { isAuthorized } = useAuth(["ADMIN", "MODERATOR"]);
\`\`\`

## Protected Routes

Protected routes are implemented using middleware that checks for valid authentication and appropriate role access.

### Middleware (`middleware.ts`)

Handles route protection by verifying JWT tokens and user roles before allowing access to protected pages.

## Pages

- `/login`: User login page
- `/register`: User registration page
- `/forgot-password`: Password recovery initiation
- `/verify-otp`: OTP verification page
- `/reset-password`: Password reset page

## Security Considerations

- JWT tokens are stored securely
- Password reset requires email verification
- Passwords are hashed before storage
- API requests are protected with proper authorization
- Role-based access control prevents unauthorized access
