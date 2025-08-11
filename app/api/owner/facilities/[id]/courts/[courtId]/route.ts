import { NextRequest, NextResponse } from 'next/server'
import { mockVenues } from '@/lib/venue-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; courtId: string } }
) {
  try {
    const { id: facilityId, courtId } = await params
    
    // Find the venue/facility
    const venue = mockVenues.find(v => v.id === facilityId)
    
    if (!venue) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      )
    }

    // Find the specific court
    const court = venue.courts.find(c => c.id === courtId)
    
    if (!court) {
      return NextResponse.json(
        { error: 'Court not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ court })
    
  } catch (error) {
    console.error('Error fetching court:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; courtId: string } }
) {
  try {
    const { id: facilityId, courtId } = await params
    const courtData = await request.json()
    
    // Find the venue/facility
    const venue = mockVenues.find(v => v.id === facilityId)
    
    if (!venue) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      )
    }

    // Find and update the specific court
    const courtIndex = venue.courts.findIndex(c => c.id === courtId)
    
    if (courtIndex === -1) {
      return NextResponse.json(
        { error: 'Court not found' },
        { status: 404 }
      )
    }

    // Update court data (in a real app, this would update the database)
    venue.courts[courtIndex] = { ...venue.courts[courtIndex], ...courtData }

    return NextResponse.json({ 
      message: 'Court updated successfully',
      court: venue.courts[courtIndex]
    })
    
  } catch (error) {
    console.error('Error updating court:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
