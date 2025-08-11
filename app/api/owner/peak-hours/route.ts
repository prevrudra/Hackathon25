import { NextRequest, NextResponse } from 'next/server'
import { OwnerDatabaseService } from '@/lib/sqlite-owner-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      )
    }

    const peakHours = await OwnerDatabaseService.getPeakHours(parseInt(ownerId))
    
    return NextResponse.json(peakHours)
  } catch (error) {
    console.error('Error fetching peak hours:', error)
    return NextResponse.json(
      { error: 'Failed to fetch peak hours data' },
      { status: 500 }
    )
  }
}
