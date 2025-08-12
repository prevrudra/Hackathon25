#!/usr/bin/env node

const Database = require('better-sqlite3');
const db = new Database('./data/quickcourt.db');

// Make some users unverified and one banned for variety
const updateUserStatus = db.prepare('UPDATE users SET is_verified = ?, is_active = ? WHERE id = ?');

// Make user 6 (Rohit) unverified
updateUserStatus.run(0, 1, 6);

// Make user 8 (Kavya) banned
updateUserStatus.run(1, 0, 8);

console.log('✅ Updated user verification and ban statuses for variety');

// Show current status
const users = db.prepare('SELECT id, full_name, is_verified, is_active FROM users WHERE role != ?').all('admin');
console.log('\n=== USER STATUS SUMMARY ===');
users.forEach(user => {
  const status = [];
  if (!user.is_verified) status.push('UNVERIFIED');
  if (!user.is_active) status.push('BANNED');
  if (status.length === 0) status.push('ACTIVE');
  
  console.log(`${user.full_name}: ${status.join(', ')}`);
});

db.close();
