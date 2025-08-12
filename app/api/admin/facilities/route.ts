import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const url = new URL('http://localhost' + (typeof window !== 'undefined' ? window.location.pathname : '/'));
    const status = url.searchParams.get('status') || 'pending';

    let whereClause = '';
    if (status === 'pending') {
      whereClause = 'WHERE v.isPending = TRUE AND v.isApproved = FALSE';
    } else if (status === 'approved') {
      whereClause = 'WHERE v.isPending = FALSE AND v.isApproved = TRUE';
    } else if (status === 'rejected') {
      whereClause = 'WHERE v.isPending = FALSE AND v.isApproved = FALSE';
    }

    const venues = await executeQuery(`
      SELECT v.*, u.fullName as ownerName, u.email as ownerEmail,
        (SELECT COUNT(*) FROM courts c WHERE c.venueId = v.id) as courts
      FROM venues v
      JOIN users u ON v.ownerId = u.id
      ${whereClause}
    `);

    const formattedVenues = venues.map((venue: any) => ({
      id: venue.id,
      name: venue.name,
      description: venue.description,
      location: venue.address,
      ownerName: venue.ownerName,
      ownerEmail: venue.ownerEmail,
      sports: JSON.parse(venue.sports || '[]'),
      amenities: JSON.parse(venue.amenities || '[]'),
      images: JSON.parse(venue.images || '[]'),
      courts: venue.courts,
      submittedAt: venue.createdAt,
      status: status,
      rejectionReason: venue.rejectionReason || null,
    }));

    return NextResponse.json(formattedVenues);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, facilityId, comment } = await request.json()

    if (action === "approve") {
      await executeQuery(
        `UPDATE venues SET isApproved = TRUE, isPending = FALSE WHERE id = $1`,
        [facilityId]
      );

      return NextResponse.json({ success: true, message: "Facility approved successfully" })
    } else if (action === "reject") {
      await executeQuery(
        `UPDATE venues SET isApproved = FALSE, isPending = FALSE, rejectionReason = $1 WHERE id = $2`,
        [comment, facilityId]
      );

      return NextResponse.json({ success: true, message: "Facility rejected successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing facility:", error)
    return NextResponse.json({ error: "Failed to process facility" }, { status: 500 })
  }
}
