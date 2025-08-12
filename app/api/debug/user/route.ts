import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/sqlite-database';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Get the specific user
    const user = executeQuery('SELECT * FROM users WHERE email = ?', ['kekomi1303@blaxion.com']);
    
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' });
    }
    
    const userData = user[0];
    
    // Test password
    const testPasswords = ['password123', 'kekomi1303@blaxion.com'];
    const results = testPasswords.map(pwd => ({
      password: pwd,
      matches: bcrypt.compareSync(pwd, userData.password_hash)
    }));
    
    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        is_verified: userData.is_verified,
        is_active: userData.is_active
      },
      passwordTests: results,
      passwordHash: userData.password_hash
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Internal server error' });
  }
}
