# QuickCourt Database Setup

This application now supports real SQLite database integration for owner functionality.

## Database Requirements

- Node.js 18+
- Better-sqlite3 (automatically installed)

## Quick Setup (Development)

### SQLite Integration (Default)
The application automatically creates and manages a local SQLite database:

- **Database File**: `data/quickcourt.db`
- **Auto-Initialization**: Tables and sample data created automatically
- **No Setup Required**: Works out of the box

### Features

1. **Automatic Database Creation**
   - Database and tables created on first run
   - Sample data seeded automatically
   - Located at `data/quickcourt.db` in project root

2. **Sample Data Included**
   - 2 Facility Owners (Rajesh Kumar, Priya Sharma)
   - 3 Regular Users
   - 2 Venues (SportZone Arena, Elite Sports Complex)
   - 8 Courts (Badminton, Tennis, Basketball, etc.)
   - 14+ Bookings with realistic dates and statuses
   - Sample Reviews

## Current Features with Database Integration

### Owner Dashboard (`/owner/dashboard`)
- **Real-time Stats**: Total bookings, earnings, facilities, courts
- **Advanced Metrics**: Monthly revenue, today's bookings, pending payments, occupancy rate
- **Interactive Charts**: Booking trends over time, peak hour analysis
- **Live Data**: Recent bookings fetched from SQLite database

### Owner Bookings (`/owner/bookings`)
- **Complete Booking Management**: Filter by status, date range
- **Customer Details**: Full user information, contact details
- **Payment Tracking**: Payment status, methods, amounts
- **Pagination**: Handle large datasets efficiently

### Owner Venues & Courts (`/owner/facilities`, `/owner/courts`)
- **Venue Management**: Performance metrics, revenue tracking
- **Court Analytics**: Occupancy rates, daily performance
- **Real-time Updates**: Live booking status, availability

## Test Data Overview

### Facility Owners
- **Owner 1**: Rajesh Kumar (SportZone Arena)
  - 4 Courts: Badminton (2), Table Tennis, Basketball
  - Multiple bookings across different dates
- **Owner 2**: Priya Sharma (Elite Sports Complex)  
  - 4 Courts: Tennis (2), Squash, Football Turf
  - Premium pricing and facilities

### Sample Users
- Amit Singh, Sneha Patel, Rohit Verma
- Realistic bookings with different sports preferences
- Payment history and reviews

## API Endpoints

- `GET /api/owner/stats?ownerId=1` - Owner dashboard statistics
- `GET /api/owner/bookings?ownerId=1` - Paginated bookings with filters
- `GET /api/owner/venues?ownerId=1` - Owner's venues with analytics
- `GET /api/owner/courts?ownerId=1` - Courts with performance metrics
- `GET /api/owner/trends?ownerId=1&days=7` - Booking trends over time
- `GET /api/owner/peak-hours?ownerId=1` - Peak hour analysis

## Demo & Testing

### Test Pages
- **`/database-test`** - Complete database integration testing
- **`/owner/dashboard`** - Live owner dashboard with real data
- **`/quick-test`** - Simple tools for testing

### Demo Users
- **Owner ID 1**: Rajesh Kumar (SportZone Arena)
- **Owner ID 2**: Priya Sharma (Elite Sports Complex)

## Database Schema

The SQLite database includes:
- **users**: User accounts and profiles
- **venues**: Sports facilities
- **courts**: Individual courts within venues
- **bookings**: Booking transactions and status
- **reviews**: User reviews and ratings
- **time_slots**: Available time slots

## Advantages of SQLite Integration

- **Zero Configuration**: Works immediately without setup
- **Local Storage**: Data persists between sessions
- **Fast Performance**: In-memory and file-based operations
- **Development Ready**: Perfect for development and demos
- **Production Capable**: Can handle substantial traffic

## Database File Location

```
/data/quickcourt.db
```

The database file is automatically created in the `data` directory of your project.
