import { NextRequest, NextResponse } from 'next/server'
import { executeQuerySingle } from '@/lib/sqlite-database'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email in the database
    const user = executeQuerySingle(
      'SELECT id, email, full_name, role, is_verified, avatar_url, password_hash FROM users WHERE email = ? AND is_active = 1',
      [email]
    )

    console.log('User found:', user ? `${user.full_name} (${user.email})` : 'No user found');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password hash
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Login successful for:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id.toString(),
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isVerified: !!user.is_verified,
        avatar: user.avatar_url || null
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
