import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "quickcourt.sqlite")
const db = new Database(dbPath)

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullName TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'facility_owner', 'admin')),
    avatar TEXT,
    isVerified BOOLEAN DEFAULT FALSE,
    isBanned BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    ownerId TEXT NOT NULL,
    sports TEXT NOT NULL, -- JSON array
    amenities TEXT, -- JSON array
    images TEXT, -- JSON array
    rating REAL DEFAULT 0,
    reviewCount INTEGER DEFAULT 0,
    isApproved BOOLEAN DEFAULT FALSE,
    isPending BOOLEAN DEFAULT TRUE,
    rejectionReason TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS courts (
    id TEXT PRIMARY KEY,
    venueId TEXT NOT NULL,
    name TEXT NOT NULL,
    sportType TEXT NOT NULL,
    pricePerHour REAL NOT NULL,
    operatingHours TEXT NOT NULL, -- JSON object
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venueId) REFERENCES venues (id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    venueId TEXT NOT NULL,
    courtId TEXT NOT NULL,
    date TEXT NOT NULL,
    timeSlot TEXT NOT NULL,
    duration INTEGER NOT NULL,
    totalPrice REAL NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (venueId) REFERENCES venues (id),
    FOREIGN KEY (courtId) REFERENCES courts (id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    venueId TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (venueId) REFERENCES venues (id)
  );
`)

// Seed initial data if tables are empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number }

if (userCount.count === 0) {
  // Insert demo users
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password, fullName, role, isVerified)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  insertUser.run("admin-1", "admin@quickcourt.com", "admin123", "Admin User", "admin", true)
  insertUser.run("owner-1", "owner@quickcourt.com", "owner123", "Facility Owner", "facility_owner", true)
  insertUser.run("user-1", "user@quickcourt.com", "user123", "Regular User", "user", true)

  // Insert demo venues
  const insertVenue = db.prepare(`
    INSERT INTO venues (id, name, description, address, ownerId, sports, amenities, images, rating, reviewCount, isApproved, isPending)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  insertVenue.run(
    "venue-1",
    "SportZone Arena",
    "Premium sports facility with multiple courts",
    "123 Sports Street, Downtown",
    "owner-1",
    JSON.stringify(["Badminton", "Table Tennis"]),
    JSON.stringify(["Parking", "Changing Rooms", "Equipment Rental"]),
    JSON.stringify(["/placeholder.svg?height=200&width=300"]),
    4.5,
    25,
    true,
    false,
  )

  // Insert pending venue
  insertVenue.run(
    "venue-pending-1",
    "Elite Sports Complex",
    "New sports facility awaiting approval",
    "456 Athletic Ave, Uptown",
    "owner-1",
    JSON.stringify(["Basketball", "Volleyball"]),
    JSON.stringify(["Parking", "Cafeteria", "Locker Rooms"]),
    JSON.stringify(["/placeholder.svg?height=200&width=300"]),
    0,
    0,
    false,
    true,
  )

  // Insert demo courts
  const insertCourt = db.prepare(`
    INSERT INTO courts (id, venueId, name, sportType, pricePerHour, operatingHours)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  insertCourt.run("court-1", "venue-1", "Court A", "Badminton", 25, JSON.stringify({ start: "06:00", end: "22:00" }))

  // Insert demo bookings
  const insertBooking = db.prepare(`
    INSERT INTO bookings (id, userId, venueId, courtId, date, timeSlot, duration, totalPrice, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  insertBooking.run("booking-1", "user-1", "venue-1", "court-1", "2024-01-15", "10:00-11:00", 1, 25, "confirmed")
}

export default db
