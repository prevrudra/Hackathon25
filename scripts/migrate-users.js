const Database = require('better-sqlite3')
const path = require('path')

// Database paths
const secureDbPath = path.join(__dirname, '..', 'data', 'secure-quickcourt.db')
const mainDbPath = path.join(__dirname, '..', 'data', 'quickcourt.db')

console.log('🔄 Starting user migration...')
console.log('📂 Secure DB:', secureDbPath)
console.log('📂 Main DB:', mainDbPath)

try {
  // Connect to both databases
  const secureDb = new Database(secureDbPath)
  const mainDb = new Database(mainDbPath)

  console.log('✅ Connected to both databases')

  // Get all users from secure database
  const secureUsers = secureDb.prepare(`
    SELECT id, email, password_hash, full_name, role, is_verified, is_active, created_at, updated_at
    FROM users
    ORDER BY id
  `).all()

  console.log(`📊 Found ${secureUsers.length} users in secure database`)

  // Get existing users in main database to avoid duplicates
  const existingEmails = new Set(
    mainDb.prepare('SELECT email FROM users').all().map(u => u.email)
  )

  console.log(`📊 Found ${existingEmails.size} existing users in main database`)

  // Prepare insert statement for main database
  const insertUser = mainDb.prepare(`
    INSERT INTO users (email, password_hash, full_name, role, is_verified, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  let migratedCount = 0
  let skippedCount = 0

  // Migrate users
  for (const user of secureUsers) {
    if (existingEmails.has(user.email)) {
      console.log(`⏭️  Skipping ${user.email} (already exists)`)
      skippedCount++
      continue
    }

    try {
      insertUser.run(
        user.email,
        user.password_hash,
        user.full_name,
        user.role,
        user.is_verified || 0,
        user.is_active || 1,
        user.created_at,
        user.updated_at
      )
      
      console.log(`✅ Migrated: ${user.email} (${user.role})`)
      migratedCount++
    } catch (error) {
      console.error(`❌ Failed to migrate ${user.email}:`, error.message)
    }
  }

  // Also migrate OTP verifications if needed
  console.log('\n🔄 Migrating OTP verifications...')
  
  // Check if OTP table exists in main database
  const otpTableExists = mainDb.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='otp_verifications'
  `).get()

  if (!otpTableExists) {
    console.log('📝 Creating OTP verifications table in main database...')
    mainDb.exec(`
      CREATE TABLE otp_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        otp_code TEXT NOT NULL,
        otp_type TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        is_used BOOLEAN DEFAULT 0,
        attempts INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  // Get active OTP verifications from secure database
  const secureOtps = secureDb.prepare(`
    SELECT email, otp_code, otp_type, expires_at, is_used, attempts, created_at, updated_at
    FROM otp_verifications
    WHERE expires_at > DATETIME('now') AND is_used = 0
  `).all()

  console.log(`📊 Found ${secureOtps.length} active OTP verifications`)

  if (secureOtps.length > 0) {
    const insertOtp = mainDb.prepare(`
      INSERT INTO otp_verifications (email, otp_code, otp_type, expires_at, is_used, attempts, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    for (const otp of secureOtps) {
      try {
        insertOtp.run(
          otp.email,
          otp.otp_code,
          otp.type,
          otp.expires_at,
          otp.is_used || 0,
          otp.attempts || 0,
          otp.created_at,
          otp.updated_at
        )
        console.log(`✅ Migrated OTP for: ${otp.email}`)
      } catch (error) {
        console.error(`❌ Failed to migrate OTP for ${otp.email}:`, error.message)
      }
    }
  }

  // Close databases
  secureDb.close()
  mainDb.close()

  console.log('\n🎉 Migration completed!')
  console.log(`✅ Migrated: ${migratedCount} users`)
  console.log(`⏭️  Skipped: ${skippedCount} users (already existed)`)
  console.log(`📧 Migrated: ${secureOtps.length} OTP verifications`)

} catch (error) {
  console.error('❌ Migration failed:', error)
  process.exit(1)
}
