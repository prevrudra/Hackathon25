"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "user" | "facility_owner" | "admin"

export interface User {
  id: string
  email: string
  fullName: string
  avatar?: string
  role: UserRole
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
}

interface SignupData {
  email: string
  password: string
  fullName: string
  role: UserRole
  avatar?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
<<<<<<< HEAD
    email: "owner1@quickcourt.com",
    fullName: "Rajesh Kumar",
    role: "facility_owner",
=======
    email: "admin@quickcourt.com",
    fullName: "Admin User",
    role: "admin",
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
    isVerified: true,
  },
  {
    id: "2",
<<<<<<< HEAD
    email: "owner2@quickcourt.com", 
    fullName: "Priya Sharma",
=======
    email: "owner@quickcourt.com",
    fullName: "Facility Owner",
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
    role: "facility_owner",
    isVerified: true,
  },
  {
    id: "3",
    email: "user@quickcourt.com",
    fullName: "Regular User",
    role: "user",
    isVerified: true,
  },
<<<<<<< HEAD
  {
    id: "4",
    email: "admin@quickcourt.com",
    fullName: "Admin User",
    role: "admin",
    isVerified: true,
  },
=======
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("quickcourt_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email)

<<<<<<< HEAD
    // For demo purposes, accept any non-empty password or the default password
    if (foundUser && (password === "password123" || password.length > 0)) {
=======
    if (foundUser && password === "password123") {
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
      setUser(foundUser)
      localStorage.setItem("quickcourt_user", JSON.stringify(foundUser))
      setIsLoading(false)
      return { success: true, message: "Login successful" }
    }

    setIsLoading(false)
    return { success: false, message: "Invalid email or password" }
  }

  const signup = async (data: SignupData) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === data.email)
    if (existingUser) {
      setIsLoading(false)
      return { success: false, message: "User already exists" }
    }

    // Create new user (unverified)
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      avatar: data.avatar,
      isVerified: false,
    }

    // Store pending verification
    localStorage.setItem("quickcourt_pending_user", JSON.stringify(newUser))

    setIsLoading(false)
    return { success: true, message: "Account created! Please verify your email with the OTP sent." }
  }

  const verifyOTP = async (email: string, otp: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo, accept any 6-digit OTP
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      const pendingUser = localStorage.getItem("quickcourt_pending_user")
      if (pendingUser) {
        const user = JSON.parse(pendingUser)
        user.isVerified = true
        setUser(user)
        localStorage.setItem("quickcourt_user", JSON.stringify(user))
        localStorage.removeItem("quickcourt_pending_user")
        setIsLoading(false)
        return { success: true, message: "Email verified successfully!" }
      }
    }

    setIsLoading(false)
    return { success: false, message: "Invalid OTP. Please try again." }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("quickcourt_user")
    localStorage.removeItem("quickcourt_pending_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        verifyOTP,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
