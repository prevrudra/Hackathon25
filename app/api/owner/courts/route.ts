import { NextRequest, NextResponse } from 'next/server'
import { OwnerDatabaseService } from '@/lib/sqlite-owner-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    const venueId = searchParams.get('venueId')

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      )
    }

    const courts = await OwnerDatabaseService.getOwnerCourts(
      parseInt(ownerId),
      venueId ? parseInt(venueId) : undefined
    )
    
    return NextResponse.json(courts)
  } catch (error) {
    console.error('Error fetching owner courts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courts' },
      { status: 500 }
    )
  }
}
