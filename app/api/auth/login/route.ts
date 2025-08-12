import { NextRequest, NextResponse } from 'next/server'

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    email: "owner1@quickcourt.com",
    fullName: "Rajesh Kumar",
    role: "facility_owner",
    isVerified: true,
    avatar: null
  },
  {
    id: "2",
    email: "owner2@quickcourt.com", 
    fullName: "Priya Sharma",
    role: "facility_owner",
    isVerified: true,
    avatar: null
  },
  {
    id: "3",
    email: "user@quickcourt.com",
    fullName: "Regular User",
    role: "user",
    isVerified: true,
    avatar: null
  },
  {
    id: "4",
    email: "admin@quickcourt.com",
    fullName: "Admin User",
    role: "admin",
    isVerified: true,
    avatar: null
  },
]

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

    // Find user by email
    const user = mockUsers.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // For demo purposes, accept any password for existing users
    // In a real app, you would verify the password hash here
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar
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
