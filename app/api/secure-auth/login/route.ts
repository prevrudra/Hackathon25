import { NextRequest, NextResponse } from 'next/server'
import { SecureUserManager } from '@/lib/secure-database'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Get client info for security logging
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Authenticate user
    const result = await SecureUserManager.authenticateUser(
      email.toLowerCase().trim(),
      password,
      ipAddress,
      userAgent
    )
    
    if (result.success) {
      // Create secure response with httpOnly cookies
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: result.user,
        expiresAt: result.expiresAt
      })
      
      // Set secure httpOnly cookies (no localStorage!)
      response.cookies.set('session_token', result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      })
      
      response.cookies.set('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      })
      
      return response
    }
    
  } catch (error) {
    console.error('Login error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: (error as Error).message || 'Authentication failed'
      },
      { status: 401 }
    )
  }
}

// Handle preflight requests
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
