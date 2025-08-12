#!/usr/bin/env node

const Database = require('better-sqlite3');
const db = new Database('./data/quickcourt.db');

console.log('Updating user data with realistic timestamps...');

// Update users with more realistic joining dates and last active times
const updateUser = db.prepare(`
  UPDATE users 
  SET created_at = ?, updated_at = ?
  WHERE id = ?
`);

// User 1 (admin) - oldest account
updateUser.run('2025-07-15 09:30:00', '2025-08-11 16:20:00', 1);

// Owner 1 - joined 3 weeks ago
updateUser.run('2025-07-22 14:15:00', '2025-08-10 11:45:00', 2);

// Owner 2 - joined 2 weeks ago  
updateUser.run('2025-07-28 10:20:00', '2025-08-11 08:30:00', 3);

// User 1 - joined 10 days ago, very active
updateUser.run('2025-08-01 16:45:00', '2025-08-11 19:15:00', 4);

// User 2 - joined 8 days ago
updateUser.run('2025-08-03 12:30:00', '2025-08-11 14:20:00', 5);

// User 3 - joined 6 days ago
updateUser.run('2025-08-05 09:15:00', '2025-08-10 20:10:00', 6);

// User 4 - joined 4 days ago
updateUser.run('2025-08-07 11:45:00', '2025-08-11 17:30:00', 7);

// User 5 - joined 2 days ago, newest user
updateUser.run('2025-08-09 15:20:00', '2025-08-11 21:45:00', 8);

// Also update booking creation times to be more realistic
const updateBooking = db.prepare(`
  UPDATE bookings 
  SET created_at = ?
  WHERE id = ?
`);

// Update booking timestamps to be more spread out
const bookings = db.prepare('SELECT id, user_id, booking_date FROM bookings ORDER BY id').all();

bookings.forEach((booking, index) => {
  // Create bookings with timestamps that make sense relative to user join dates
  const baseDate = new Date('2025-08-01');
  const createdAt = new Date(baseDate.getTime() + (index * 8 * 60 * 60 * 1000)); // Spread over days
  updateBooking.run(createdAt.toISOString().replace('T', ' ').slice(0, 19), booking.id);
});

console.log('✅ Updated user and booking timestamps');

// Display updated user info
console.log('\\n=== UPDATED USER DATA ===');
const users = db.prepare(`
  SELECT id, full_name, role, created_at, updated_at 
  FROM users 
  WHERE role != 'admin'
  ORDER BY created_at DESC
`).all();

users.forEach(user => {
  console.log(`${user.full_name} (${user.role})`);
  console.log(`  Joined: ${user.created_at}`);
  console.log(`  Last Active: ${user.updated_at}`);
  console.log('');
});

db.close();
console.log('Database update complete!');
