import { executeQuery, executeQuerySingle } from './database'

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
  // Get comprehensive stats for owner dashboard
  static async getOwnerStats(ownerId: number): Promise<OwnerStats> {
    try {
      const statsQuery = `
        WITH owner_venues AS (
          SELECT id FROM venues WHERE owner_id = $1 AND is_active = true
        ),
        total_bookings AS (
          SELECT COUNT(*) as count
          FROM bookings b
          JOIN courts c ON b.court_id = c.id
          JOIN owner_venues ov ON c.venue_id = ov.id
          WHERE b.status IN ('confirmed', 'completed')
        ),
        total_earnings AS (
          SELECT COALESCE(SUM(b.total_amount), 0) as amount
          FROM bookings b
          JOIN courts c ON b.court_id = c.id
          JOIN owner_venues ov ON c.venue_id = ov.id
          WHERE b.status IN ('confirmed', 'completed')
          AND b.payment_status = 'paid'
        ),
        monthly_revenue AS (
          SELECT COALESCE(SUM(b.total_amount), 0) as amount
          FROM bookings b
          JOIN courts c ON b.court_id = c.id
          JOIN owner_venues ov ON c.venue_id = ov.id
          WHERE b.status IN ('confirmed', 'completed')
          AND b.payment_status = 'paid'
          AND b.booking_date >= DATE_TRUNC('month', CURRENT_DATE)
        ),
        today_bookings AS (
          SELECT COUNT(*) as count
          FROM bookings b
          JOIN courts c ON b.court_id = c.id
          JOIN owner_venues ov ON c.venue_id = ov.id
          WHERE b.booking_date = CURRENT_DATE
          AND b.status IN ('confirmed', 'completed')
        ),
        pending_payments AS (
          SELECT COALESCE(SUM(b.total_amount), 0) as amount
          FROM bookings b
          JOIN courts c ON b.court_id = c.id
          JOIN owner_venues ov ON c.venue_id = ov.id
          WHERE b.status = 'confirmed'
          AND b.payment_status = 'pending'
        ),
        court_stats AS (
          SELECT 
            COUNT(*) as total_courts,
            COUNT(DISTINCT ov.id) as active_facilities
          FROM courts c
          JOIN owner_venues ov ON c.venue_id = ov.id
          WHERE c.is_active = true
        )
        SELECT 
          tb.count as total_bookings,
          te.amount as total_earnings,
          cs.active_facilities,
          cs.total_courts,
          mr.amount as monthly_revenue,
          tdb.count as today_bookings,
          pp.amount as pending_payments,
          CASE 
            WHEN cs.total_courts > 0 THEN 
              ROUND((tdb.count::decimal / cs.total_courts) * 100, 2)
            ELSE 0 
          END as occupancy_rate
        FROM total_bookings tb, total_earnings te, monthly_revenue mr, 
             today_bookings tdb, pending_payments pp, court_stats cs
      `

      const result = await executeQuerySingle(statsQuery, [ownerId])
      
      return {
        totalBookings: parseInt(result?.total_bookings || 0),
        totalEarnings: parseFloat(result?.total_earnings || 0),
        activeFacilities: parseInt(result?.active_facilities || 0),
        totalCourts: parseInt(result?.total_courts || 0),
        monthlyRevenue: parseFloat(result?.monthly_revenue || 0),
        todayBookings: parseInt(result?.today_bookings || 0),
        pendingPayments: parseFloat(result?.pending_payments || 0),
        occupancyRate: parseFloat(result?.occupancy_rate || 0)
      }
    } catch (error) {
      console.error('Error fetching owner stats:', error)
      throw error
    }
  }

  // Get booking trends for charts
  static async getBookingTrends(ownerId: number, days: number = 7): Promise<BookingTrend[]> {
    try {
      const trendsQuery = `
        WITH date_series AS (
          SELECT 
            generate_series(
              CURRENT_DATE - INTERVAL '${days} days',
              CURRENT_DATE,
              '1 day'::interval
            )::date as date
        ),
        owner_venues AS (
          SELECT id FROM venues WHERE owner_id = $1 AND is_active = true
        ),
        daily_stats AS (
          SELECT 
            b.booking_date,
            COUNT(*) as bookings,
            COALESCE(SUM(b.total_amount), 0) as earnings
          FROM bookings b
          JOIN courts c ON b.court_id = c.id
          JOIN owner_venues ov ON c.venue_id = ov.id
          WHERE b.booking_date >= CURRENT_DATE - INTERVAL '${days} days'
          AND b.status IN ('confirmed', 'completed')
          GROUP BY b.booking_date
        )
        SELECT 
          TO_CHAR(ds.date, 'Mon DD') as date,
          COALESCE(dst.bookings, 0) as bookings,
          COALESCE(dst.earnings, 0) as earnings
        FROM date_series ds
        LEFT JOIN daily_stats dst ON ds.date = dst.booking_date
        ORDER BY ds.date
      `

      const results = await executeQuery(trendsQuery, [ownerId])
      return results.map((row: any) => ({
        date: row.date,
        bookings: parseInt(row.bookings),
        earnings: parseFloat(row.earnings)
      }))
    } catch (error) {
      console.error('Error fetching booking trends:', error)
      throw error
    }
  }

  // Get peak hours data
  static async getPeakHours(ownerId: number): Promise<PeakHour[]> {
    try {
      const peakHoursQuery = `
        WITH owner_venues AS (
          SELECT id FROM venues WHERE owner_id = $1 AND is_active = true
        ),
        hourly_bookings AS (
          SELECT 
            EXTRACT(HOUR FROM b.start_time) as hour,
            COUNT(*) as bookings
          FROM bookings b
          JOIN courts c ON b.court_id = c.id
          JOIN owner_venues ov ON c.venue_id = ov.id
          WHERE b.booking_date >= CURRENT_DATE - INTERVAL '30 days'
          AND b.status IN ('confirmed', 'completed')
          GROUP BY EXTRACT(HOUR FROM b.start_time)
        ),
        hour_series AS (
          SELECT generate_series(6, 22) as hour
        )
        SELECT 
          LPAD(hs.hour::text, 2, '0') || ':00' as hour,
          COALESCE(hb.bookings, 0) as bookings
        FROM hour_series hs
        LEFT JOIN hourly_bookings hb ON hs.hour = hb.hour
        ORDER BY hs.hour
      `

      const results = await executeQuery(peakHoursQuery, [ownerId])
      return results.map((row: any) => ({
        hour: row.hour,
        bookings: parseInt(row.bookings)
      }))
    } catch (error) {
      console.error('Error fetching peak hours:', error)
      throw error
    }
  }

  // Get recent bookings
  static async getRecentBookings(ownerId: number, limit: number = 10): Promise<RecentBooking[]> {
    try {
      const recentBookingsQuery = `
        SELECT 
          b.id,
          u.full_name as user_name,
          u.email as user_email,
          c.name as court_name,
          v.name as venue_name,
          TO_CHAR(b.booking_date, 'YYYY-MM-DD') as date,
          TO_CHAR(b.start_time, 'HH24:MI') || '-' || TO_CHAR(b.end_time, 'HH24:MI') as time,
          b.status,
          b.total_amount as amount,
          b.payment_status
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        JOIN users u ON b.user_id = u.id
        WHERE v.owner_id = $1
        ORDER BY b.created_at DESC
        LIMIT $2
      `

      const results = await executeQuery(recentBookingsQuery, [ownerId, limit])
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
      let whereClause = 'WHERE v.owner_id = $1'
      const params: any[] = [ownerId]
      let paramIndex = 2

      if (status && status !== 'all') {
        whereClause += ` AND b.status = $${paramIndex}`
        params.push(status)
        paramIndex++
      }

      if (dateFrom) {
        whereClause += ` AND b.booking_date >= $${paramIndex}`
        params.push(dateFrom)
        paramIndex++
      }

      if (dateTo) {
        whereClause += ` AND b.booking_date <= $${paramIndex}`
        params.push(dateTo)
        paramIndex++
      }

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        JOIN users u ON b.user_id = u.id
        ${whereClause}
      `

      const countResult = await executeQuerySingle(countQuery, params)
      const total = parseInt(countResult?.total || 0)

      // Get paginated results
      const offset = (page - 1) * limit
      const bookingsQuery = `
        SELECT 
          b.id,
          u.full_name as user_name,
          u.email as user_email,
          u.phone as user_phone,
          c.name as court_name,
          v.name as venue_name,
          TO_CHAR(b.booking_date, 'YYYY-MM-DD') as booking_date,
          TO_CHAR(b.start_time, 'HH24:MI') as start_time,
          TO_CHAR(b.end_time, 'HH24:MI') as end_time,
          b.duration_hours as duration,
          b.total_amount,
          b.status,
          b.payment_status,
          b.payment_method,
          b.special_requests,
          TO_CHAR(b.created_at, 'YYYY-MM-DD HH24:MI') as created_at
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        JOIN venues v ON c.venue_id = v.id
        JOIN users u ON b.user_id = u.id
        ${whereClause}
        ORDER BY b.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `

      params.push(limit, offset)
      const results = await executeQuery(bookingsQuery, params)

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
      const venuesQuery = `
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
        WHERE v.owner_id = $1
        GROUP BY v.id, v.name, v.description, v.address, v.city, v.state, v.pincode, v.phone, v.email, v.is_active
        ORDER BY v.name
      `

      const results = await executeQuery(venuesQuery, [ownerId])
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
        isActive: row.is_active,
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
      let whereClause = 'WHERE v.owner_id = $1'
      const params: any[] = [ownerId]

      if (venueId) {
        whereClause += ' AND v.id = $2'
        params.push(venueId)
      }

      const courtsQuery = `
        SELECT 
          c.id,
          c.venue_id,
          v.name as venue_name,
          c.name,
          c.sport_type,
          c.description,
          c.price_per_hour,
          c.is_active,
          COUNT(CASE WHEN b.booking_date = CURRENT_DATE AND b.status IN ('confirmed', 'completed') THEN 1 END) as bookings_today,
          COALESCE(SUM(CASE WHEN b.booking_date = CURRENT_DATE AND b.status IN ('confirmed', 'completed') THEN b.total_amount ELSE 0 END), 0) as revenue_today,
          ROUND(
            CASE 
              WHEN COUNT(CASE WHEN b.booking_date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) > 0
              THEN (COUNT(CASE WHEN b.booking_date >= CURRENT_DATE - INTERVAL '7 days' AND b.status IN ('confirmed', 'completed') THEN 1 END)::decimal / (7 * 16)) * 100
              ELSE 0 
            END, 2
          ) as occupancy_rate
        FROM courts c
        JOIN venues v ON c.venue_id = v.id
        LEFT JOIN bookings b ON c.id = b.court_id
        ${whereClause}
        GROUP BY c.id, c.venue_id, v.name, c.name, c.sport_type, c.description, c.price_per_hour, c.is_active
        ORDER BY v.name, c.name
      `

      const results = await executeQuery(courtsQuery, params)
      return results.map((row: any) => ({
        id: row.id,
        venueId: row.venue_id,
        venueName: row.venue_name,
        name: row.name,
        sportType: row.sport_type,
        description: row.description || '',
        pricePerHour: parseFloat(row.price_per_hour),
        isActive: row.is_active,
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
