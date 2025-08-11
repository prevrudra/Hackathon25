import { NextRequest, NextResponse } from 'next/server'
import { approveVenue, rejectVenue } from '@/lib/admin-database'

export async function POST(request: NextRequest) {
  try {
    const { action, venueId, reason } = await request.json()

    if (action === 'approve') {
      const success = await approveVenue(venueId)
      if (success) {
        return NextResponse.json({ success: true, message: 'Venue approved successfully' })
      } else {
        return NextResponse.json({ error: 'Failed to approve venue' }, { status: 500 })
      }
    } else if (action === 'reject') {
      const success = await rejectVenue(venueId, reason)
      if (success) {
        return NextResponse.json({ success: true, message: 'Venue rejected successfully' })
      } else {
        return NextResponse.json({ error: 'Failed to reject venue' }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in venue approval API:', error)
    return NextResponse.json(
      { error: 'Failed to process venue action' },
      { status: 500 }
    )
  }
}
