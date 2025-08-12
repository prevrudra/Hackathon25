import { NextResponse } from 'next/server'
import { getAdminStats, getDetailedReports } from '@/lib/admin-database'

export async function GET() {
  try {
    const stats = await getAdminStats()
    const detailedReports = await getDetailedReports()
    
    return NextResponse.json({
      ...stats,
      ...detailedReports
    })
  } catch (error) {
    console.error('Error in admin reports API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin reports' },
      { status: 500 }
    )
  }
}
