import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { executeQuery } from '@/lib/sqlite-database';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  executeQuery(
    'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)',
    [email, otp, expiresAt]
  );

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) {
    return NextResponse.json({ error: "Missing Gmail credentials" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: user,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
