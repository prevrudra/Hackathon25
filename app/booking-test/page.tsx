"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BookingTestPage() {
  const [status, setStatus] = useState("")
  const [testBookingId, setTestBookingId] = useState("")

  const testCreateBooking = async () => {
    setStatus("Testing booking creation...")
    
    try {
      const testBooking = {
        userId: 1, // Amit Singh from sample data
        venueId: 1, // SportZone Arena
        courtId: 1, // Badminton Court 1
        bookingDate: "2025-08-15",
        startTime: "14:00",
        endTime: "15:00", 
        duration: 1,
        pricePerHour: 1200,
        totalAmount: 1200,
        paymentMethod: "card",
        specialRequests: "Test booking from API"
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testBooking)
      })

      if (response.ok) {
        const result = await response.json()
        setTestBookingId(result.bookingId)
        setStatus(`✅ Booking created successfully! ID: ${result.bookingId}`)
      } else {
        const error = await response.json()
        setStatus(`❌ Failed to create booking: ${error.error}`)
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    }
  }

  const testGetBookings = async () => {
    setStatus("Testing booking retrieval...")
    
    try {
      const response = await fetch('/api/bookings?userId=1') // Amit Singh

      if (response.ok) {
        const bookings = await response.json()
        setStatus(`✅ Retrieved ${bookings.length} bookings for user 1`)
        console.log('User bookings:', bookings)
      } else {
        const error = await response.json()
        setStatus(`❌ Failed to get bookings: ${error.error}`)
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    }
  }

  const testOwnerBookings = async () => {
    setStatus("Testing owner bookings...")
    
    try {
      const response = await fetch('/api/owner/bookings?ownerId=1') // Rajesh Kumar

      if (response.ok) {
        const result = await response.json()
        setStatus(`✅ Owner has ${result.bookings.length} bookings (total: ${result.total})`)
        console.log('Owner bookings:', result)
      } else {
        const error = await response.json()
        setStatus(`❌ Failed to get owner bookings: ${error.error}`)
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    }
  }

  const testCancelBooking = async () => {
    if (!testBookingId) {
      setStatus("❌ No booking to cancel. Create a booking first.")
      return
    }

    setStatus("Testing booking cancellation...")
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: testBookingId,
          action: 'cancel',
          userId: 1
        })
      })

      if (response.ok) {
        setStatus(`✅ Booking ${testBookingId} cancelled successfully!`)
      } else {
        const error = await response.json()
        setStatus(`❌ Failed to cancel booking: ${error.error}`)
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Booking API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={testCreateBooking}>
              1. Create Test Booking
            </Button>
            <Button onClick={testGetBookings}>
              2. Get User Bookings
            </Button>
            <Button onClick={testOwnerBookings}>
              3. Get Owner Bookings
            </Button>
            <Button onClick={testCancelBooking} disabled={!testBookingId}>
              4. Cancel Test Booking
            </Button>
          </div>
          
          {status && (
            <div className="p-4 bg-gray-100 rounded">
              <p className="font-mono text-sm">{status}</p>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p><strong>Test Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a test booking for user 1 (Amit Singh)</li>
              <li>Verify user can see their bookings</li>
              <li>Verify owner can see bookings for their venues</li>
              <li>Test booking cancellation functionality</li>
            </ol>
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>Database Users:</strong></p>
            <ul className="list-disc list-inside">
              <li>User ID 1: Amit Singh</li>
              <li>Owner ID 1: Rajesh Kumar (SportZone Arena)</li>
              <li>Owner ID 2: Priya Sharma (Elite Sports Complex)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
