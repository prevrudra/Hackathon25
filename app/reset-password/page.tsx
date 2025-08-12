"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("")
    if (!token) {
      setStatus("Invalid or missing token.")
      return
    }
    if (!password || password.length < 6) {
      setStatus("Password must be at least 6 characters.")
      return
    }
    if (password !== confirm) {
      setStatus("Passwords do not match.")
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      })
      const result = await response.json()
      if (response.ok && result.success) {
        setStatus("Password reset successful! You can now log in.")
        setTimeout(() => router.push("/login"), 2000)
      } else {
        setStatus(result.message || "Could not reset password.")
      }
    } catch (err) {
      setStatus("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-10 border border-white/30">
        <h1 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {status && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-center text-sm animate-fade-in">
            {status}
          </div>
        )}
        <div className="mt-6 text-center text-xs text-gray-500">
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">Back to Login</a>
        </div>
      </div>
    </div>
  )
}
