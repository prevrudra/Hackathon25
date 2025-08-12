import nodemailer from 'nodemailer'

// Create Gmail transporter
const gmailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER || 'cronixglobal@gmail.com',
    pass: process.env.GMAIL_PASS || 'yuxccskftnmpqtub'
  },
  tls: {
    rejectUnauthorized: false
  }
})

// Create Mailtrap fallback transporter
const mailtrapTransporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  secure: false,
  auth: {
    user: '1520f01a8064d7',
    pass: '1539cdfc220647'
  },
  tls: {
    rejectUnauthorized: false
  }
})

// Use Gmail as primary, fallback to Mailtrap
export const emailTransporter = gmailTransporter

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, userName: string, token: string): Promise<boolean> {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  const mailOptions = {
    from: 'QuickCourt <cronixglobal@gmail.com>',
    to: email,
    subject: '🔑 QuickCourt Password Reset Request',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h1 style="color: #2563eb; font-size: 28px; font-weight: bold; text-align: center;">🏸 QUICKCOURT</h1>
        <h2 style="color: #1e293b; font-size: 22px; font-weight: bold; text-align: center; margin-bottom: 16px;">Password Reset Request</h2>
        <p style="color: #64748b; font-size: 16px; text-align: center;">Hi ${userName},</p>
        <p style="color: #64748b; font-size: 16px; text-align: center;">We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: #fff; font-weight: bold; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 18px;">Reset Password</a>
        </div>
        <p style="color: #92400e; background: #fef3c7; border: 1px solid #fbbf24; padding: 12px; border-radius: 6px; text-align: center; font-size: 14px;">This link will expire in 30 minutes. If you did not request a password reset, please ignore this email.</p>
        <div style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">This email was sent by QuickCourt</div>
      </div>
    `,
    text: `Hi ${userName},\n\nWe received a request to reset your password. Use the link below to set a new password:\n${resetUrl}\n\nThis link will expire in 30 minutes. If you did not request a password reset, please ignore this email.\n\nQuickCourt Team`
  };
  
  console.log('Attempting to send password reset email to:', email);
  
  try {
    await gmailTransporter.sendMail(mailOptions);
    console.log('Password reset email sent via Gmail to:', email);
    return true;
  } catch (gmailError) {
    console.log('Gmail failed, trying Mailtrap fallback:', gmailError);
    try {
      const mailtrapOptions = { ...mailOptions, from: 'QuickCourt <noreply@quickcourt.com>' };
      await mailtrapTransporter.sendMail(mailtrapOptions);
      console.log('Password reset email sent via Mailtrap to:', email);
      return true;
    } catch (mailtrapError) {
      console.error('Both Gmail and Mailtrap failed:', mailtrapError);
      return false;
    }
  }
}

// Send OTP email with fallback system
export async function sendOTPEmail(email: string, otp: string, userName?: string): Promise<boolean> {
  const mailOptions = {
    from: '"QuickCourt" <cronixglobal@gmail.com>',
    to: email,
    subject: '🔐 Your QuickCourt Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QuickCourt - Email Verification</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f8fafc;
          }
          .container { 
            background: white; 
            border-radius: 12px; 
            padding: 32px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            text-align: center; 
            margin-bottom: 32px; 
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 8px;
          }
          .title { 
            font-size: 22px; 
            font-weight: bold; 
            color: #1e293b; 
            margin-bottom: 16px;
          }
          .otp-code { 
            background: #f1f5f9; 
            border: 2px solid #2563eb; 
            border-radius: 8px; 
            padding: 20px; 
            text-align: center; 
            margin: 24px 0; 
          }
          .otp-number { 
            font-size: 36px; 
            font-weight: bold; 
            color: #2563eb; 
            letter-spacing: 8px; 
            font-family: 'Courier New', monospace;
          }
          .message { 
            color: #64748b; 
            font-size: 16px; 
            text-align: center; 
            margin: 16px 0; 
          }
          .warning { 
            background: #fef3c7; 
            border: 1px solid #fbbf24; 
            border-radius: 6px; 
            padding: 12px; 
            color: #92400e; 
            font-size: 14px; 
            text-align: center; 
            margin: 20px 0; 
          }
          .footer { 
            text-align: center; 
            color: #94a3b8; 
            font-size: 14px; 
            margin-top: 32px; 
            padding-top: 24px; 
            border-top: 1px solid #e2e8f0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏸 QUICKCOURT</div>
            <div class="title">Email Verification</div>
          </div>
          
          <p class="message">Hi ${userName || 'there'}! 👋</p>
          <p class="message">Please use the verification code below to complete your registration:</p>
          
          <div class="otp-code">
            <div class="otp-number">${otp}</div>
          </div>
          
          <p class="message">Enter this code in the verification screen to continue.</p>
          
          <div class="warning">
            ⚠️ This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
          </div>
          
          <div class="footer">
            This email was sent by QuickCourt<br>
            Your trusted sports booking platform
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${userName || 'there'}!\n\nYour QuickCourt verification code is: ${otp}\n\nThis code will expire in 10 minutes. If you didn't request this verification, please ignore this email.\n\nQuickCourt Team`
  };

  try {
    await gmailTransporter.sendMail(mailOptions);
    console.log('OTP email sent via Gmail to:', email);
    return true;
  } catch (gmailError) {
    console.log('Gmail failed, trying Mailtrap fallback:', gmailError);
    try {
      const mailtrapOptions = { ...mailOptions, from: '"QuickCourt" <noreply@quickcourt.com>' };
      await mailtrapTransporter.sendMail(mailtrapOptions);
      console.log('OTP email sent via Mailtrap to:', email);
      return true;
    } catch (mailtrapError) {
      console.error('Both Gmail and Mailtrap failed:', mailtrapError);
      return false;
    }
  }
}
