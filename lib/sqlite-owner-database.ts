import { executeQuery, executeQuerySingle, initializeDatabase, seedDatabase } from './sqlite-database'

export interface OwnerStats {
  totalBookings: number
  totalEarnings: number
  activeFacilities: number
  totalCourts: number
  monthlyRevenue: number
  todayBookings: number
  pendingPayments: number
  occupancyRate: number
}

export interface BookingTrend {
  date: string
  bookings: number
  earnings: number
}

export interface PeakHour {
  hour: string
  bookings: number
}

export interface RecentBooking {
  id: string
  userName: string
  userEmail: string
  courtName: string
  venueName: string
  date: string
  time: string
  status: string
  amount: number
  paymentStatus: string
}

export interface OwnerBooking {
  id: number
  userName: string
  userEmail: string
  userPhone: string
  courtName: string
  venueName: string
  bookingDate: string
  startTime: string
  endTime: string
  duration: number
  totalAmount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  specialRequests: string
  createdAt: string
}

export interface OwnerVenue {
  id: number
  name: string
  description: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  isActive: boolean
  totalCourts: number
  totalBookings: number
  totalRevenue: number
  averageRating: number
  totalReviews: number
}

export interface OwnerCourt {
  id: number
  venueId: number
  venueName: string
  name: string
  sportType: string
  description: string
  pricePerHour: number
  isActive: boolean
  bookingsToday: number
  revenueToday: number
  occupancyRate: number
}

export class OwnerDatabaseService {
  // Initialize database when first accessed
  static {
    initializeDatabase()
    seedDatabase()
  }

  // Get comprehensive stats for owner dashboard
  static async getOwnerStats(ownerId: number): Promise<OwnerStats> {
    try {
      // Total bookings
      const totalBookingsResult = executeQuerySingle(`
        SELECT COUNT(*) as count
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        WHERE v.owner_id = ? AND b.status IN ('confirmed', 'completed')
      `, [ownerId])

      // Total earnings
      const totalEarningsResult = executeQuerySingle(`
        SELECT COALESCE(SUM(b.total_amount), 0) as amount
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        WHERE v.owner_id = ? AND b.status IN ('confirmed', 'completed') AND b.payment_status = 'paid'
      `, [ownerId])

      // Monthly revenue
      const monthlyRevenueResult = executeQuerySingle(`
        SELECT COALESCE(SUM(b.total_amount), 0) as amount
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        WHERE v.owner_id = ? 
        AND b.status IN ('confirmed', 'completed')
        AND b.payment_status = 'paid'
        AND b.booking_date >= date('now', 'start of month')
      `, [ownerId])

      // Today's bookings
      const todayBookingsResult = executeQuerySingle(`
        SELECT COUNT(*) as count
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        WHERE v.owner_id = ? 
        AND b.booking_date = date('now')
        AND b.status IN ('confirmed', 'completed')
      `, [ownerId])

      // Pending payments
      const pendingPaymentsResult = executeQuerySingle(`
        SELECT COALESCE(SUM(b.total_amount), 0) as amount
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        WHERE v.owner_id = ? AND b.status = 'confirmed' AND b.payment_status = 'pending'
      `, [ownerId])

      // Facilities and courts count
      const facilitiesResult = executeQuerySingle(`
        SELECT 
          COUNT(DISTINCT v.id) as active_facilities,
          COUNT(c.id) as total_courts
        FROM venues v
        LEFT JOIN courts c ON v.id = c.venue_id AND c.is_active = 1
        WHERE v.owner_id = ? AND v.is_active = 1
      `, [ownerId])

      // Calculate occupancy rate (simplified calculation)
      const occupancyRate = todayBookingsResult?.count > 0 && facilitiesResult?.total_courts > 0 
        ? Math.round((todayBookingsResult.count / facilitiesResult.total_courts) * 100 * 100) / 100
        : 0

      return {
        totalBookings: parseInt(totalBookingsResult?.count || 0),
        totalEarnings: parseFloat(totalEarningsResult?.amount || 0),
        activeFacilities: parseInt(facilitiesResult?.active_facilities || 0),
        totalCourts: parseInt(facilitiesResult?.total_courts || 0),
        monthlyRevenue: parseFloat(monthlyRevenueResult?.amount || 0),
        todayBookings: parseInt(todayBookingsResult?.count || 0),
        pendingPayments: parseFloat(pendingPaymentsResult?.amount || 0),
        occupancyRate: occupancyRate
      }
    } catch (error) {
      console.error('Error fetching owner stats:', error)
      throw error
    }
  }

  // Get booking trends for charts
  static async getBookingTrends(ownerId: number, days: number = 7): Promise<BookingTrend[]> {
    try {
      // Get the actual booking data for the last N days
      const results = executeQuery(`
        SELECT 
          strftime('%m/%d', b.booking_date) as date,
          COUNT(*) as bookings,
          SUM(b.total_amount) as earnings
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        WHERE v.owner_id = ?
          AND b.booking_date >= date('now', '-${days} days')
          AND b.status IN ('confirmed', 'completed')
        GROUP BY date(b.booking_date)
        ORDER BY b.booking_date
      `, [ownerId])

      // Fill in missing dates with 0 values
      const dateMap = new Map()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      // Initialize all dates with 0
      for (let i = 0; i <= days; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        const dateStr = (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate().toString().padStart(2, '0')
        dateMap.set(dateStr, { date: dateStr, bookings: 0, earnings: 0 })
      }
      
      // Fill in actual data
      results.forEach((row: any) => {
        dateMap.set(row.date, {
          date: row.date,
          bookings: parseInt(row.bookings) || 0,
          earnings: parseFloat(row.earnings) || 0
        })
      })

      return Array.from(dateMap.values())
    } catch (error) {
      console.error('Error fetching booking trends:', error)
      throw error
    }
  }

  // Get peak hours data
  static async getPeakHours(ownerId: number): Promise<PeakHour[]> {
    try {
      // Get actual booking data by hour
      const results = executeQuery(`
        SELECT 
          printf('%02d:00', CAST(substr(b.start_time, 1, 2) AS INTEGER)) as hour,
          COUNT(*) as bookings
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        WHERE v.owner_id = ?
          AND b.booking_date >= date('now', '-30 days')
          AND b.status IN ('confirmed', 'completed')
        GROUP BY CAST(substr(b.start_time, 1, 2) AS INTEGER)
        ORDER BY CAST(substr(b.start_time, 1, 2) AS INTEGER)
      `, [ownerId])

      // Create a map for all business hours (6 AM to 10 PM)
      const hourMap = new Map()
      for (let hour = 6; hour <= 22; hour++) {
        const hourStr = hour.toString().padStart(2, '0') + ':00'
        hourMap.set(hourStr, { hour: hourStr, bookings: 0 })
      }
      
      // Fill in actual data
      results.forEach((row: any) => {
        hourMap.set(row.hour, {
          hour: row.hour,
          bookings: parseInt(row.bookings) || 0
        })
      })

      return Array.from(hourMap.values())
    } catch (error) {
      console.error('Error fetching peak hours:', error)
      throw error
    }
  }

  // Get recent bookings
  static async getRecentBookings(ownerId: number, limit: number = 10): Promise<RecentBooking[]> {
    try {
      const results = executeQuery(`
        SELECT 
          b.id,
          u.full_name as user_name,
          u.email as user_email,
          c.name as court_name,
          v.name as venue_name,
          b.booking_date as date,
          b.start_time || '-' || b.end_time as time,
          b.status,
          b.total_amount as amount,
          b.payment_status
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        JOIN users u ON b.user_id = u.id
        WHERE v.owner_id = ?
        ORDER BY b.created_at DESC
        LIMIT ?
      `, [ownerId, limit])

      return results.map((row: any) => ({
        id: row.id.toString(),
        userName: row.user_name,
        userEmail: row.user_email,
        courtName: row.court_name,
        venueName: row.venue_name,
        date: row.date,
        time: row.time,
        status: row.status,
        amount: parseFloat(row.amount),
        paymentStatus: row.payment_status
      }))
    } catch (error) {
      console.error('Error fetching recent bookings:', error)
      throw error
    }
  }

  // Get all bookings for owner with filters
  static async getOwnerBookings(
    ownerId: number, 
    status?: string, 
    dateFrom?: string, 
    dateTo?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ bookings: OwnerBooking[], total: number }> {
    try {
      let whereClause = 'WHERE v.owner_id = ?'
      const params: any[] = [ownerId]

      if (status && status !== 'all') {
        whereClause += ' AND b.status = ?'
        params.push(status)
      }

      if (dateFrom) {
        whereClause += ' AND b.booking_date >= ?'
        params.push(dateFrom)
      }

      if (dateTo) {
        whereClause += ' AND b.booking_date <= ?'
        params.push(dateTo)
      }

      // Get total count
      const countResult = executeQuerySingle(`
        SELECT COUNT(*) as total
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        JOIN users u ON b.user_id = u.id
        ${whereClause}
      `, params)

      const total = parseInt(countResult?.total || 0)

      // Get paginated results
      const offset = (page - 1) * limit
      const results = executeQuery(`
        SELECT 
          b.id,
          u.full_name as user_name,
          u.email as user_email,
          u.phone as user_phone,
          c.name as court_name,
          v.name as venue_name,
          b.booking_date,
          b.start_time,
          b.end_time,
          b.duration_hours as duration,
          b.total_amount,
          b.status,
          b.payment_status,
          b.payment_method,
          b.special_requests,
          b.created_at
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        JOIN users u ON b.user_id = u.id
        ${whereClause}
        ORDER BY b.created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset])

      const bookings = results.map((row: any) => ({
        id: row.id,
        userName: row.user_name,
        userEmail: row.user_email,
        userPhone: row.user_phone || '',
        courtName: row.court_name,
        venueName: row.venue_name,
        bookingDate: row.booking_date,
        startTime: row.start_time,
        endTime: row.end_time,
        duration: parseFloat(row.duration),
        totalAmount: parseFloat(row.total_amount),
        status: row.status,
        paymentStatus: row.payment_status,
        paymentMethod: row.payment_method || '',
        specialRequests: row.special_requests || '',
        createdAt: row.created_at
      }))

      return { bookings, total }
    } catch (error) {
      console.error('Error fetching owner bookings:', error)
      throw error
    }
  }

  // Get owner venues
  static async getOwnerVenues(ownerId: number): Promise<OwnerVenue[]> {
    try {
      const results = executeQuery(`
        SELECT 
          v.id,
          v.name,
          v.description,
          v.address,
          v.city,
          v.state,
          v.pincode,
          v.phone,
          v.email,
          v.is_active,
          COUNT(DISTINCT c.id) as total_courts,
          COUNT(DISTINCT b.id) as total_bookings,
          COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'completed') AND b.payment_status = 'paid' THEN b.total_amount ELSE 0 END), 0) as total_revenue,
          COALESCE(AVG(r.rating), 0) as average_rating,
          COUNT(DISTINCT r.id) as total_reviews
        FROM venues v
        LEFT JOIN courts c ON v.id = c.venue_id
        LEFT JOIN bookings b ON c.id = b.court_id
        LEFT JOIN reviews r ON v.id = r.venue_id
        WHERE v.owner_id = ?
        GROUP BY v.id, v.name, v.description, v.address, v.city, v.state, v.pincode, v.phone, v.email, v.is_active
        ORDER BY v.name
      `, [ownerId])

      return results.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        address: row.address || '',
        city: row.city || '',
        state: row.state || '',
        pincode: row.pincode || '',
        phone: row.phone || '',
        email: row.email || '',
        isActive: Boolean(row.is_active),
        totalCourts: parseInt(row.total_courts),
        totalBookings: parseInt(row.total_bookings),
        totalRevenue: parseFloat(row.total_revenue),
        averageRating: parseFloat(row.average_rating),
        totalReviews: parseInt(row.total_reviews)
      }))
    } catch (error) {
      console.error('Error fetching owner venues:', error)
      throw error
    }
  }

  // Get owner courts
  static async getOwnerCourts(ownerId: number, venueId?: number): Promise<OwnerCourt[]> {
    try {
      let whereClause = 'WHERE v.owner_id = ?'
      const params: any[] = [ownerId]

      if (venueId) {
        whereClause += ' AND v.id = ?'
        params.push(venueId)
      }

      const results = executeQuery(`
        SELECT 
          c.id,
          c.venue_id,
          v.name as venue_name,
          c.name,
          c.sport_type,
          c.description,
          c.price_per_hour,
          c.is_active,
          COUNT(CASE WHEN b.booking_date = date('now') AND b.status IN ('confirmed', 'completed') THEN 1 END) as bookings_today,
          COALESCE(SUM(CASE WHEN b.booking_date = date('now') AND b.status IN ('confirmed', 'completed') THEN b.total_amount ELSE 0 END), 0) as revenue_today,
          ROUND(
            CASE 
              WHEN COUNT(CASE WHEN b.booking_date >= date('now', '-7 days') THEN 1 END) > 0
              THEN (COUNT(CASE WHEN b.booking_date >= date('now', '-7 days') AND b.status IN ('confirmed', 'completed') THEN 1 END) * 100.0 / (7 * 16))
              ELSE 0 
            END, 2
          ) as occupancy_rate
        FROM courts c
        JOIN venues v ON c.venue_id = v.id
        LEFT JOIN bookings b ON c.id = b.court_id
        ${whereClause}
        GROUP BY c.id, c.venue_id, v.name, c.name, c.sport_type, c.description, c.price_per_hour, c.is_active
        ORDER BY v.name, c.name
      `, params)

      return results.map((row: any) => ({
        id: row.id,
        venueId: row.venue_id,
        venueName: row.venue_name,
        name: row.name,
        sportType: row.sport_type,
        description: row.description || '',
        pricePerHour: parseFloat(row.price_per_hour),
        isActive: Boolean(row.is_active),
        bookingsToday: parseInt(row.bookings_today),
        revenueToday: parseFloat(row.revenue_today),
        occupancyRate: parseFloat(row.occupancy_rate)
      }))
    } catch (error) {
      console.error('Error fetching owner courts:', error)
      throw error
    }
  }
}
