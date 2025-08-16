import { NextRequest, NextResponse } from 'next/server'
import { SecureUserManager } from '@/lib/secure-database'

export async function POST(request: NextRequest) {
  try {
    const { email, otpType } = await request.json()
    
    // Validate input
    if (!email || !otpType) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP type are required' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Validate OTP type
    const validOtpTypes = ['email_verification', 'password_reset', 'login_verification']
    if (!validOtpTypes.includes(otpType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP type' },
        { status: 400 }
      )
    }
    
    // Check rate limiting first
    const rateLimitStatus = SecureUserManager.checkOTPRateLimit(email)
    if (!rateLimitStatus.canRequest) {
      return NextResponse.json(
        { 
          success: false, 
          message: rateLimitStatus.message,
          timeLeft: rateLimitStatus.timeLeft,
          canRetry: false
        },
        { status: 429 }
      )
    }
    
    // Generate OTP
    const result = await SecureUserManager.generateOTP(email, otpType)
    
    return NextResponse.json({
      success: true,
      message: result.message,
      // Only include OTP in development for testing
      ...(process.env.NODE_ENV === 'development' && { otpCode: result.otpCode })
    })
    
  } catch (error) {
    console.error('OTP generation error:', error)
    
    const message = (error as Error).message
    const status = message.includes('wait') ? 429 : 
                   message.includes('not found') ? 404 : 500
    
    return NextResponse.json(
      { 
        success: false, 
        message: message || 'Failed to generate OTP',
        canRetry: status !== 429
      },
      { status }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
