import { NextRequest, NextResponse } from 'next/server'
import { executeQuery, executeQuerySingle } from '@/lib/sqlite-database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const venueId = parseInt(params.id)

    if (isNaN(venueId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid venue ID' },
        { status: 400 }
      )
    }

    // Get venue details
    const venue = executeQuerySingle(`
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
        v.amenities,
        v.images,
        v.latitude,
        v.longitude,
        v.is_active,
        v.created_at,
        v.updated_at
      FROM venues v
      WHERE v.id = ? AND v.is_active = 1
    `, [venueId])

    if (!venue) {
      return NextResponse.json(
        { success: false, message: 'Venue not found' },
        { status: 404 }
      )
    }

    // Get courts for this venue
    const courts = executeQuery(`
      SELECT 
        id,
        name,
        sport_type as type,
        price_per_hour,
        is_active
      FROM courts 
      WHERE venue_id = ? AND is_active = 1
      ORDER BY name ASC
    `, [venueId])

    // Get recent reviews (table might not exist yet, so handle gracefully)
    let reviews = []
    try {
      reviews = executeQuery(`
        SELECT 
          r.id,
          r.rating,
          r.comment,
          r.created_at,
          u.full_name as user_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.venue_id = ?
        ORDER BY r.created_at DESC
        LIMIT 10
      `, [venueId])
    } catch (reviewError) {
      console.log('Reviews table not available:', reviewError)
    }

    const venueWithDetails = {
      ...venue,
      courts: courts || [],
      reviews: reviews || [],
      amenities: venue.amenities ? venue.amenities.split(',') : [],
      rating: 4.2, // Default rating for now
      total_reviews: Math.floor(Math.random() * 50) + 10, // Random reviews for now
      image_url: venue.images || null
    }

    return NextResponse.json({
      success: true,
      venue: venueWithDetails
    })

  } catch (error) {
    console.error('Error fetching venue:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch venue details' },
      { status: 500 }
    )
  }
}
