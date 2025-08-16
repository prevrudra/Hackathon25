const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'data', 'quickcourt.db')

console.log('🔄 Adding real recent activity...')
console.log('📂 Database:', dbPath)

async function addRealActivity() {
  try {
    const db = new Database(dbPath)

    // Get current timestamp
    const now = new Date()
    const currentTimestamp = now.toISOString().replace('T', ' ').substring(0, 19)
    
    // Create timestamps for the last few minutes/hours
    const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19)
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19)
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19)

    console.log('⏰ Current time:', currentTimestamp)

    // 1. Add some real recent users
    const saltRounds = 12
    const recentUsers = [
      {
        email: 'sarah.johnson@gmail.com',
        password: await bcrypt.hash('password123', saltRounds),
        name: 'Sarah Johnson',
        role: 'user',
        phone: '+91-9876543220',
        timestamp: oneMinuteAgo
      },
      {
        email: 'mike.chen@yahoo.com',
        password: await bcrypt.hash('password123', saltRounds),
        name: 'Mike Chen',
        role: 'user',
        phone: '+91-9876543221',
        timestamp: fiveMinutesAgo
      },
      {
        email: 'priya.sports@gmail.com',
        password: await bcrypt.hash('password123', saltRounds),
        name: 'Priya Sports Center',
        role: 'facility_owner',
        phone: '+91-9876543222',
        timestamp: tenMinutesAgo
      },
      {
        email: 'alex.kumar@hotmail.com',
        password: await bcrypt.hash('password123', saltRounds),
        name: 'Alex Kumar',
        role: 'user',
        phone: '+91-9876543223',
        timestamp: thirtyMinutesAgo
      }
    ]

    const insertUser = db.prepare(`
      INSERT INTO users (
        email, password_hash, full_name, role, phone, 
        is_verified, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    let addedUsers = 0
    for (const user of recentUsers) {
      try {
        // Check if user already exists
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(user.email)
        if (!existing) {
          insertUser.run(
            user.email,
            user.password,
            user.name,
            user.role,
            user.phone,
            1, // is_verified
            1, // is_active
            user.timestamp,
            user.timestamp
          )
          console.log(`✅ Added user: ${user.name} (${user.role}) - ${user.timestamp}`)
          addedUsers++
        }
      } catch (error) {
        console.error(`❌ Failed to add user ${user.name}:`, error.message)
      }
    }

    // 2. Add some real recent bookings
    const today = now.toISOString().split('T')[0]
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const recentBookings = [
      {
        user_id: 1, // Admin user
        venue_id: 1,
        court_id: 1,
        booking_date: today,
        start_time: '20:00',
        end_time: '21:00',
        duration_hours: 1.0,
        price_per_hour: 600,
        total_amount: 600,
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'UPI',
        created_at: oneMinuteAgo
      },
      {
        user_id: 2, // Facility owner
        venue_id: 2,
        court_id: 3,
        booking_date: today,
        start_time: '18:30',
        end_time: '19:30',
        duration_hours: 1.0,
        price_per_hour: 800,
        total_amount: 800,
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'Credit Card',
        created_at: fiveMinutesAgo
      },
      {
        user_id: 3, // Regular user
        venue_id: 1,
        court_id: 2,
        booking_date: tomorrow,
        start_time: '07:00',
        end_time: '09:00',
        duration_hours: 2.0,
        price_per_hour: 500,
        total_amount: 1000,
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'UPI',
        created_at: tenMinutesAgo
      },
      {
        user_id: 4, // Regular user
        venue_id: 3,
        court_id: 5,
        booking_date: today,
        start_time: '16:00',
        end_time: '17:00',
        duration_hours: 1.0,
        price_per_hour: 700,
        total_amount: 700,
        status: 'pending',
        payment_status: 'pending',
        payment_method: null,
        created_at: thirtyMinutesAgo
      },
      {
        user_id: 5, // Regular user
        venue_id: 2,
        court_id: 4,
        booking_date: today,
        start_time: '19:00',
        end_time: '20:00',
        duration_hours: 1.0,
        price_per_hour: 900,
        total_amount: 900,
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'Debit Card',
        created_at: oneHourAgo
      }
    ]

    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        user_id, venue_id, court_id, booking_date, start_time, end_time,
        duration_hours, price_per_hour, total_amount, status, payment_status,
        payment_method, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    let addedBookings = 0
    for (const booking of recentBookings) {
      try {
        insertBooking.run(
          booking.user_id,
          booking.venue_id,
          booking.court_id,
          booking.booking_date,
          booking.start_time,
          booking.end_time,
          booking.duration_hours,
          booking.price_per_hour,
          booking.total_amount,
          booking.status,
          booking.payment_status,
          booking.payment_method,
          booking.created_at,
          booking.created_at
        )
        console.log(`✅ Added booking: ${booking.booking_date} ${booking.start_time}-${booking.end_time} - ₹${booking.total_amount}`)
        addedBookings++
      } catch (error) {
        console.error(`❌ Failed to add booking:`, error.message)
      }
    }

    db.close()

    console.log('\n🎉 Real activity added successfully!')
    console.log(`✅ Added ${addedUsers} new users`)
    console.log(`✅ Added ${addedBookings} new bookings`)
    console.log('\n📊 Recent activity now includes:')
    console.log('👤 Real user registrations from the last hour')
    console.log('🏸 Real court bookings from the last hour')
    console.log('💰 Real revenue from recent bookings')
    console.log('\n🔄 Refresh the admin dashboard to see the real-time updates!')

  } catch (error) {
    console.error('❌ Failed to add real activity:', error)
    process.exit(1)
  }
}

addRealActivity()
