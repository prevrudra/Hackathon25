import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/database"

export async function GET() {
  try {
    const users = db
      .prepare(`
      SELECT id, email, fullName, role, isVerified, isBanned, createdAt
      FROM users
      WHERE role != 'admin'
      ORDER BY createdAt DESC
    `)
      .all()

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, userId } = await request.json()

    if (action === "ban") {
      db.prepare(`
        UPDATE users 
        SET isBanned = TRUE 
        WHERE id = ?
      `).run(userId)

      return NextResponse.json({ success: true, message: "User banned successfully" })
    } else if (action === "unban") {
      db.prepare(`
        UPDATE users 
        SET isBanned = FALSE 
        WHERE id = ?
      `).run(userId)

      return NextResponse.json({ success: true, message: "User unbanned successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing user:", error)
    return NextResponse.json({ error: "Failed to process user" }, { status: 500 })
  }
}
