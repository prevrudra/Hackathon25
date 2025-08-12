import Database from 'better-sqlite3'
import path from 'path'

let db: Database.Database | null = null

function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'quickcourt.db')
    
    // Ensure directory exists
    const fs = require('fs')
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    db = new Database(dbPath)
    console.log(`Connected to SQLite database at: ${dbPath}`)
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON')
  }
  return db
}

export function executeQuery(sql: string, params: any[] = []): any[] {
  try {
    const database = getDatabase()
    const stmt = database.prepare(sql)
    
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(params)
    } else {
      const result = stmt.run(params)
      return [{ changes: result.changes, lastInsertRowid: result.lastInsertRowid }]
    }
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export function executeQuerySingle(sql: string, params: any[] = []): any {
  const results = executeQuery(sql, params)
  return results[0] || null
}

export function initializeDatabase() {
  const database = getDatabase()
  
  // Create tables
  const createTables = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      avatar_url TEXT,
      role TEXT NOT NULL CHECK (role IN ('user', 'facility_owner', 'admin')),
      phone TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Venues table
    CREATE TABLE IF NOT EXISTS venues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      phone TEXT,
      email TEXT,
      owner_id INTEGER NOT NULL,
      latitude REAL,
      longitude REAL,
      amenities TEXT, -- JSON string
      images TEXT, -- JSON string
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
      approval_notes TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    -- Courts table
    CREATE TABLE IF NOT EXISTS courts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venue_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      sport_type TEXT NOT NULL,
      description TEXT,
      price_per_hour REAL NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (venue_id) REFERENCES venues(id)
    );

    -- Bookings table
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      court_id INTEGER NOT NULL,
      venue_id INTEGER NOT NULL,
      booking_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      duration_hours REAL NOT NULL,
      price_per_hour REAL NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
      payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
      payment_method TEXT,
      transaction_id TEXT,
      special_requests TEXT,
      cancellation_reason TEXT,
      cancelled_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (court_id) REFERENCES courts(id),
      FOREIGN KEY (venue_id) REFERENCES venues(id)
    );

    -- Reviews table
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      venue_id INTEGER NOT NULL,
      booking_id INTEGER,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title TEXT,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (venue_id) REFERENCES venues(id),
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );

    -- Time slots table
    CREATE TABLE IF NOT EXISTS time_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      court_id INTEGER NOT NULL,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      is_available BOOLEAN DEFAULT TRUE,
      price_override REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (court_id) REFERENCES courts(id)
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_venues_owner ON venues(owner_id);
    CREATE INDEX IF NOT EXISTS idx_courts_venue ON courts(venue_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_court ON bookings(court_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_venue ON bookings(venue_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
    CREATE INDEX IF NOT EXISTS idx_reviews_venue ON reviews(venue_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
  `

  // Execute each statement separately
  const statements = createTables.split(';').filter(stmt => stmt.trim())
  statements.forEach(statement => {
    if (statement.trim()) {
      try {
        database.exec(statement)
      } catch (error) {
        console.error('Error executing statement:', statement, error)
      }
    }
  })

  console.log('Database tables created successfully')
}

export function seedDatabase() {
  const database = getDatabase()
  
  // Check if data already exists
  const userCount = database.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
  if (userCount.count > 0) {
    console.log('Database already has data, skipping seed')
    return
  }

  console.log('Seeding database with sample data...')

  // Insert users
  const insertUser = database.prepare(`
    INSERT INTO users (email, password_hash, full_name, role, phone, is_verified, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  // Facility owners
  insertUser.run('owner1@quickcourt.com', 'hashed_password_1', 'Rajesh Kumar', 'facility_owner', '+91-9876543210', 1, 1)
  insertUser.run('owner2@quickcourt.com', 'hashed_password_2', 'Priya Sharma', 'facility_owner', '+91-9876543211', 1, 1)
  
  // Regular users
  insertUser.run('user1@example.com', 'hashed_password_3', 'Amit Singh', 'user', '+91-9876543212', 1, 1)
  insertUser.run('user2@example.com', 'hashed_password_4', 'Sneha Patel', 'user', '+91-9876543213', 1, 1)
  insertUser.run('user3@example.com', 'hashed_password_5', 'Rohit Verma', 'user', '+91-9876543214', 1, 1)

  // Insert venues
  const insertVenue = database.prepare(`
    INSERT INTO venues (name, description, address, city, state, pincode, phone, email, owner_id, latitude, longitude, amenities, images, status, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  insertVenue.run(
    'SportZone Arena',
    'Premium sports facility with multiple courts and modern amenities',
    '123 Sports Complex, MG Road',
    'Mumbai',
    'Maharashtra',
    '400001',
    '+91-22-12345678',
    'info@sportzone.com',
    1,
    19.0760,
    72.8777,
    JSON.stringify(['Parking', 'Changing Rooms', 'Cafeteria', 'Air Conditioning']),
    JSON.stringify(['/images/venue1.jpg', '/images/venue1-2.jpg']),
    'approved',
    1
  )

  insertVenue.run(
    'Elite Sports Complex',
    'State-of-the-art facility for professional and recreational sports',
    '456 Elite Avenue, Bandra',
    'Mumbai',
    'Maharashtra',
    '400050',
    '+91-22-87654321',
    'contact@elitesports.com',
    2,
    19.0596,
    72.8295,
    JSON.stringify(['Parking', 'Changing Rooms', 'Pro Shop', 'Fitness Center']),
    JSON.stringify(['/images/venue2.jpg', '/images/venue2-2.jpg']),
    'approved',
    1
  )

  // Add some pending venues for admin review
  insertVenue.run(
    'Victory Sports Club',
    'Modern sports facility with badminton and tennis courts',
    '789 Victory Lane, Pune',
    'Pune',
    'Maharashtra',
    '411001',
    '+91-20-12345678',
    'info@victorysports.com',
    1,
    18.5204,
    73.8567,
    JSON.stringify(['Parking', 'Changing Rooms', 'Equipment Rental']),
    JSON.stringify(['/images/venue3.jpg']),
    'pending',
    1
  )

  insertVenue.run(
    'Champion Arena',
    'Basketball and football facility with professional setup',
    '321 Champion Street, Delhi',
    'Delhi',
    'Delhi',
    '110001',
    '+91-11-87654321',
    'contact@champion.com',
    2,
    28.7041,
    77.1025,
    JSON.stringify(['Parking', 'Cafeteria', 'First Aid']),
    JSON.stringify(['/images/venue4.jpg']),
    'pending',
    1
  )

  // Insert courts
  const insertCourt = database.prepare(`
    INSERT INTO courts (venue_id, name, sport_type, description, price_per_hour, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  // Courts for SportZone Arena
  insertCourt.run(1, 'Badminton Court 1', 'Badminton', 'Professional badminton court with wooden flooring', 1200, 1)
  insertCourt.run(1, 'Badminton Court 2', 'Badminton', 'Professional badminton court with wooden flooring', 1200, 1)
  insertCourt.run(1, 'Table Tennis 1', 'Table Tennis', 'International standard table tennis table', 800, 1)
  insertCourt.run(1, 'Basketball Court', 'Basketball', 'Full-size basketball court', 2000, 1)

  // Courts for Elite Sports Complex
  insertCourt.run(2, 'Tennis Court A', 'Tennis', 'Clay court with professional lighting', 1800, 1)
  insertCourt.run(2, 'Tennis Court B', 'Tennis', 'Hard court with professional lighting', 1800, 1)
  insertCourt.run(2, 'Squash Court 1', 'Squash', 'Glass-back squash court', 1500, 1)
  insertCourt.run(2, 'Football Turf', 'Football', 'Artificial turf football field', 2500, 1)

  // Insert bookings with variety of dates and statuses
  const insertBooking = database.prepare(`
    INSERT INTO bookings (user_id, court_id, venue_id, booking_date, start_time, end_time, duration_hours, price_per_hour, total_amount, status, payment_status, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  // Recent completed bookings
  insertBooking.run(3, 1, 1, '2025-08-05', '18:00', '19:00', 1, 1200, 1200, 'completed', 'paid', 'card')
  insertBooking.run(4, 2, 1, '2025-08-06', '16:00', '17:00', 1, 1200, 1200, 'completed', 'paid', 'upi')
  insertBooking.run(5, 5, 2, '2025-08-07', '19:00', '20:00', 1, 1800, 1800, 'completed', 'paid', 'card')
  insertBooking.run(3, 3, 1, '2025-08-08', '20:00', '21:00', 1, 800, 800, 'completed', 'paid', 'cash')
  insertBooking.run(4, 6, 2, '2025-08-09', '17:00', '18:00', 1, 1800, 1800, 'completed', 'paid', 'upi')

  // Recent confirmed bookings
  insertBooking.run(5, 1, 1, '2025-08-10', '18:00', '19:00', 1, 1200, 1200, 'confirmed', 'paid', 'card')
  insertBooking.run(3, 4, 1, '2025-08-11', '19:00', '20:00', 1, 2000, 2000, 'confirmed', 'paid', 'upi')
  insertBooking.run(4, 7, 2, '2025-08-11', '16:00', '17:00', 1, 1500, 1500, 'confirmed', 'pending', 'card')

  // Upcoming bookings
  insertBooking.run(5, 2, 1, '2025-08-12', '17:00', '18:00', 1, 1200, 1200, 'confirmed', 'paid', 'upi')
  insertBooking.run(3, 8, 2, '2025-08-13', '18:00', '19:00', 1, 2500, 2500, 'confirmed', 'pending', 'card')

  // Some older bookings for trends
  insertBooking.run(4, 1, 1, '2025-08-01', '18:00', '19:00', 1, 1200, 1200, 'completed', 'paid', 'card')
  insertBooking.run(5, 2, 1, '2025-08-02', '19:00', '20:00', 1, 1200, 1200, 'completed', 'paid', 'upi')
  insertBooking.run(3, 5, 2, '2025-08-03', '16:00', '17:00', 1, 1800, 1800, 'completed', 'paid', 'card')
  insertBooking.run(4, 6, 2, '2025-08-04', '17:00', '18:00', 1, 1800, 1800, 'completed', 'paid', 'upi')

  // Insert reviews
  const insertReview = database.prepare(`
    INSERT INTO reviews (user_id, venue_id, rating, title, comment)
    VALUES (?, ?, ?, ?, ?)
  `)

  insertReview.run(3, 1, 5, 'Excellent facility!', 'Great courts and very well maintained. Staff is helpful and courteous.')
  insertReview.run(4, 1, 4, 'Good experience', 'Nice facility but parking can be a bit crowded during peak hours.')
  insertReview.run(5, 2, 5, 'Top-notch courts', 'Professional quality courts with excellent lighting. Highly recommended!')
  insertReview.run(3, 2, 4, 'Great for tournaments', 'Perfect for competitive play. Good amenities and clean facilities.')

  console.log('Database seeded successfully with sample data')
}
