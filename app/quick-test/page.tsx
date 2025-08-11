"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DevTools() {
  const addPastBookings = () => {
    const currentUser = JSON.parse(localStorage.getItem("quickcourt_user") || "null")
    if (!currentUser) {
      alert("Please log in first!")
      return
    }

    const pastBookings = [
      {
        id: `past_booking_1_${Date.now()}`,
        userId: currentUser.id,
        venueId: "1", // SportZone Arena
        courtId: "c3", // TT Table 1
        date: "2025-08-05", // Past date (6 days ago)
        timeSlot: "18:00-19:00",
        duration: 1,
        totalPrice: 800,
        status: "completed",
        createdAt: new Date().toISOString(),
      },
      {
        id: `past_booking_2_${Date.now()}`,
        userId: currentUser.id,
        venueId: "2", // Elite Sports Complex
        courtId: "c4", // Badminton Court 1
        date: "2025-08-08", // Past date (3 days ago)
        timeSlot: "16:00-17:00",
        duration: 1,
        totalPrice: 2500,
        status: "completed",
        createdAt: new Date().toISOString(),
      }
    ]

    const existingBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
    existingBookings.push(...pastBookings)
    localStorage.setItem("user_bookings", JSON.stringify(existingBookings))
    
    alert(`Added ${pastBookings.length} past bookings! Go to My Bookings > Past tab to see review buttons.`)
  }

  const clearAllData = () => {
    localStorage.removeItem("user_bookings")
    localStorage.removeItem("venue_reviews")
    alert("Cleared all data! Refresh the page.")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Quick Test Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={addPastBookings} className="w-full">
            Add Past Bookings (to test reviews)
          </Button>
          
          <Button onClick={clearAllData} variant="destructive" className="w-full">
            Clear All Test Data
          </Button>

          <div className="text-sm text-gray-600 mt-4">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Add Past Bookings"</li>
              <li>Go to My Bookings page</li>
              <li>Click "Past" tab</li>
              <li>You'll see "Add Review" buttons</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
