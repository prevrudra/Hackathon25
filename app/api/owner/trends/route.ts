import { NextRequest, NextResponse } from 'next/server'
import { OwnerDatabaseService } from '@/lib/sqlite-owner-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    const days = searchParams.get('days') || '7'

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      )
    }

    const trends = await OwnerDatabaseService.getBookingTrends(
      parseInt(ownerId), 
      parseInt(days)
    )
    
    return NextResponse.json(trends)
  } catch (error) {
    console.error('Error fetching booking trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking trends' },
      { status: 500 }
    )
  }
}
