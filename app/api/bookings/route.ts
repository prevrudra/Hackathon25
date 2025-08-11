<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/sqlite-database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      venueId,
      courtId,
      bookingDate,
      startTime,
      endTime,
      duration,
      pricePerHour,
      totalAmount,
      paymentMethod = 'card',
      specialRequests = ''
    } = body

    // Validate required fields
    if (!userId || !venueId || !courtId || !bookingDate || !startTime || !endTime || !duration || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert string IDs to integers for database compatibility
    const userIdInt = parseInt(userId.toString())
    const venueIdInt = parseInt(venueId.toString())
    
    // Handle court ID conversion - mock data uses "c1", "c2" etc., database uses integers
    let courtIdInt: number
    if (typeof courtId === 'string' && courtId.startsWith('c')) {
      // Extract number from "c1", "c2" etc. and map to database court IDs
      const courtNum = parseInt(courtId.substring(1))
      if (isNaN(courtNum)) {
        return NextResponse.json(
          { error: 'Invalid court ID format' },
          { status: 400 }
        )
      }
      
      // Simple direct mapping: c1->1, c2->2, c3->3, etc.
      courtIdInt = courtNum
    } else {
      courtIdInt = parseInt(courtId.toString())
    }

    if (isNaN(userIdInt) || isNaN(venueIdInt) || isNaN(courtIdInt)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    // Check if the time slot is already booked by anyone
    const existingSlotBooking = executeQuery(`
      SELECT id, user_id FROM bookings 
      WHERE court_id = ? 
      AND booking_date = ? 
      AND start_time = ? 
      AND end_time = ? 
      AND status IN ('confirmed', 'pending')
    `, [courtIdInt, bookingDate, startTime, endTime])

    if (existingSlotBooking.length > 0) {
      const existingBooking = existingSlotBooking[0]
      
      // Check if the same user is trying to book again
      if (existingBooking.user_id === userIdInt) {
        return NextResponse.json(
          { 
            error: 'You have already booked this time slot',
            code: 'USER_ALREADY_BOOKED'
          },
          { status: 409 }
        )
      } else {
        return NextResponse.json(
          { 
            error: 'This time slot is already booked by another user',
            code: 'SLOT_UNAVAILABLE'
          },
          { status: 409 }
        )
      }
    }

    // Check for overlapping bookings for the same court
    const overlappingBookings = executeQuery(`
      SELECT id, user_id, start_time, end_time FROM bookings 
      WHERE court_id = ? 
      AND booking_date = ? 
      AND status IN ('confirmed', 'pending')
      AND (
        (start_time < ? AND end_time > ?) OR
        (start_time < ? AND end_time > ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `, [
      courtIdInt, bookingDate, 
      startTime, startTime,  // New booking starts during existing booking
      endTime, endTime,      // New booking ends during existing booking  
      startTime, endTime     // New booking encompasses existing booking
    ])

    if (overlappingBookings.length > 0) {
      const overlappingBooking = overlappingBookings[0]
      
      if (overlappingBooking.user_id === userIdInt) {
        return NextResponse.json(
          { 
            error: `You already have a booking from ${overlappingBooking.start_time} to ${overlappingBooking.end_time} on this court`,
            code: 'USER_OVERLAP_CONFLICT'
          },
          { status: 409 }
        )
      } else {
        return NextResponse.json(
          { 
            error: `This time overlaps with an existing booking (${overlappingBooking.start_time} - ${overlappingBooking.end_time})`,
            code: 'SLOT_OVERLAP_CONFLICT'
          },
          { status: 409 }
        )
      }
    }

    // Create the booking
    executeQuery(`
      INSERT INTO bookings (
        user_id, venue_id, court_id, booking_date, start_time, end_time,
        duration_hours, price_per_hour, total_amount, status, payment_status,
        payment_method, special_requests, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 'pending', ?, ?, datetime('now'), datetime('now'))
    `, [
      userIdInt, venueIdInt, courtIdInt, bookingDate, startTime, endTime,
      duration, pricePerHour, totalAmount, paymentMethod, specialRequests
    ])

    // Get the latest booking ID for this user
    const latestBooking = executeQuery(`
      SELECT id FROM bookings 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [userIdInt])[0]

    const bookingId = latestBooking.id

    // Fetch the created booking with venue and court details
    const createdBooking = executeQuery(`
      SELECT 
        b.*,
        u.full_name as user_name,
        u.email as user_email,
        v.name as venue_name,
        c.name as court_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN venues v ON b.venue_id = v.id
      JOIN courts c ON b.court_id = c.id
      WHERE b.id = ?
    `, [bookingId])[0]

    return NextResponse.json({ 
      success: true,
      bookingId: bookingId.toString(),
      booking: createdBooking
    })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, action, userId } = body

    if (!bookingId || !action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (action === 'cancel') {
      // Convert IDs to integers
      const bookingIdInt = parseInt(bookingId.toString())
      const userIdInt = parseInt(userId.toString())

      if (isNaN(bookingIdInt) || isNaN(userIdInt)) {
        return NextResponse.json(
          { error: 'Invalid ID format' },
          { status: 400 }
        )
      }

      // Verify the booking belongs to the user
      const booking = executeQuery(`
        SELECT id, status FROM bookings 
        WHERE id = ? AND user_id = ?
      `, [bookingIdInt, userIdInt])[0]

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found or unauthorized' },
          { status: 404 }
        )
      }

      if (booking.status === 'cancelled') {
        return NextResponse.json(
          { error: 'Booking is already cancelled' },
          { status: 400 }
        )
      }

      // Cancel the booking
      executeQuery(`
        UPDATE bookings 
        SET status = 'cancelled', 
            cancelled_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ? AND user_id = ?
      `, [bookingIdInt, userIdInt])

      return NextResponse.json({ 
        success: true,
        message: 'Booking cancelled successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
=======
import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/database"
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
<<<<<<< HEAD
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Convert userId to integer
    const userIdInt = parseInt(userId.toString())
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    // Fetch user bookings
    const bookings = executeQuery(`
      SELECT 
        b.id,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.duration_hours as duration,
        b.total_amount,
        b.status,
        b.payment_status,
        b.payment_method,
        b.special_requests,
        b.created_at,
        v.id as venue_id,
        v.name as venue_name,
        c.id as court_id,
        c.name as court_name,
        c.sport_type
      FROM bookings b
      JOIN venues v ON b.venue_id = v.id
      JOIN courts c ON b.court_id = c.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [userIdInt])

    return NextResponse.json(bookings)

  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
=======
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const bookings = db
      .prepare(`
      SELECT b.*, v.name as venueName, c.name as courtName, c.sportType
      FROM bookings b
      JOIN venues v ON b.venueId = v.id
      JOIN courts c ON b.courtId = c.id
      WHERE b.userId = ?
      ORDER BY b.createdAt DESC
    `)
      .all(userId)

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, bookingId } = await request.json()

    if (action === "cancel") {
      db.prepare(`
        UPDATE bookings 
        SET status = 'cancelled' 
        WHERE id = ?
      `).run(bookingId)

      return NextResponse.json({ success: true, message: "Booking cancelled successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing booking:", error)
    return NextResponse.json({ error: "Failed to process booking" }, { status: 500 })
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
  }
}
