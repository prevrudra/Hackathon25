import { NextRequest, NextResponse } from 'next/server'
import { SecureUserManager } from '@/lib/secure-database'

export async function GET(request: NextRequest) {
  try {
    // Get session token from httpOnly cookie (not localStorage!)
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { valid: false, message: 'No session token found' },
        { status: 401 }
      )
    }
    
    // Validate session
    const validation = await SecureUserManager.validateSession(sessionToken)
    
    if (validation.valid) {
      return NextResponse.json({
        valid: true,
        user: validation.user
      })
    } else {
      // Clear invalid cookies
      const response = NextResponse.json(
        { valid: false, message: validation.error },
        { status: 401 }
      )
      
      response.cookies.delete('session_token')
      response.cookies.delete('refresh_token')
      
      return response
    }
    
  } catch (error) {
    console.error('Session validation error:', error)
    
    const response = NextResponse.json(
      { valid: false, message: 'Session validation failed' },
      { status: 500 }
    )
    
    // Clear cookies on error
    response.cookies.delete('session_token')
    response.cookies.delete('refresh_token')
    
    return response
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
