'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// User type definition
interface User {
  id: number
  email: string
  fullName: string
  role: 'user' | 'facility_owner' | 'admin'
  isVerified: boolean
}

// Auth context type
interface SecureAuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  generateOTP: (email: string, otpType: 'email_verification' | 'password_reset' | 'login_verification') => Promise<{ success: boolean; message: string; otpCode?: string }>
  verifyOTP: (email: string, otpCode: string, otpType: 'email_verification' | 'password_reset' | 'login_verification') => Promise<{ success: boolean; message: string; userId?: number }>
  checkOTPStatus: (email: string) => Promise<{ success: boolean; canRequest: boolean; timeLeft: number; message: string }>
}

interface SignupData {
  email: string
  password: string
  fullName: string
  role: 'user' | 'facility_owner' | 'admin'
  phone?: string
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined)

export function SecureAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Validate session on mount (using cookies, not localStorage!)
  useEffect(() => {
    validateSession()
  }, [])

  const validateSession = async () => {
    try {
      setIsLoading(true)
      
      // Call validation endpoint (reads from httpOnly cookies)
      const response = await fetch('/api/secure-auth/validate', {
        method: 'GET',
        credentials: 'include', // Include cookies
      })
      
      const data = await response.json()
      
      if (data.valid && data.user) {
        setUser(data.user)
        console.log('✅ SECURE AUTH: Valid session found for user:', data.user.email)
      } else {
        setUser(null)
        console.log('🔒 SECURE AUTH: No valid session found')
      }
    } catch (error) {
      console.error('Session validation error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/secure-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (data.success && data.user) {
        setUser(data.user)
        console.log('✅ SECURE AUTH: Login successful for user:', data.user.email)
        return { success: true, message: data.message }
      } else {
        console.log('❌ SECURE AUTH: Login failed:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Login failed. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (signupData: SignupData) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/secure-auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(signupData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log('✅ SECURE AUTH: Signup successful')
        return { success: true, message: data.message }
      } else {
        console.log('❌ SECURE AUTH: Signup failed:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'Signup failed. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      
      // Call logout endpoint (clears httpOnly cookies)
      await fetch('/api/secure-auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setUser(null)
      console.log('✅ SECURE AUTH: Logout successful')
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear user state even if API call fails
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshAuth = async () => {
    await validateSession()
  }

  const generateOTP = async (email: string, otpType: 'email_verification' | 'password_reset' | 'login_verification') => {
    try {
      const response = await fetch('/api/secure-auth/otp/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otpType })
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ SECURE AUTH: OTP generated successfully')
        return { success: true, message: data.message, otpCode: data.otpCode }
      } else {
        console.log('❌ SECURE AUTH: OTP generation failed:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('OTP generation error:', error)
      return { success: false, message: 'Failed to generate OTP. Please try again.' }
    }
  }

  const verifyOTP = async (email: string, otpCode: string, otpType: 'email_verification' | 'password_reset' | 'login_verification') => {
    try {
      const response = await fetch('/api/secure-auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otpCode, otpType })
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ SECURE AUTH: OTP verified successfully')
        return { success: true, message: data.message, userId: data.userId }
      } else {
        console.log('❌ SECURE AUTH: OTP verification failed:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      return { success: false, message: 'Failed to verify OTP. Please try again.' }
    }
  }

  const checkOTPStatus = async (email: string) => {
    try {
      const response = await fetch('/api/secure-auth/otp/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        return {
          success: true,
          canRequest: data.canRequest,
          timeLeft: data.timeLeft,
          message: data.message
        }
      } else {
        return { success: false, canRequest: false, timeLeft: 0, message: data.message }
      }
    } catch (error) {
      console.error('OTP status check error:', error)
      return { success: false, canRequest: false, timeLeft: 0, message: 'Failed to check OTP status' }
    }
  }

  const contextValue: SecureAuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    refreshAuth,
    generateOTP,
    verifyOTP,
    checkOTPStatus
  }

  return (
    <SecureAuthContext.Provider value={contextValue}>
      {children}
    </SecureAuthContext.Provider>
  )
}

export function useSecureAuth() {
  const context = useContext(SecureAuthContext)
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider')
  }
  return context
}

// Security note: This context NEVER uses localStorage!
// All authentication state is managed through secure httpOnly cookies
// that cannot be accessed or manipulated by client-side JavaScript.
console.log('🔒 SECURE AUTH CONTEXT: Initialized with cookie-based authentication (NO localStorage)')

export default SecureAuthProvider
