import { NextRequest, NextResponse } from 'next/server'
import { OwnerDatabaseService } from '@/lib/sqlite-owner-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      )
    }

    const result = await OwnerDatabaseService.getOwnerBookings(
      parseInt(ownerId),
      status || undefined,
      dateFrom || undefined,
      dateTo || undefined,
      page,
      limit
    )
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching owner bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
