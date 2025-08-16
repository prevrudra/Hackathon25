import { NextRequest, NextResponse } from 'next/server'
import { SecureUserManager } from '@/lib/secure-database'

export async function POST(request: NextRequest) {
  try {
    const { email, otpCode, otpType } = await request.json()
    
    // Validate input
    if (!email || !otpCode || !otpType) {
      return NextResponse.json(
        { success: false, message: 'Email, OTP code, and OTP type are required' },
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
    
    // Validate OTP code format (6 digits)
    if (!/^\d{6}$/.test(otpCode)) {
      return NextResponse.json(
        { success: false, message: 'OTP code must be 6 digits' },
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
    
    // Verify OTP
    const result = await SecureUserManager.verifyOTP(email, otpCode, otpType)
    
    return NextResponse.json({
      success: true,
      message: result.message,
      userId: result.userId
    })
    
  } catch (error) {
    console.error('OTP verification error:', error)
    
    const message = (error as Error).message
    const status = message.includes('Invalid') || message.includes('expired') ? 400 :
                   message.includes('disabled') || message.includes('attempts') ? 423 : 500
    
    return NextResponse.json(
      { 
        success: false, 
        message: message || 'Failed to verify OTP'
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
