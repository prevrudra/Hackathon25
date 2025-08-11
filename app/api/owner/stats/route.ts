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

    const stats = await OwnerDatabaseService.getOwnerStats(parseInt(ownerId))
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching owner stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch owner statistics' },
      { status: 500 }
    )
  }
}
