import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/sqlite-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courtId = searchParams.get('courtId')
    const date = searchParams.get('date')

    if (!courtId || !date) {
      return NextResponse.json(
        { error: 'Missing courtId or date parameter' },
        { status: 400 }
      )
    }

    // Handle court ID conversion - frontend sends "c1", "c2" etc., database uses integers
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
      courtIdInt = parseInt(courtId)
    }

    if (isNaN(courtIdInt)) {
      return NextResponse.json(
        { error: 'Invalid court ID format' },
        { status: 400 }
      )
    }

    // Get all existing bookings for this court on this date
    const existingBookings = executeQuery(`
      SELECT 
        b.id, b.user_id, b.start_time, b.end_time, b.status,
        COALESCE(u.full_name, 'Unknown User') as user_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.court_id = ? 
      AND b.booking_date = ? 
      AND b.status IN ('confirmed', 'pending')
      ORDER BY b.start_time
    `, [courtIdInt, date])

    return NextResponse.json({
      success: true,
      bookings: existingBookings,
      unavailableSlots: existingBookings.map(booking => ({
        startTime: booking.start_time,
        endTime: booking.end_time,
        bookedBy: booking.user_name || 'User',
        isOwnBooking: false // This will be set on the frontend based on current user
      }))
    })

  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
