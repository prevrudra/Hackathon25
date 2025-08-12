import { NextRequest, NextResponse } from "next/server";

// In-memory store for OTPs (for demo; use DB in production)
const otpStore: Record<string, string> = {};

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  if (!email || !otp) {
    return NextResponse.json({ success: false, message: "Missing email or OTP" }, { status: 400 });
  }

  // For demo, accept any 6-digit OTP
  if (otp.length === 6 && /^[0-9]{6}$/.test(otp)) {
    // Mark user as verified (mock)
    return NextResponse.json({ success: true, message: "Email verified successfully!", user: {
      id: Date.now().toString(),
      email,
      fullName: "Demo User",
      role: "user",
      isVerified: true,
    }});
  }

  return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
}
