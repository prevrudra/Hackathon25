import { NextRequest, NextResponse } from 'next/server'
import { executeQuerySingle } from '@/lib/sqlite-database'

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

    // Find user by email in the database
    const user = executeQuerySingle(
      'SELECT id, email, full_name, role, is_verified, avatar, password_hash FROM users WHERE email = ? AND is_active = 1',
      [email]
    )

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // For demo: accept any password if user exists
    // TODO: Replace with real password hash check

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isVerified: !!user.is_verified,
        avatar: user.avatar || null
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
