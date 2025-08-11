"use client"

import { useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { mockVenues } from "@/lib/venue-data"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { format, addDays, isAfter, isBefore } from "date-fns"

export default function BookCourtPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const venueId = params.id as string
  const preselectedCourtId = searchParams.get("court")

  const venue = mockVenues.find((v) => v.id === venueId)

  const [selectedCourt, setSelectedCourt] = useState(preselectedCourtId || "")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [duration, setDuration] = useState(1)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState("")

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Venue not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const selectedCourtData = venue.courts.find((c) => c.id === selectedCourt)

  // Generate time slots (simplified - every hour from 6 AM to 11 PM)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 6; hour <= 22; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`
      const endHour = hour + duration
      const endTimeString = `${endHour.toString().padStart(2, "0")}:00`

      if (endHour <= 23) {
        slots.push(`${timeString}-${endTimeString}`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const totalPrice = selectedCourtData ? selectedCourtData.pricePerHour * duration : 0

  const handleBooking = async () => {
    setError("")

    if (!selectedCourt || !selectedDate || !selectedTimeSlot) {
      setError("Please select all required fields")
      return
    }

    setIsBooking(true)

    // Simulate booking API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate successful booking
    const bookingId = `booking_${Date.now()}`

    // In a real app, this would save to database
    const newBooking = {
      id: bookingId,
      userId: user.id,
      venueId: venue.id,
      courtId: selectedCourt,
      date: format(selectedDate, "yyyy-MM-dd"),
      timeSlot: selectedTimeSlot,
      duration,
      totalPrice,
      status: "confirmed" as const,
      createdAt: new Date().toISOString(),
    }

    // Store in localStorage for demo
    const existingBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
    existingBookings.push(newBooking)
    localStorage.setItem("user_bookings", JSON.stringify(existingBookings))

    setIsBooking(false)

    // Redirect to success page
    router.push(`/booking-success?id=${bookingId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Book Court</h1>
              <p className="text-muted-foreground">{venue.name}</p>
            </div>
            <Button variant="ghost" onClick={() => router.back()}>
              ← Back
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Court Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Court</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {venue.courts.map((court) => (
                    <div
                      key={court.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedCourt === court.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedCourt(court.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{court.name}</h3>
                        <Badge variant="outline">{court.sportType}</Badge>
                      </div>
                      <p className="text-2xl font-bold text-primary">₹{court.pricePerHour}/hr</p>
                      <p className="text-sm text-muted-foreground">
                        {court.operatingHours.start} - {court.operatingHours.end}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => isBefore(date, new Date()) || isAfter(date, addDays(new Date(), 30))}
                  className="rounded-md border"
                />
                <p className="text-sm text-muted-foreground mt-2">You can book up to 30 days in advance</p>
              </CardContent>
            </Card>

            {/* Time & Duration Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Time & Duration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue:</span>
                    <span className="font-medium">{venue.name}</span>
                  </div>

                  {selectedCourtData && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Court:</span>
                      <span className="font-medium">{selectedCourtData.name}</span>
                    </div>
                  )}

                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{format(selectedDate, "MMM dd, yyyy")}</span>
                    </div>
                  )}

                  {selectedTimeSlot && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{selectedTimeSlot}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {duration} hour{duration > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  className="w-full"
                  onClick={handleBooking}
                  disabled={isBooking || !selectedCourt || !selectedDate || !selectedTimeSlot}
                >
                  {isBooking ? "Processing..." : "Confirm Booking"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By booking, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
