import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import path from 'path'

// Secure database configuration - now using main database for consistency
const DB_PATH = path.join(process.cwd(), 'data', 'quickcourt.db')
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex')
const JWT_EXPIRES_IN = '24h'
const REFRESH_TOKEN_EXPIRES_IN = '7d'

// Initialize database connection
let db: Database.Database | null = null

function getDatabase(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const fs = require('fs')
    const dataDir = path.dirname(DB_PATH)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initializeDatabase()
  }
  return db
}

// Initialize secure database schema
function initializeDatabase() {
  const database = getDatabase()
  
  // Users table with enhanced security
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'facility_owner', 'admin')),
      phone TEXT,
      avatar_url TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      email_verification_token TEXT,
      email_verification_expires DATETIME,
      password_reset_token TEXT,
      password_reset_expires DATETIME,
      failed_login_attempts INTEGER DEFAULT 0,
      locked_until DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Secure sessions table (no localStorage dependency)
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_token TEXT UNIQUE NOT NULL,
      refresh_token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      refresh_expires_at DATETIME NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)
  
  // OTP verification table
  database.exec(`
    CREATE TABLE IF NOT EXISTS otp_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      email TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      otp_type TEXT NOT NULL CHECK (otp_type IN ('email_verification', 'password_reset', 'login_verification')),
      expires_at DATETIME NOT NULL,
      is_used BOOLEAN DEFAULT FALSE,
      attempts INTEGER DEFAULT 0,
      max_attempts INTEGER DEFAULT 3,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)

  // OTP rate limiting table
  database.exec(`
    CREATE TABLE IF NOT EXISTS otp_rate_limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      last_sent_at DATETIME NOT NULL,
      attempts_count INTEGER DEFAULT 1,
      reset_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Security audit log
  database.exec(`
    CREATE TABLE IF NOT EXISTS security_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      success BOOLEAN NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    )
  `)
  
  console.log('✅ Secure database schema initialized')
}

// User management functions
export class SecureUserManager {
  
  // Create new user with secure password hashing
  static async createUser(userData: {
    email: string
    password: string
    fullName: string
    role: 'user' | 'facility_owner' | 'admin'
    phone?: string
  }) {
    const database = getDatabase()
    
    try {
      // Check if user already exists
      const existingUser = database.prepare('SELECT id FROM users WHERE email = ?').get(userData.email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
      
      // Hash password with optimized cost factor for speed
      const passwordHash = await bcrypt.hash(userData.password, 8)
      
      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex')
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      
      // Insert user
      const insertUser = database.prepare(`
        INSERT INTO users (
          email, password_hash, full_name, role, phone, 
          email_verification_token, email_verification_expires
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      
      const result = insertUser.run(
        userData.email,
        passwordHash,
        userData.fullName,
        userData.role,
        userData.phone || null,
        verificationToken,
        verificationExpires.toISOString()
      )
      
      // Log security event
      this.logSecurityEvent(result.lastInsertRowid as number, 'USER_CREATED', null, null, true, 'New user account created')
      
      return {
        success: true,
        userId: result.lastInsertRowid,
        verificationToken,
        message: 'User created successfully'
      }
      
    } catch (error) {
      console.error('User creation error:', error)
      this.logSecurityEvent(null, 'USER_CREATION_FAILED', null, null, false, (error as Error).message)
      throw error
    }
  }
  
  // Secure login with session management
  static async authenticateUser(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const database = getDatabase()
    
    try {
      // Get user with security info
      const user = database.prepare(`
        SELECT id, email, password_hash, full_name, role, is_verified, is_active,
               failed_login_attempts, locked_until
        FROM users 
        WHERE email = ?
      `).get(email) as any
      
      if (!user) {
        this.logSecurityEvent(null, 'LOGIN_FAILED', ipAddress, userAgent, false, 'User not found')
        throw new Error('Invalid credentials')
      }
      
      // Check if account is locked
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        this.logSecurityEvent(user.id, 'LOGIN_BLOCKED', ipAddress, userAgent, false, 'Account locked')
        throw new Error('Account is temporarily locked due to too many failed attempts')
      }
      
      // Check if account is active
      if (!user.is_active) {
        this.logSecurityEvent(user.id, 'LOGIN_BLOCKED', ipAddress, userAgent, false, 'Account inactive')
        throw new Error('Account is deactivated')
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      
      if (!isValidPassword) {
        // Increment failed attempts
        const newFailedAttempts = user.failed_login_attempts + 1
        let lockUntil = null
        
        // Lock account after 5 failed attempts for 30 minutes
        if (newFailedAttempts >= 5) {
          lockUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString()
        }
        
        database.prepare(`
          UPDATE users 
          SET failed_login_attempts = ?, locked_until = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(newFailedAttempts, lockUntil, user.id)
        
        this.logSecurityEvent(user.id, 'LOGIN_FAILED', ipAddress, userAgent, false, 'Invalid password')
        throw new Error('Invalid credentials')
      }
      
      // Reset failed attempts on successful login
      database.prepare(`
        UPDATE users 
        SET failed_login_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(user.id)
      
      // Create secure session
      const sessionData = await this.createSession(user.id, ipAddress, userAgent)
      
      this.logSecurityEvent(user.id, 'LOGIN_SUCCESS', ipAddress, userAgent, true, 'User logged in successfully')
      
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          isVerified: !!user.is_verified
        },
        sessionToken: sessionData.sessionToken,
        refreshToken: sessionData.refreshToken,
        expiresAt: sessionData.expiresAt
      }
      
    } catch (error) {
      console.error('Authentication error:', error)
      throw error
    }
  }
  
  // Create secure session (replaces localStorage)
  static async createSession(userId: number, ipAddress?: string, userAgent?: string) {
    const database = getDatabase()
    
    // Generate secure tokens
    const sessionToken = jwt.sign({ userId, type: 'session' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    const refreshToken = jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })
    
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    
    // Store session in database
    const insertSession = database.prepare(`
      INSERT INTO user_sessions (
        user_id, session_token, refresh_token, expires_at, refresh_expires_at,
        ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    insertSession.run(
      userId,
      sessionToken,
      refreshToken,
      expiresAt.toISOString(),
      refreshExpiresAt.toISOString(),
      ipAddress || null,
      userAgent || null
    )
    
    return {
      sessionToken,
      refreshToken,
      expiresAt: expiresAt.toISOString()
    }
  }
  
  // Validate session token (replaces localStorage validation)
  static async validateSession(sessionToken: string) {
    const database = getDatabase()
    
    try {
      // Verify JWT token
      const decoded = jwt.verify(sessionToken, JWT_SECRET) as any
      
      if (decoded.type !== 'session') {
        throw new Error('Invalid token type')
      }
      
      // Check session in database
      const session = database.prepare(`
        SELECT s.*, u.email, u.full_name, u.role, u.is_verified, u.is_active
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = ? AND s.is_active = 1 AND s.expires_at > datetime('now')
      `).get(sessionToken) as any
      
      if (!session || !session.is_active) {
        throw new Error('Invalid or expired session')
      }
      
      return {
        valid: true,
        user: {
          id: session.user_id,
          email: session.email,
          fullName: session.full_name,
          role: session.role,
          isVerified: !!session.is_verified
        }
      }
      
    } catch (error) {
      return { valid: false, error: (error as Error).message }
    }
  }
  
  // Logout and invalidate session
  static async logout(sessionToken: string) {
    const database = getDatabase()
    
    try {
      // Invalidate session
      database.prepare(`
        UPDATE user_sessions 
        SET is_active = 0 
        WHERE session_token = ?
      `).run(sessionToken)
      
      const decoded = jwt.verify(sessionToken, JWT_SECRET) as any
      this.logSecurityEvent(decoded.userId, 'LOGOUT', null, null, true, 'User logged out')
      
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }
  
  // OTP Management Functions

  // Generate and send OTP
  static async generateOTP(email: string, otpType: 'email_verification' | 'password_reset' | 'login_verification') {
    const database = getDatabase()

    try {
      // Check rate limiting (5 seconds for faster development)
      const rateLimitCheck = database.prepare(`
        SELECT * FROM otp_rate_limits
        WHERE email = ? AND datetime('now') < datetime(last_sent_at, '+5 seconds')
      `).get(email)

      if (rateLimitCheck) {
        const timeLeft = Math.ceil((new Date(rateLimitCheck.last_sent_at).getTime() + 5000 - Date.now()) / 1000)
        throw new Error(`Please wait ${timeLeft} seconds before requesting another OTP`)
      }

      // Get user
      const user = database.prepare('SELECT id FROM users WHERE email = ?').get(email)
      if (!user) {
        throw new Error('User not found')
      }

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Invalidate previous OTPs for this user and type
      database.prepare(`
        UPDATE otp_verifications
        SET is_used = 1
        WHERE user_id = ? AND otp_type = ? AND is_used = 0
      `).run(user.id, otpType)

      // Insert new OTP
      database.prepare(`
        INSERT INTO otp_verifications (user_id, email, otp_code, otp_type, expires_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(user.id, email, otpCode, otpType, expiresAt.toISOString())

      // Update rate limiting
      database.prepare(`
        INSERT OR REPLACE INTO otp_rate_limits (email, last_sent_at, reset_at)
        VALUES (?, datetime('now'), datetime('now', '+1 hour'))
      `).run(email)

      // Log security event
      this.logSecurityEvent(user.id, 'OTP_GENERATED', null, null, true, `OTP generated for ${otpType}`)

      // Send OTP via email
      try {
        // Import nodemailer directly
        const nodemailer = await import('nodemailer')

        const transporter = nodemailer.default.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
        })

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>QuickCourt Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="background-color: #16a34a; color: white; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 20px;">🔒</div>
                    <h1 style="color: #1f2937; margin: 0;">QuickCourt</h1>
                    <p style="color: #6b7280; margin: 10px 0 0 0;">Secure Court Booking Platform</p>
                </div>
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email Address</h2>
                    <p style="color: #4b5563; margin-bottom: 30px;">Please use the following 6-digit verification code:</p>
                    <div style="background-color: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 12px; padding: 30px; margin: 30px 0; display: inline-block;">
                        <div style="font-size: 36px; font-weight: bold; color: #1f2937; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otpCode}</div>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
                </div>
                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="color: #92400e; margin: 0 0 10px 0;">🛡️ Security Notice</h3>
                    <p style="color: #92400e; margin: 0; font-size: 14px;">Never share this code with anyone. QuickCourt will never ask for your verification code.</p>
                </div>
                <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 30px;">
                    <p style="color: #9ca3af; font-size: 14px; margin: 0;">© 2024 QuickCourt. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `

        const info = await transporter.sendMail({
          from: `"QuickCourt Security" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: '🔐 QuickCourt - Verify Your Email Address',
          html: htmlContent
        })

        console.log(`📧 Email sent successfully to ${email}: ${otpCode} (Message ID: ${info.messageId})`)
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError)
        // Fallback: log the OTP for development
        console.log(`📧 OTP for ${email}: ${otpCode} (expires in 10 minutes) - EMAIL FAILED`)
      }

      return {
        success: true,
        message: 'OTP sent successfully to your email',
        otpCode: process.env.NODE_ENV === 'development' ? otpCode : undefined // Only show in dev
      }

    } catch (error) {
      this.logSecurityEvent(null, 'OTP_GENERATION_FAILED', null, null, false, (error as Error).message)
      throw error
    }
  }

  // Verify OTP
  static async verifyOTP(email: string, otpCode: string, otpType: 'email_verification' | 'password_reset' | 'login_verification') {
    const database = getDatabase()

    try {
      // Get OTP record
      const otpRecord = database.prepare(`
        SELECT * FROM otp_verifications
        WHERE email = ? AND otp_code = ? AND otp_type = ? AND is_used = 0 AND datetime('now') < expires_at
        ORDER BY created_at DESC LIMIT 1
      `).get(email, otpCode, otpType) as any

      if (!otpRecord) {
        // Increment failed attempts for existing OTP
        database.prepare(`
          UPDATE otp_verifications
          SET attempts = attempts + 1
          WHERE email = ? AND otp_type = ? AND is_used = 0
        `).run(email, otpType)

        this.logSecurityEvent(null, 'OTP_VERIFICATION_FAILED', null, null, false, 'Invalid or expired OTP')
        throw new Error('Invalid or expired OTP code')
      }

      // Check max attempts
      if (otpRecord.attempts >= otpRecord.max_attempts) {
        database.prepare(`
          UPDATE otp_verifications
          SET is_used = 1
          WHERE id = ?
        `).run(otpRecord.id)

        this.logSecurityEvent(otpRecord.user_id, 'OTP_MAX_ATTEMPTS', null, null, false, 'OTP max attempts exceeded')
        throw new Error('OTP has been disabled due to too many failed attempts')
      }

      // Mark OTP as used
      database.prepare(`
        UPDATE otp_verifications
        SET is_used = 1
        WHERE id = ?
      `).run(otpRecord.id)

      // If email verification, mark user as verified
      if (otpType === 'email_verification') {
        database.prepare(`
          UPDATE users
          SET is_verified = 1, email_verification_token = NULL, email_verification_expires = NULL
          WHERE id = ?
        `).run(otpRecord.user_id)
      }

      this.logSecurityEvent(otpRecord.user_id, 'OTP_VERIFIED', null, null, true, `OTP verified for ${otpType}`)

      return {
        success: true,
        message: 'OTP verified successfully',
        userId: otpRecord.user_id
      }

    } catch (error) {
      throw error
    }
  }

  // Check OTP rate limit status
  static checkOTPRateLimit(email: string) {
    const database = getDatabase()

    const rateLimit = database.prepare(`
      SELECT * FROM otp_rate_limits
      WHERE email = ? AND datetime('now') < datetime(last_sent_at, '+30 seconds')
    `).get(email) as any

    if (rateLimit) {
      const timeLeft = Math.ceil((new Date(rateLimit.last_sent_at).getTime() + 30000 - Date.now()) / 1000)
      return {
        canRequest: false,
        timeLeft,
        message: `Please wait ${timeLeft} seconds before requesting another OTP`
      }
    }

    return {
      canRequest: true,
      timeLeft: 0,
      message: 'You can request an OTP now'
    }
  }

  // Security audit logging
  static logSecurityEvent(
    userId: number | null,
    action: string,
    ipAddress: string | null,
    userAgent: string | null,
    success: boolean,
    details: string
  ) {
    // Skip security logging in development for faster performance
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔒 Security Event: ${action} - ${success ? 'SUCCESS' : 'FAILED'} - ${details}`)
      return
    }

    const database = getDatabase()
    database.prepare(`
      INSERT INTO security_audit (user_id, action, ip_address, user_agent, success, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, action, ipAddress, userAgent, success ? 1 : 0, details)
  }
}

// Initialize database on module load
getDatabase()

export default SecureUserManager
