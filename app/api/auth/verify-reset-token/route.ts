import { NextRequest, NextResponse } from 'next/server'
import { getTokenInfo } from '@/lib/password-reset'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      )
    }

    // Check token validity without consuming it
    const tokenInfo = getTokenInfo(token)
    
    if (!tokenInfo.valid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      email: tokenInfo.email,
      expiresAt: tokenInfo.expiresAt
    })

  } catch (error) {
    console.error('Verify token API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
