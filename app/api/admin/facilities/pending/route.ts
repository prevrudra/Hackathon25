import { NextResponse } from 'next/server'
import { getPendingFacilities } from '@/lib/admin-database'

export async function GET() {
  try {
    const facilities = await getPendingFacilities()
    return NextResponse.json(facilities)
  } catch (error) {
    console.error('Error in pending facilities API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending facilities' },
      { status: 500 }
    )
  }
}
