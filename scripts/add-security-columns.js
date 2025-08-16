const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'data', 'quickcourt.db')

console.log('🔄 Adding security columns to users table...')
console.log('📂 Database:', dbPath)

try {
  const db = new Database(dbPath)

  // Check if columns already exist
  const tableInfo = db.prepare("PRAGMA table_info(users)").all()
  const existingColumns = new Set(tableInfo.map(col => col.name))

  console.log('📊 Existing columns:', existingColumns)

  const columnsToAdd = [
    { name: 'failed_login_attempts', type: 'INTEGER DEFAULT 0' },
    { name: 'locked_until', type: 'DATETIME' },
    { name: 'email_verification_token', type: 'TEXT' },
    { name: 'email_verification_expires', type: 'DATETIME' },
    { name: 'password_reset_token', type: 'TEXT' },
    { name: 'password_reset_expires', type: 'DATETIME' },
    { name: 'last_login_at', type: 'DATETIME' },
    { name: 'last_login_ip', type: 'TEXT' }
  ]

  let addedCount = 0

  for (const column of columnsToAdd) {
    if (!existingColumns.has(column.name)) {
      try {
        const sql = `ALTER TABLE users ADD COLUMN ${column.name} ${column.type}`
        db.exec(sql)
        console.log(`✅ Added column: ${column.name}`)
        addedCount++
      } catch (error) {
        console.error(`❌ Failed to add column ${column.name}:`, error.message)
      }
    } else {
      console.log(`⏭️  Column ${column.name} already exists`)
    }
  }

  // Verify the updated schema
  console.log('\n📋 Updated table schema:')
  const updatedTableInfo = db.prepare("PRAGMA table_info(users)").all()
  updatedTableInfo.forEach(col => {
    console.log(`  - ${col.name}: ${col.type}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`)
  })

  db.close()

  console.log(`\n🎉 Migration completed! Added ${addedCount} new columns.`)

} catch (error) {
  console.error('❌ Migration failed:', error)
  process.exit(1)
}
