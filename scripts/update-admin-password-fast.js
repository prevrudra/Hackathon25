const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'data', 'quickcourt.db')

console.log('🚀 Updating admin password for faster login...')
console.log('📂 Database:', dbPath)

async function updateAdminPassword() {
  try {
    const db = new Database(dbPath)

    // Admin credentials
    const adminEmail = 'admin@quickcourt.com'
    const adminPassword = 'admin123'

    // Hash the password with faster salt rounds (8 instead of 14)
    const saltRounds = 8 // Much faster than 14
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds)

    // Update admin password
    const updateAdmin = db.prepare(`
      UPDATE users 
      SET password_hash = ?
      WHERE email = ?
    `)
    
    const result = updateAdmin.run(hashedPassword, adminEmail)
    
    if (result.changes > 0) {
      console.log(`✅ Updated admin password with faster hash`)
      console.log(`📧 Email: ${adminEmail}`)
      console.log(`🔑 Password: ${adminPassword}`)
      console.log(`⚡ Salt rounds: ${saltRounds} (much faster!)`)
    } else {
      console.log(`❌ Admin user not found`)
    }

    // Also update test user for faster login
    const testUserEmail = 'testuser@quickcourt.com'
    const testUserPassword = 'test123'
    const testUserHash = await bcrypt.hash(testUserPassword, saltRounds)

    const updateTestUser = db.prepare(`
      UPDATE users 
      SET password_hash = ?
      WHERE email = ?
    `)
    
    const testResult = updateTestUser.run(testUserHash, testUserEmail)
    
    if (testResult.changes > 0) {
      console.log(`✅ Updated test user password with faster hash`)
      console.log(`📧 Email: ${testUserEmail}`)
      console.log(`🔑 Password: ${testUserPassword}`)
    }

    db.close()

    console.log('\n🎉 Password optimization completed!')
    console.log('⚡ Login should now be much faster!')

  } catch (error) {
    console.error('❌ Failed to update passwords:', error)
    process.exit(1)
  }
}

updateAdminPassword()
