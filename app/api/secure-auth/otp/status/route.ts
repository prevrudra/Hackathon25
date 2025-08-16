import { NextRequest, NextResponse } from 'next/server'
import { SecureUserManager } from '@/lib/secure-database'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
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
    
    // Check rate limit status
    const rateLimitStatus = SecureUserManager.checkOTPRateLimit(email)
    
    return NextResponse.json({
      success: true,
      canRequest: rateLimitStatus.canRequest,
      timeLeft: rateLimitStatus.timeLeft,
      message: rateLimitStatus.message
    })
    
  } catch (error) {
    console.error('OTP status check error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check OTP status'
      },
      { status: 500 }
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
