import nodemailer from 'nodemailer'

// Create Gmail transporter
const gmailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'cronixglobal@gmail.com',
    pass: process.env.SMTP_PASS || 'Hanuop#143'
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
          .logo { 
            text-align: center; 
            margin-bottom: 32px; 
          }
          .logo h1 { 
            color: #2563eb; 
            font-size: 28px; 
            margin: 0; 
            font-weight: bold;
          }
          .title { 
            color: #1e293b; 
            font-size: 24px; 
            font-weight: bold; 
            text-align: center; 
            margin-bottom: 16px;
          }
          .subtitle { 
            color: #10b981; 
            text-align: center; 
            margin-bottom: 32px; 
            font-size: 16px;
          }
          .otp-container { 
            text-align: center; 
            margin: 32px 0; 
          }
          .otp { 
            font-size: 36px; 
            font-weight: bold; 
            letter-spacing: 8px; 
            color: #2563eb; 
            background: #f1f5f9; 
            padding: 16px 24px; 
            border-radius: 8px; 
            display: inline-block;
            border: 2px dashed #2563eb;
          }
          .message { 
            text-align: center; 
            color: #64748b; 
            margin: 24px 0; 
            font-size: 16px;
          }
          .footer { 
            text-align: center; 
            color: #94a3b8; 
            font-size: 14px; 
            margin-top: 32px; 
            padding-top: 24px; 
            border-top: 1px solid #e2e8f0;
          }
          .warning { 
            background: #fef3c7; 
            border: 1px solid #fbbf24; 
            color: #92400e; 
            padding: 12px; 
            border-radius: 6px; 
            text-align: center; 
            margin: 24px 0; 
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1>🏸 QUICKCOURT</h1>
          </div>
          
          <div class="title">🔐 VERIFY YOUR EMAIL</div>
          
          <div class="subtitle">
            We've sent a code to your email: <strong>${email}</strong>
          </div>
          
          <div class="otp-container">
            <div class="otp">${otp}</div>
          </div>
          
          <div class="message">
            ${userName ? `Hi ${userName},` : 'Hello!'}<br>
            Enter this 6-digit code in the QuickCourt app to verify your email address.
          </div>
          
          <div class="warning">
            ⚠️ This code will expire in 10 minutes. Don't share it with anyone.
          </div>
          
          <div class="footer">
            <p>This email was sent by QuickCourt</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      QuickCourt - Email Verification
      
      Your verification code is: ${otp}
      
      ${userName ? `Hi ${userName},` : 'Hello!'}
      Enter this 6-digit code in the QuickCourt app to verify your email address.
      
      This code will expire in 10 minutes. Don't share it with anyone.
      
      If you didn't request this code, please ignore this email.
    `
  }

  // Try Gmail first
  try {
    await gmailTransporter.sendMail(mailOptions)
    console.log('OTP email sent successfully via Gmail to:', email)
    return true
  } catch (gmailError) {
    console.log('Gmail failed, trying Mailtrap fallback:', gmailError)
    
    // Fallback to Mailtrap
    try {
      const mailtrapOptions = {
        ...mailOptions,
        from: '"QuickCourt" <noreply@quickcourt.com>' // Use generic sender for Mailtrap
      }
      await mailtrapTransporter.sendMail(mailtrapOptions)
      console.log('OTP email sent successfully via Mailtrap to:', email)
      return true
    } catch (mailtrapError) {
      console.error('Both Gmail and Mailtrap failed:', mailtrapError)
      return false
    }
  }
}

// Verify email transporter configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    // Try Gmail first
    await gmailTransporter.verify()
    console.log('Gmail transporter is ready')
    return true
  } catch (gmailError) {
    console.log('Gmail verification failed, checking Mailtrap:', gmailError)
    try {
      await mailtrapTransporter.verify()
      console.log('Mailtrap transporter is ready')
      return true
    } catch (mailtrapError) {
      console.error('Both email transporters failed:', mailtrapError)
      return false
    }
  }
}
