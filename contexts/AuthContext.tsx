// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"

// interface User {
//   email: string
//   role: "client" | "freelancer" | "moderator" | "admin"
// }

// interface AuthContextType {
//   user: User | null
//   login: (email: string, password: string) => Promise<boolean>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null)

//   useEffect(() => {
//     // Check for saved user in localStorage
//     const savedUser = localStorage.getItem("user")
//     if (savedUser) {
//       setUser(JSON.parse(savedUser))
//     }
//   }, [])

//   const login = async (email: string, password: string): Promise<boolean> => {
//     // Dummy login logic
//     if (email && password) {
//       const dummyUser: User = {
//         email,
//         role: "client", // Default role, you can implement logic to determine role based on email if needed
//       }
//       setUser(dummyUser)
//       localStorage.setItem("user", JSON.stringify(dummyUser))
//       return true
//     }
//     return false
//   }

//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem("user")
//   }

//   return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

