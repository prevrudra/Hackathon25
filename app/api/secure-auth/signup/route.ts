import { NextRequest, NextResponse } from 'next/server'
import { SecureUserManager } from '@/lib/secure-database'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role, phone } = await request.json()
    
    // Validate input
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
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
    
    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }
    
    // Validate role
    const validRoles = ['user', 'facility_owner', 'admin']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role specified' },
        { status: 400 }
      )
    }
    
    // Create user
    const result = await SecureUserManager.createUser({
      email: email.toLowerCase().trim(),
      password,
      fullName: fullName.trim(),
      role,
      phone: phone?.trim()
    })
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for verification.',
      userId: result.userId
    })
    
  } catch (error) {
    console.error('Signup error:', error)
    
    const message = (error as Error).message
    const status = message.includes('already exists') ? 409 : 500
    
    return NextResponse.json(
      { 
        success: false, 
        message: message || 'Failed to create account'
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
