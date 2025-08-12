import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeQuerySingle } from '@/lib/sqlite-database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role, avatar } = await request.json();
    
    console.log('Signup request received for:', email);
    
    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ 
        success: false, 
        message: 'All fields are required' 
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = executeQuerySingle(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User with this email already exists' 
      }, { status: 400 });
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create user in database
      const result = executeQuery(
        'INSERT INTO users (email, password_hash, full_name, role, is_verified, is_active) VALUES (?, ?, ?, ?, 1, 1)',
        [email, passwordHash, fullName, role]
      );

    console.log('User created successfully:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Account created successfully! Please verify your email.',
      userId: result[0].lastInsertRowid
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
