import { NextRequest, NextResponse } from 'next/server'
import { mockVenues } from '@/lib/venue-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: facilityId } = await params
    
    // Find the venue/facility
    const venue = mockVenues.find(v => v.id === facilityId)
    
    if (!venue) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      )
    }

    // Return the courts for this facility
    return NextResponse.json({
      courts: venue.courts
    })
    
  } catch (error) {
    console.error('Error fetching facility courts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
