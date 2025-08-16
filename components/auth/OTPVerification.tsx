'use client'

import { useState, useEffect, useRef } from 'react'

interface OTPVerificationProps {
  email: string
  otpType: 'email_verification' | 'password_reset' | 'login_verification'
  onVerificationSuccess: (userId: number) => void
  onCancel: () => void
  title?: string
  description?: string
}

export default function OTPVerification({
  email,
  otpType,
  onVerificationSuccess,
  onCancel,
  title = "Email Verification",
  description = "We've sent a 6-digit code to your email"
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Check initial rate limit status
  useEffect(() => {
    checkRateLimit()
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const checkRateLimit = async () => {
    try {
      const response = await fetch('/api/secure-auth/otp/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCanResend(data.canRequest)
        setTimeLeft(data.timeLeft || 0)
      }
    } catch (error) {
      console.error('Rate limit check error:', error)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all 6 digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      verifyOTP(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      setError('')
      verifyOTP(pastedData)
    }
  }

  const verifyOTP = async (otpCode: string) => {
    setIsVerifying(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/secure-auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otpCode,
          otpType
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('✅ Verification successful!')
        setTimeout(() => {
          onVerificationSuccess(data.userId)
        }, 1000)
      } else {
        setError(data.message)
        // Clear OTP on error
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      setError('Verification failed. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const resendOTP = async () => {
    setIsResending(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/secure-auth/otp/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otpType
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('📧 New OTP sent to your email!')
        setCanResend(false)
        setTimeLeft(30) // 30 second cooldown
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        
        // Show OTP in development
        if (data.otpCode) {
          console.log('🔢 Development OTP:', data.otpCode)
        }
      } else {
        setError(data.message)
        if (data.timeLeft) {
          setTimeLeft(data.timeLeft)
          setCanResend(false)
        }
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📧</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm">{description}</p>
          <p className="text-blue-600 font-medium text-sm mt-1">{email}</p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <div className="flex justify-center space-x-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  digit ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } ${error ? 'border-red-500' : ''}`}
                disabled={isVerifying}
              />
            ))}
          </div>
          
          {/* Auto-verify indicator */}
          {otp.every(digit => digit !== '') && (
            <div className="text-center text-sm text-blue-600 mb-2">
              {isVerifying ? '🔄 Verifying...' : '✨ Auto-verifying...'}
            </div>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm text-center">{success}</p>
          </div>
        )}

        {/* Resend Section */}
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>
          
          {canResend ? (
            <button
              onClick={resendOTP}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm underline disabled:opacity-50"
            >
              {isResending ? '📤 Sending...' : '📧 Resend OTP'}
            </button>
          ) : (
            <div className="text-gray-500 text-sm">
              <p>Resend available in</p>
              <p className="font-mono text-lg font-bold text-blue-600">
                {formatTime(timeLeft)}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isVerifying}
          >
            Cancel
          </button>
          
          <button
            onClick={() => verifyOTP(otp.join(''))}
            disabled={otp.some(digit => digit === '') || isVerifying}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isVerifying ? '🔄 Verifying...' : '✅ Verify'}
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🔒 This code expires in 10 minutes. For security, don't share it with anyone.
          </p>
        </div>
      </div>
    </div>
  )
}
