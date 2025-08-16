import { NextRequest, NextResponse } from 'next/server'
import { SecureUserManager } from '@/lib/secure-database'

export async function POST(request: NextRequest) {
  try {
    // Get session token from httpOnly cookie
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (sessionToken) {
      // Invalidate session in database
      await SecureUserManager.logout(sessionToken)
    }
    
    // Clear all auth cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
    
    response.cookies.delete('session_token')
    response.cookies.delete('refresh_token')
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    
    // Still clear cookies even if logout fails
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
    
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
