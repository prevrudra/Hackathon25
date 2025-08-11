#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = path.join(__dirname, '..', 'data', 'quickcourt.db');

// Ensure directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Remove existing database
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed existing database');
}

// Create new database
const db = new Database(dbPath);
console.log('Created new database');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
console.log('Creating tables...');

// Users table
db.exec(`
  CREATE TABLE users (
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
`);

// Venues table
db.exec(`
  CREATE TABLE venues (
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
    amenities TEXT,
    images TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );
`);

// Courts table
db.exec(`
  CREATE TABLE courts (
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
`);

// Bookings table
db.exec(`
  CREATE TABLE bookings (
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
`);

// Reviews table
db.exec(`
  CREATE TABLE reviews (
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
`);

console.log('Tables created successfully');

// Insert sample data
console.log('Inserting sample data...');

// Insert admin user
const insertUser = db.prepare(`
  INSERT INTO users (email, password_hash, full_name, role, phone, is_verified, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Admin user
insertUser.run('admin@quickcourt.com', 'hashed_password_admin', 'Admin User', 'admin', '+91-9999999999', 1, 1);

// Facility owners
insertUser.run('owner1@quickcourt.com', 'hashed_password_1', 'Rajesh Kumar', 'facility_owner', '+91-9876543210', 1, 1);
insertUser.run('owner2@quickcourt.com', 'hashed_password_2', 'Priya Sharma', 'facility_owner', '+91-9876543211', 1, 1);

// Regular users
insertUser.run('user1@example.com', 'hashed_password_3', 'Amit Singh', 'user', '+91-9876543212', 1, 1);
insertUser.run('user2@example.com', 'hashed_password_4', 'Sneha Patel', 'user', '+91-9876543213', 1, 1);
insertUser.run('user3@example.com', 'hashed_password_5', 'Rohit Verma', 'user', '+91-9876543214', 1, 1);
insertUser.run('user4@example.com', 'hashed_password_6', 'Arjun Mehta', 'user', '+91-9876543215', 1, 1);
insertUser.run('user5@example.com', 'hashed_password_7', 'Kavya Reddy', 'user', '+91-9876543216', 1, 1);

// Insert venues
const insertVenue = db.prepare(`
  INSERT INTO venues (name, description, address, city, state, pincode, phone, email, owner_id, latitude, longitude, amenities, images, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertVenue.run(
  'SportZone Arena',
  'Premium sports facility with multiple courts and modern amenities',
  '123 Sports Complex, MG Road',
  'Mumbai',
  'Maharashtra',
  '400001',
  '+91-22-12345678',
  'info@sportzone.com',
  2,
  19.0760,
  72.8777,
  JSON.stringify(['Parking', 'Changing Rooms', 'Cafeteria', 'Air Conditioning']),
  JSON.stringify(['/images/venue1.jpg', '/images/venue1-2.jpg']),
  1
);

insertVenue.run(
  'Elite Sports Complex',
  'State-of-the-art facility for professional and recreational sports',
  '456 Elite Avenue, Bandra',
  'Mumbai',
  'Maharashtra',
  '400050',
  '+91-22-87654321',
  'contact@elitesports.com',
  3,
  19.0596,
  72.8295,
  JSON.stringify(['Parking', 'Changing Rooms', 'Pro Shop', 'Fitness Center']),
  JSON.stringify(['/images/venue2.jpg', '/images/venue2-2.jpg']),
  1
);

// Insert courts
const insertCourt = db.prepare(`
  INSERT INTO courts (venue_id, name, sport_type, description, price_per_hour, is_active)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Courts for SportZone Arena
insertCourt.run(1, 'Badminton Court 1', 'Badminton', 'Professional badminton court with wooden flooring', 1200, 1);
insertCourt.run(1, 'Badminton Court 2', 'Badminton', 'Professional badminton court with wooden flooring', 1200, 1);
insertCourt.run(1, 'Table Tennis 1', 'Table Tennis', 'International standard table tennis table', 800, 1);
insertCourt.run(1, 'Basketball Court', 'Basketball', 'Full-size basketball court', 2000, 1);

// Courts for Elite Sports Complex
insertCourt.run(2, 'Tennis Court A', 'Tennis', 'Clay court with professional lighting', 1800, 1);
insertCourt.run(2, 'Tennis Court B', 'Tennis', 'Hard court with professional lighting', 1800, 1);
insertCourt.run(2, 'Squash Court 1', 'Squash', 'Glass-back squash court', 1500, 1);
insertCourt.run(2, 'Football Turf', 'Football', 'Artificial turf football field', 2500, 1);

// Insert bookings with variety of dates and statuses
const insertBooking = db.prepare(`
  INSERT INTO bookings (user_id, court_id, venue_id, booking_date, start_time, end_time, duration_hours, price_per_hour, total_amount, status, payment_status, payment_method, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Create bookings with dates spread over the last week
const today = new Date();
for (let i = 0; i < 15; i++) {
  const bookingDate = new Date(today);
  bookingDate.setDate(today.getDate() - Math.floor(i / 2)); // Spread over last week
  
  const userIds = [4, 5, 6, 7, 8];
  const courtIds = [1, 2, 3, 4, 5, 6, 7, 8];
  const venueIds = [1, 2];
  
  const userId = userIds[i % userIds.length];
  const courtId = courtIds[i % courtIds.length];
  const venueId = courtId <= 4 ? 1 : 2;
  const prices = [800, 1200, 1500, 1800, 2000, 2500];
  const price = prices[i % prices.length];
  
  const createdAt = new Date(bookingDate);
  createdAt.setHours(createdAt.getHours() - 2); // Created 2 hours before booking
  
  insertBooking.run(
    userId,
    courtId,
    venueId,
    bookingDate.toISOString().split('T')[0],
    '18:00',
    '19:00',
    1,
    price,
    price,
    i < 10 ? 'completed' : 'confirmed',
    i < 12 ? 'paid' : 'pending',
    i % 3 === 0 ? 'card' : i % 3 === 1 ? 'upi' : 'cash',
    createdAt.toISOString()
  );
}

// Insert reviews
const insertReview = db.prepare(`
  INSERT INTO reviews (user_id, venue_id, rating, title, comment)
  VALUES (?, ?, ?, ?, ?)
`);

insertReview.run(4, 1, 5, 'Excellent facility!', 'Great courts and very well maintained. Staff is helpful and courteous.');
insertReview.run(5, 1, 4, 'Good experience', 'Nice facility but parking can be a bit crowded during peak hours.');
insertReview.run(6, 2, 5, 'Top-notch courts', 'Professional quality courts with excellent lighting. Highly recommended!');
insertReview.run(7, 2, 4, 'Great for tournaments', 'Perfect for competitive play. Good amenities and clean facilities.');

// Create indexes
db.exec(`
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
`);

console.log('Sample data inserted successfully');

// Close database
db.close();
console.log('Database initialization complete!');
