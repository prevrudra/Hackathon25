import { type NextRequest, NextResponse } from "next/server"
import { getPlatformUsers, banUser, unbanUser } from '@/lib/admin-database'

export async function GET() {
  try {
    const users = await getPlatformUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error in platform users API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, userId, reason } = await request.json()

    if (action === "ban") {
      const success = await banUser(userId, reason)
      if (success) {
        return NextResponse.json({ 
          success: true, 
          message: `User banned successfully${reason ? ` - Reason: ${reason}` : ''}` 
        })
      } else {
        return NextResponse.json({ error: "Failed to ban user" }, { status: 500 })
      }
    } else if (action === "unban") {
      const success = await unbanUser(userId)
      if (success) {
        return NextResponse.json({ success: true, message: "User unbanned successfully" })
      } else {
        return NextResponse.json({ error: "Failed to unban user" }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing user:", error)
    return NextResponse.json({ error: "Failed to process user" }, { status: 500 })
  }
}
