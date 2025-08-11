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

    return NextResponse.json({ venue })
    
  } catch (error) {
    console.error('Error fetching facility:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: facilityId } = await params
    const venueData = await request.json()
    
    // Find the venue/facility
    const venueIndex = mockVenues.findIndex(v => v.id === facilityId)
    
    if (venueIndex === -1) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      )
    }

    // Update venue data (in a real app, this would update the database)
    // Convert sports and amenities back to arrays if they're strings
    const updatedVenue = {
      ...mockVenues[venueIndex],
      ...venueData,
      sports: typeof venueData.sports === 'string' 
        ? venueData.sports.split(',').filter(Boolean) 
        : venueData.sports,
      amenities: typeof venueData.amenities === 'string' 
        ? venueData.amenities.split(',').filter(Boolean) 
        : venueData.amenities
    }

    mockVenues[venueIndex] = updatedVenue

    return NextResponse.json({ 
      message: 'Facility updated successfully',
      venue: updatedVenue
    })
    
  } catch (error) {
    console.error('Error updating facility:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
