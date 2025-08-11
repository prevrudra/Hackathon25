import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/sqlite-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get('venueId')

    if (!venueId) {
      return NextResponse.json(
        { error: 'Venue ID is required' },
        { status: 400 }
      )
    }

    const venueIdInt = parseInt(venueId.toString())
    if (isNaN(venueIdInt)) {
      return NextResponse.json(
        { error: 'Invalid venue ID format' },
        { status: 400 }
      )
    }

    // Fetch courts for the venue
    const courts = executeQuery(`
      SELECT 
        id,
        name,
        sport_type,
        description,
        price_per_hour,
        is_active
      FROM courts
      WHERE venue_id = ? AND is_active = 1
      ORDER BY id
    `, [venueIdInt])

    return NextResponse.json(courts)

  } catch (error) {
    console.error('Error fetching courts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courts' },
      { status: 500 }
    )
  }
}
