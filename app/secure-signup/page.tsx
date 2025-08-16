'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSecureAuth } from '@/lib/secure-auth-context'
import OTPVerification from '@/components/auth/OTPVerification'

export default function SecureSignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'user' as 'user' | 'facility_owner' | 'admin',
    phone: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const { signup, isLoading } = useSecureAuth()
  const router = useRouter()

  // Debug: Log state changes
  console.log('🔍 RENDER: showOTPVerification =', showOTPVerification)
  console.log('🔍 RENDER: success =', success)
  console.log('🔍 RENDER: error =', error)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    console.log('🔍 DEBUG: Form submitted')
    console.log('🔍 DEBUG: Form data:', formData)

    // Validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        phone: formData.phone || undefined
      })
      
      if (result.success) {
        console.log('🔍 DEBUG: Signup successful, generating real OTP...')

        // Generate real OTP for email verification
        try {
          const otpResponse = await fetch('/api/secure-auth/otp/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              otpType: 'email_verification'
            })
          })

          const otpData = await otpResponse.json()

          if (otpData.success) {
            setShowOTPVerification(true)
            setSuccess('✅ Account created! Please check your email for the verification code.')
            console.log('📧 OTP sent to:', formData.email)
          } else {
            setError('Account created but failed to send verification email. Please try logging in.')
            setTimeout(() => {
              router.push('/secure-login')
            }, 3000)
          }
        } catch (otpError) {
          console.error('OTP generation error:', otpError)
          setError('Account created but failed to send verification email. Please try logging in.')
          setTimeout(() => {
            router.push('/secure-login')
          }, 3000)
        }
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleOTPVerificationSuccess = (userId: number) => {
    console.log('🔍 DEBUG: OTP verification successful for user:', userId)
    setShowOTPVerification(false)
    setSuccess('✅ Email verified successfully! Redirecting to login...')

    setTimeout(() => {
      router.push('/secure-login')
    }, 2000)
  }

  const handleOTPCancel = () => {
    setShowOTPVerification(false)
    setSuccess('You can verify your email later from your account settings.')

    setTimeout(() => {
      router.push('/secure-login')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">🔒</span>
            </div>
            <h1 className="text-2xl font-bold">Secure Signup</h1>
            <p className="text-gray-600">Create your QuickCourt account</p>
            <p className="text-xs text-green-600 mt-2">✅ Secure registration with encryption</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Account Type *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isLoading}
              >
                <option value="user">Regular User</option>
                <option value="facility_owner">Facility Owner</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password (min 8 characters)"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "🔒 Create Secure Account"}
            </button>
          </form>

          <div className="text-center text-sm mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/secure-login" className="text-green-600 hover:underline">
                Sign in here
              </a>
            </p>
          </div>


          
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-sm font-semibold text-green-800 mb-2">🔒 Security Features:</h3>
            <ul className="text-xs text-green-700 space-y-1">
              <li>✅ Bcrypt password hashing (cost factor 14)</li>
              <li>✅ Email verification tokens</li>
              <li>✅ Input validation and sanitization</li>
              <li>✅ Secure database storage</li>
              <li>✅ No client-side password storage</li>
            </ul>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPVerification && (
        <OTPVerification
          email={formData.email}
          otpType="email_verification"
          onVerificationSuccess={handleOTPVerificationSuccess}
          onCancel={handleOTPCancel}
          title="Verify Your Email"
          description="Enter the 6-digit verification code sent to your email"
        />
      )}
    </div>
  )
}
