import { NextRequest, NextResponse } from 'next/server';
import { executeQuerySingle, executeQuery } from '@/lib/sqlite-database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ success: false, message: 'Token and new password are required.' }, { status: 400 });
    }

    // Find token in DB
    const tokenRow = executeQuerySingle(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0',
      [token]
    );
    if (!tokenRow) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 400 });
    }
    if (new Date(tokenRow.expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: 'Token has expired.' }, { status: 400 });
    }

    // Hash new password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Update user password
    executeQuery(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, tokenRow.user_id]
    );

    // Mark token as used
    executeQuery(
      'UPDATE password_reset_tokens SET used = 1 WHERE id = ?',
      [tokenRow.id]
    );

    return NextResponse.json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
