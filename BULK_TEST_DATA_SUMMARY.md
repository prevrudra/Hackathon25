# Bulk Test Data Summary

## Overview
This document outlines the comprehensive bulk test data that has been added to the QuickCourt database. The data includes realistic scenarios across all tables to support thorough testing and development.

## Data Breakdown

### 1. Users (72 total)
- **2 Admin Users**: System administrators with full access
- **20 Facility Owners**: Venue owners managing their sports facilities
- **50 Regular Users**: Customers who book courts and leave reviews

**User Categories:**
- All users have verified accounts with realistic phone numbers
- Diverse names representing different regions of India
- Password hashes use bcrypt format (example hashes for testing)
- Mix of active users with complete profiles

### 2. Venues (30 total)
**Geographic Distribution:**
- Mumbai: 3 venues
- Delhi: 3 venues  
- Bangalore: 3 venues
- Pune: 2 venues
- Hyderabad: 3 venues
- Chennai: 2 venues
- Kolkata: 2 venues
- Other cities: 12 venues (Ahmedabad, Jaipur, Indore, Noida, etc.)

**Venue Types:**
- Multi-sport complexes (badminton, table tennis, squash, tennis)
- Specialized badminton centers
- Premium facilities with luxury amenities
- Budget-friendly community courts

**Features:**
- Realistic ratings (4.1 to 4.8 stars)
- Comprehensive amenities (parking, changing rooms, cafeteria, AC, equipment rental)
- Different sports supported per venue
- All venues approved and active

### 3. Courts (150+ total)
**Sport Distribution:**
- **Badminton**: ~60% of courts (most popular)
- **Table Tennis**: ~25% of courts
- **Squash**: ~10% of courts
- **Tennis**: ~5% of courts
- **Basketball**: Limited courts

**Pricing Strategy:**
- Badminton: ₹800-₹1,500 per hour
- Table Tennis: ₹400-₹650 per hour
- Squash: ₹700-₹900 per hour
- Tennis: ₹1,400-₹1,600 per hour

**Operating Hours:**
- Most courts: 6 AM - 10 PM weekdays
- Extended hours: 5 AM - 11 PM/12 AM for premium venues
- Weekend variations with extended hours

### 4. Bookings (100+ total)
**Booking Patterns:**
- **Past Bookings**: 40+ completed bookings (last 30 days)
- **Future Bookings**: 50+ confirmed bookings (next 30 days)
- **Cancelled/No-show**: 10+ bookings for realistic scenarios

**Booking Types:**
- Single hour slots (most common)
- Multi-hour sessions (2-3 hours)
- Weekend extended bookings
- Early morning and late evening slots
- Recurring weekly bookings for regular users

**Payment Methods:**
- UPI payments: ~60%
- Card payments: ~40%
- All payments include realistic transaction IDs

**Special Features:**
- Special requests (coaching, equipment, celebrations)
- Corporate bookings
- Tournament preparation sessions
- Training and practice sessions

### 5. Reviews (60+ total)
**Review Distribution:**
- Average ratings: 4-5 stars (realistic positive bias)
- Verified reviews from actual booking users
- Diverse feedback covering different aspects:
  - Court quality and maintenance
  - Staff service and professionalism
  - Amenities and facilities
  - Booking experience
  - Value for money

**Review Categories:**
- Facility quality reviews
- Service experience feedback
- Coaching and training reviews
- Equipment and amenity reviews

### 6. Time Slots (500+ total)
**Availability Patterns:**
- Full day coverage (6 AM - 10 PM typically)
- Weekend premium pricing for popular slots
- Blocked slots for maintenance
- Real-time availability simulation

**Special Pricing:**
- Weekend premium rates (+15-20%)
- Peak hour pricing (6-9 PM)
- Early bird discounts (before 8 AM)
- Maintenance blocks

## Realistic Business Scenarios

### 1. Peak Time Management
- Popular time slots (6-9 PM) with higher booking rates
- Weekend surge with premium pricing
- Early morning slots for serious players

### 2. Seasonal Patterns
- Recent booking history showing consistent usage
- Future bookings indicating growing demand
- Mixed booking durations (1-3 hours)

### 3. User Behavior Patterns
- Regular users with weekly recurring bookings
- Occasional players with sporadic bookings
- Tournament players with extended sessions
- Corporate bookings for team events

### 4. Venue Management
- Different pricing strategies per venue
- Varied amenities and service levels
- Geographic distribution across major cities
- Mix of specialized and multi-sport facilities

### 5. Payment and Cancellation Patterns
- High payment success rate (90%+)
- Realistic cancellation rate (5-10%)
- No-show scenarios for revenue analysis
- Refund processing for cancellations

## Data Integrity Features

### 1. Referential Integrity
- All foreign key relationships properly maintained
- Cascading deletes where appropriate
- Consistent user-venue-court-booking relationships

### 2. Business Rules Compliance
- No double bookings for same time slot
- Operating hours respected in time slots
- Realistic pricing within market ranges
- Proper status transitions for bookings

### 3. Performance Optimization
- Indexed columns for fast queries
- Date ranges suitable for calendar views
- Geographic distribution for location-based searches
- Rating aggregations for venue rankings

## Usage Instructions

### 1. Running the Bulk Data Script
```bash
# Navigate to the scripts directory
cd /Users/rudra/Desktop/Hackathon/Hackathon25/scripts

# Run the comprehensive initialization
node init-bulk-data.js

# Or run with additional time slot generation
node init-bulk-data.js --generate-slots
```

### 2. Manual SQL Execution
Execute scripts in this order:
1. `10_bulk_test_data.sql` - Core bulk data
2. `11_additional_courts.sql` - Additional court data
3. `12_additional_bookings_timeslots.sql` - Bookings and time slots

### 3. Verification Queries
```sql
-- Check data counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'Venues', COUNT(*) FROM venues
UNION ALL SELECT 'Courts', COUNT(*) FROM courts
UNION ALL SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'Time Slots', COUNT(*) FROM time_slots;

-- Check recent bookings
SELECT b.*, u.full_name, v.name as venue_name, c.name as court_name
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN venues v ON b.venue_id = v.id  
JOIN courts c ON b.court_id = c.id
WHERE b.booking_date >= date('now', '-7 days')
ORDER BY b.booking_date DESC, b.start_time DESC;

-- Check venue ratings
SELECT name, rating, total_reviews, city, state
FROM venues
WHERE status = 'approved'
ORDER BY rating DESC, total_reviews DESC;
```

## Development Benefits

### 1. Realistic Testing Environment
- Production-like data volumes
- Realistic user interaction patterns
- Comprehensive edge cases covered

### 2. Feature Development Support
- Calendar view testing with varied bookings
- Search and filter functionality validation
- Payment processing workflow testing
- Review and rating system validation

### 3. Performance Testing
- Query optimization with substantial data
- Database indexing validation
- API response time measurement
- Concurrent booking scenario testing

### 4. UI/UX Development
- Rich data for interface components
- Realistic user flows and scenarios
- Error condition simulation
- Success case demonstrations

This comprehensive bulk test data provides a solid foundation for developing, testing, and demonstrating the QuickCourt application with realistic business scenarios and user patterns.
