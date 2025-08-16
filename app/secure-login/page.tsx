'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSecureAuth } from '@/lib/secure-auth-context'

export default function SecureLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login, isLoading } = useSecureAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      const result = await login(email, password)
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...')
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">🔒</span>
            </div>
            <h1 className="text-2xl font-bold">Secure Login</h1>
            <p className="text-gray-600">Sign in to your QuickCourt account</p>
            <p className="text-xs text-green-600 mt-2">✅ Cookie-based authentication (No localStorage)</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "🔒 Secure Sign In"}
            </button>
          </form>

          <div className="text-center text-sm mt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/secure-signup" className="text-blue-600 hover:underline">
                Sign up here
              </a>
            </p>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">🔒 Security Features:</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>✅ HttpOnly cookies (no localStorage vulnerability)</li>
              <li>✅ JWT tokens with expiration</li>
              <li>✅ Account lockout after failed attempts</li>
              <li>✅ Security audit logging</li>
              <li>✅ Session validation on every request</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
