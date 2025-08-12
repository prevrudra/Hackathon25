"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("=== LOGIN DEBUG START ===")
      console.log("Attempting login with:", { email, password })
      console.log("Email length:", email.length)
      console.log("Password length:", password.length)
      console.log("Email chars:", JSON.stringify(email))
      console.log("Password chars:", JSON.stringify(password))
      
      // Test direct API call first
      console.log("Testing direct API call...")
      const directResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const directData = await directResponse.json()
      console.log("Direct API response:", directData)
      console.log("Direct API response success:", directData.success)
      console.log("Direct API response message:", directData.message)
      console.log("Direct API response user:", directData.user)
      
      // Now test through auth context
      console.log("Testing through auth context...")
      const result = await login(email, password)
      console.log("Auth context result:", result)
      console.log("Auth context result success:", result.success)
      console.log("Auth context result message:", result.message)
      
      // TEMPORARY FIX: If auth context fails but direct API works, bypass auth context
      if (!result.success && directData.success) {
        console.log("BYPASSING AUTH CONTEXT - Direct API worked, setting user manually")
        
        // Manually set the user in localStorage (temporary fix)
        const userData = {
          id: directData.user.id,
          email: directData.user.email,
          fullName: directData.user.fullName,
          role: directData.user.role,
          isVerified: directData.user.isVerified,
          avatar: directData.user.avatar
        }
        localStorage.setItem("quickcourt_user", JSON.stringify(userData))
        
        console.log("Login successful via bypass, user data stored:", userData)
        
        // Force a hard redirect to dashboard which will reload the auth context
        console.log("Forcing redirect to dashboard...")
        window.location.href = "/dashboard"
        return
      }
      
      if (result.success) {
        console.log("Login successful, redirecting...")
        router.push("/dashboard")
      } else {
        console.log("Login failed:", result.message)
        const errorMsg = result.message || "Login failed. Please try again."
        console.log("Setting error message:", errorMsg)
        setError(errorMsg)
      }
      console.log("=== LOGIN DEBUG END ===")
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Branding (Desktop only) */}
      <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
              <span className="text-4xl font-bold text-white">Q</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Welcome to QuickCourt
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Your gateway to premium sports facilities across India
          </p>
          <div className="space-y-2 text-blue-100">
            <p>✓ Instant booking confirmation</p>
            <p>✓ Premium facilities nationwide</p>
            <p>✓ Secure payment processing</p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 lg:p-10 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="lg:hidden mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <span className="text-xl font-bold text-white">Q</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">QUICKCOURT</h1>
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-700">LOGIN</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 space-y-3 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Sign up
                </a>
              </p>
              <p>
                <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Forgot password?
                </a>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold mb-2 text-blue-900 text-center text-sm">🚀 Try Demo Accounts</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="font-medium text-gray-700">Admin:</span>
                  <span className="text-blue-600 font-mono">admin@quickcourt.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="font-medium text-gray-700">Owner:</span>
                  <span className="text-blue-600 font-mono">owner@quickcourt.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="font-medium text-gray-700">User:</span>
                  <span className="text-blue-600 font-mono">user@quickcourt.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="font-medium text-gray-700">Password:</span>
                  <span className="text-blue-600 font-mono">password123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}