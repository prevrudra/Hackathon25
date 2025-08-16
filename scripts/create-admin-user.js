const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'data', 'quickcourt.db')

console.log('🔄 Creating admin user with proper password...')
console.log('📂 Database:', dbPath)

async function createAdminUser() {
  try {
    const db = new Database(dbPath)

    // Admin credentials
    const adminEmail = 'admin@quickcourt.com'
    const adminPassword = 'admin123' // Simple password for testing
    const adminName = 'Admin User'

    // Hash the password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds)

    // Check if admin already exists
    const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail)

    if (existingAdmin) {
      // Update existing admin with proper password
      const updateAdmin = db.prepare(`
        UPDATE users 
        SET password_hash = ?, is_verified = 1, is_active = 1, role = 'admin'
        WHERE email = ?
      `)
      updateAdmin.run(hashedPassword, adminEmail)
      console.log(`✅ Updated existing admin user: ${adminEmail}`)
    } else {
      // Create new admin user
      const insertAdmin = db.prepare(`
        INSERT INTO users (
          email, password_hash, full_name, role, phone, 
          is_verified, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      
      insertAdmin.run(
        adminEmail,
        hashedPassword,
        adminName,
        'admin',
        '+91-9999999999',
        1,
        1
      )
      console.log(`✅ Created new admin user: ${adminEmail}`)
    }

    // Also create a test user for dashboard testing
    const testUserEmail = 'testuser@quickcourt.com'
    const testUserPassword = 'test123'
    const testUserHash = await bcrypt.hash(testUserPassword, saltRounds)

    const existingTestUser = db.prepare('SELECT id FROM users WHERE email = ?').get(testUserEmail)

    if (!existingTestUser) {
      const insertTestUser = db.prepare(`
        INSERT INTO users (
          email, password_hash, full_name, role, phone, 
          is_verified, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      
      insertTestUser.run(
        testUserEmail,
        testUserHash,
        'Test User',
        'user',
        '+91-9876543210',
        1,
        1
      )
      console.log(`✅ Created test user: ${testUserEmail}`)
    }

    db.close()

    console.log('\n🎉 Admin user setup completed!')
    console.log('📧 Admin Login:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('\n📧 Test User Login:')
    console.log(`   Email: ${testUserEmail}`)
    console.log(`   Password: ${testUserPassword}`)

  } catch (error) {
    console.error('❌ Failed to create admin user:', error)
    process.exit(1)
  }
}

createAdminUser()
