import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
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
  }
}
