import { NextResponse } from 'next/server'
import { initializeDatabase, seedDatabase } from '@/lib/sqlite-database'

export async function POST() {
  try {
    initializeDatabase()
    seedDatabase()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized and seeded successfully' 
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
}
