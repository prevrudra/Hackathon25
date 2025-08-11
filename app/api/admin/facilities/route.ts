import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/database"

export async function GET() {
  try {
    const pendingVenues = db
      .prepare(`
      SELECT v.*, u.fullName as ownerName, u.email as ownerEmail
      FROM venues v
      JOIN users u ON v.ownerId = u.id
      WHERE v.isPending = TRUE AND v.isApproved = FALSE
    `)
      .all()

    const formattedVenues = pendingVenues.map((venue: any) => ({
      id: venue.id,
      name: venue.name,
      description: venue.description,
      location: venue.address,
      ownerName: venue.ownerName,
      ownerEmail: venue.ownerEmail,
      sports: JSON.parse(venue.sports || "[]"),
      amenities: JSON.parse(venue.amenities || "[]"),
      images: JSON.parse(venue.images || "[]"),
      courts: 1, // Simplified for now
      submittedAt: venue.createdAt,
    }))

    return NextResponse.json(formattedVenues)
  } catch (error) {
    console.error("Error fetching pending facilities:", error)
    return NextResponse.json({ error: "Failed to fetch facilities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, facilityId, comment } = await request.json()

    if (action === "approve") {
      db.prepare(`
        UPDATE venues 
        SET isApproved = TRUE, isPending = FALSE 
        WHERE id = ?
      `).run(facilityId)

      return NextResponse.json({ success: true, message: "Facility approved successfully" })
    } else if (action === "reject") {
      db.prepare(`
        UPDATE venues 
        SET isApproved = FALSE, isPending = FALSE, rejectionReason = ?
        WHERE id = ?
      `).run(comment, facilityId)

      return NextResponse.json({ success: true, message: "Facility rejected successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing facility:", error)
    return NextResponse.json({ error: "Failed to process facility" }, { status: 500 })
  }
}
