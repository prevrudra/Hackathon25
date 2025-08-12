import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/sqlite-database'

export async function GET(request: NextRequest) {
  try {
    // Get all venues with their courts
    const venues = executeQuery(`
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
      WHERE v.is_active = 1
      ORDER BY v.name ASC
    `)

    // Get courts for each venue
    const venuesWithCourts = venues.map(venue => {
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
      `, [venue.id])

      return {
        ...venue,
        courts: courts || [],
        amenities: venue.amenities ? venue.amenities.split(',') : [],
        rating: 4.2, // Default rating for now
        total_reviews: Math.floor(Math.random() * 50) + 10, // Random reviews for now
        image_url: venue.images || null
      }
    })

    return NextResponse.json({
      success: true,
      venues: venuesWithCourts
    })

  } catch (error) {
    console.error('Error fetching venues:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch venues' },
      { status: 500 }
    )
  }
}
