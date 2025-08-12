import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeQuerySingle } from '@/lib/sqlite-database';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    
    console.log('OTP verification request for:', email, 'with OTP:', otp);
    
    if (!email || !otp) {
      return NextResponse.json({ 
        success: false, 
        message: "Email and OTP are required" 
      }, { status: 400 });
    }

    // For demo purposes, accept any 6-digit OTP
    // In production, you would verify against stored OTP in database
    if (otp.length === 6 && /^[0-9]{6}$/.test(otp)) {
      // Find the user in database
      const user = executeQuerySingle(
        'SELECT id, email, full_name, role, avatar_url, is_verified FROM users WHERE email = ?',
        [email]
      );

      if (!user) {
        return NextResponse.json({ 
          success: false, 
          message: "User not found" 
        }, { status: 404 });
      }

      // Mark user as verified
      executeQuery(
        'UPDATE users SET is_verified = 1 WHERE email = ?',
        [email]
      );

      console.log('User verified successfully:', user.email);

      return NextResponse.json({ 
        success: true, 
        message: "Email verified successfully!", 
        user: {
          id: user.id.toString(),
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          isVerified: true,
          avatar: user.avatar_url
        }
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: "Invalid OTP" 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}
