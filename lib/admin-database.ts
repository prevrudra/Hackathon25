import { executeQuery, executeQuerySingle } from './sqlite-database'
import type { AdminStats, PendingFacility, PlatformUser } from './admin-data'

export async function getAdminStats(): Promise<AdminStats> {
  try {
    // Get total users count
    const totalUsersResult = executeQuerySingle(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user' AND is_active = 1"
    )
    const totalUsers = totalUsersResult?.count || 0

    // Get total facility owners count
    const totalOwnersResult = executeQuerySingle(
      "SELECT COUNT(*) as count FROM users WHERE role = 'facility_owner' AND is_active = 1"
    )
    const totalFacilityOwners = totalOwnersResult?.count || 0

    // Get total bookings count
    const totalBookingsResult = executeQuerySingle(
      "SELECT COUNT(*) as count FROM bookings"
    )
    const totalBookings = totalBookingsResult?.count || 0

    // Get total active courts count
    const totalCourtsResult = executeQuerySingle(
      "SELECT COUNT(*) as count FROM courts WHERE is_active = 1"
    )
    const totalActiveCourts = totalCourtsResult?.count || 0

    // Since we don't have a status column yet, set pending approvals to 0 for now
    // This will be updated once the database schema is fixed
    const pendingApprovals = 0

    // Get total revenue from completed bookings
    const revenueResult = executeQuerySingle(
      "SELECT SUM(total_amount) as total FROM bookings WHERE payment_status = 'paid'"
    )
    const totalRevenue = Math.round((revenueResult?.total || 0) * 100) // Convert to paisa for display

    // Get user registration trends (last 7 days)
    const userTrends = executeQuery(`
      SELECT 
        DATE(created_at) as date,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as users,
        COUNT(CASE WHEN role = 'facility_owner' THEN 1 END) as owners
      FROM users 
      WHERE created_at >= DATE('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `)

    // Format user registration trends
    const userRegistrationTrends = userTrends.map(row => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: row.users,
      owners: row.owners
    }))

    // Get booking activity trends (last 7 days)
    const bookingTrends = executeQuery(`
      SELECT 
        DATE(booking_date) as date,
        COUNT(*) as bookings,
        SUM(total_amount) as revenue
      FROM bookings 
      WHERE booking_date >= DATE('now', '-7 days')
      GROUP BY DATE(booking_date)
      ORDER BY date ASC
    `)

    // Format booking activity trends
    const bookingActivityTrends = bookingTrends.map(row => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bookings: row.bookings,
      revenue: Math.round((row.revenue || 0) * 100) // Convert to paisa
    }))

    // Get sport popularity from bookings
    const sportStats = executeQuery(`
      SELECT 
        c.sport_type as sport,
        COUNT(*) as bookings
      FROM bookings b
      JOIN courts c ON b.court_id = c.id
      GROUP BY c.sport_type
      ORDER BY bookings DESC
    `)

    const totalSportBookings = sportStats.reduce((sum, row) => sum + row.bookings, 0)
    const sportPopularity = sportStats.map(row => ({
      sport: row.sport,
      bookings: row.bookings,
      percentage: totalSportBookings > 0 ? Math.round((row.bookings / totalSportBookings) * 100) : 0
    }))

    // Get recent activity
    const recentRegistrations = executeQuery(`
      SELECT 
        'user_registration' as type,
        'New user "' || full_name || '" registered as ' || role as description,
        created_at as timestamp,
        id
      FROM users 
      WHERE created_at >= DATETIME('now', '-7 days')
      ORDER BY created_at DESC
      LIMIT 3
    `)

    const recentBookings = executeQuery(`
      SELECT 
        'booking' as type,
        'New booking for ' || c.sport_type || ' court at ' || v.name as description,
        b.created_at as timestamp,
        b.id
      FROM bookings b
      JOIN courts c ON b.court_id = c.id
      JOIN venues v ON b.venue_id = v.id
      WHERE b.created_at >= DATETIME('now', '-3 days')
      ORDER BY b.created_at DESC
      LIMIT 2
    `)

    const recentActivity = [
      ...recentRegistrations.map(row => ({
        id: `user_${row.id}`,
        type: row.type as "user_registration",
        description: row.description,
        timestamp: row.timestamp
      })),
      ...recentBookings.map(row => ({
        id: `booking_${row.id}`,
        type: row.type as "booking",
        description: row.description,
        timestamp: row.timestamp
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)

    return {
      totalUsers,
      totalFacilityOwners,
      totalBookings,
      totalActiveCourts,
      pendingApprovals,
      totalRevenue,
      userRegistrationTrends,
      bookingActivityTrends,
      sportPopularity,
      recentActivity
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    // Return default values if database query fails
    return {
      totalUsers: 0,
      totalFacilityOwners: 0,
      totalBookings: 0,
      totalActiveCourts: 0,
      pendingApprovals: 0,
      totalRevenue: 0,
      userRegistrationTrends: [],
      bookingActivityTrends: [],
      sportPopularity: [],
      recentActivity: []
    }
  }
}

export async function getPendingFacilities(): Promise<PendingFacility[]> {
  try {
    // For now, return empty array since we don't have status column
    // This can be updated once the database schema is properly migrated
    const pendingVenues = executeQuery(`
      SELECT 
        v.*,
        u.full_name as owner_name,
        u.email as owner_email,
        COUNT(c.id) as court_count
      FROM venues v
      JOIN users u ON v.owner_id = u.id
      LEFT JOIN courts c ON v.id = c.venue_id
      WHERE v.is_active = 1
      GROUP BY v.id, v.name, v.description, v.address, v.city, v.state, v.pincode, v.phone, v.email, v.owner_id, v.latitude, v.longitude, v.amenities, v.images, v.is_active, v.created_at, v.updated_at, u.full_name, u.email
      ORDER BY v.created_at DESC
      LIMIT 5
    `)

    return pendingVenues.map(venue => ({
      id: venue.id.toString(),
      name: venue.name,
      ownerName: venue.owner_name,
      ownerEmail: venue.owner_email,
      location: `${venue.city}, ${venue.state}`,
      sports: [], // We'll need to get this from courts
      courts: venue.court_count || 0,
      submittedAt: venue.created_at,
      description: venue.description || 'No description provided',
      images: venue.images ? JSON.parse(venue.images) : ['/placeholder.svg'],
      amenities: venue.amenities ? JSON.parse(venue.amenities) : []
    }))
  } catch (error) {
    console.error('Error fetching pending facilities:', error)
    return []
  }
}

export async function getPlatformUsers(): Promise<PlatformUser[]> {
  try {
    const users = executeQuery(`
      SELECT 
        u.*,
        COALESCE(b.booking_count, 0) as total_bookings,
        COALESCE(b.total_spent, 0) as total_spent
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          COUNT(*) as booking_count,
          SUM(total_amount) as total_spent
        FROM bookings
        WHERE payment_status = 'paid'
        GROUP BY user_id
      ) b ON u.id = b.user_id
      WHERE u.role IN ('user', 'facility_owner')
      ORDER BY u.created_at DESC
      LIMIT 50
    `)

    return users.map(user => ({
      id: user.id.toString(),
      fullName: user.full_name,
      email: user.email,
      role: user.role as "user" | "facility_owner",
      isVerified: Boolean(user.is_verified),
      isBanned: !Boolean(user.is_active),
      joinedAt: user.created_at,
      totalBookings: user.total_bookings,
      totalSpent: user.total_spent || 0, // Keep in original currency units
      lastActive: user.updated_at
    }))
  } catch (error) {
    console.error('Error fetching platform users:', error)
    return []
  }
}

export async function approveVenue(venueId: string): Promise<boolean> {
  try {
    // For now, just return true since we don't have status column
    // This can be updated once the database schema is properly migrated
    console.log(`Venue ${venueId} would be approved (status column not available yet)`)
    return true
  } catch (error) {
    console.error('Error approving venue:', error)
    return false
  }
}

export async function rejectVenue(venueId: string, reason?: string): Promise<boolean> {
  try {
    // For now, just return true since we don't have status column
    // This can be updated once the database schema is properly migrated
    console.log(`Venue ${venueId} would be rejected (status column not available yet): ${reason}`)
    return true
  } catch (error) {
    console.error('Error rejecting venue:', error)
    return false
  }
}

export async function banUser(userId: string, reason?: string): Promise<boolean> {
  try {
    const result = executeQuery(
      "UPDATE users SET is_active = 0 WHERE id = ?",
      [userId]
    )
    
    // Log the ban reason for audit purposes
    if (reason) {
      console.log(`User ${userId} banned. Reason: ${reason}`)
    }
    
    return result[0]?.changes > 0
  } catch (error) {
    console.error('Error banning user:', error)
    return false
  }
}

export async function unbanUser(userId: string): Promise<boolean> {
  try {
    const result = executeQuery(
      "UPDATE users SET is_active = 1 WHERE id = ?",
      [userId]
    )
    return result[0]?.changes > 0
  } catch (error) {
    console.error('Error unbanning user:', error)
    return false
  }
}
