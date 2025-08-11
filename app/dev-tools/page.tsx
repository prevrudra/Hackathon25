"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DevTools() {
  const clearAllData = () => {
    localStorage.removeItem("user_bookings")
    localStorage.removeItem("venue_reviews")
    localStorage.removeItem("quickcourt_user")
    localStorage.removeItem("quickcourt_pending_user")
    alert("All localStorage data cleared!")
    window.location.reload()
  }

  const addTestBookings = () => {
    const currentUser = JSON.parse(localStorage.getItem("quickcourt_user") || "null")
    if (!currentUser) {
      alert("Please log in first to add test bookings")
      return
    }

    const testBookings = [
      {
        id: `test_booking_${Date.now()}`,
        userId: currentUser.id,
        venueId: "1", // SportZone Arena
        courtId: "c1",
        date: "2024-12-10", // Past date
        timeSlot: "18:00-19:00",
        duration: 1,
        totalPrice: 1200,
        status: "completed",
        createdAt: new Date().toISOString(),
      },
      {
        id: `test_booking_${Date.now() + 1}`,
        userId: currentUser.id,
        venueId: "2", // Elite Sports Complex
        courtId: "c4",
        date: "2024-12-12", // Past date
        timeSlot: "16:00-17:00",
        duration: 1,
        totalPrice: 2500,
        status: "completed",
        createdAt: new Date().toISOString(),
      }
    ]

    const existingBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
    existingBookings.push(...testBookings)
    localStorage.setItem("user_bookings", JSON.stringify(existingBookings))
    
    alert(`Added ${testBookings.length} test past bookings. Go to My Bookings to see them.`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Developer Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={clearAllData} variant="destructive">
            Clear All Data
          </Button>
          
          <Button onClick={addTestBookings} variant="default">
            Add Test Past Bookings (Login Required)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
