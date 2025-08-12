"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
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
  const [unavailableSlots, setUnavailableSlots] = useState<Array<{
    startTime: string
    endTime: string
    bookedBy: string
    isOwnBooking: boolean
  }>>([])
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  // Handle authentication redirect
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Check availability when court or date changes
  useEffect(() => {
    if (selectedCourt && selectedDate) {
      checkAvailability()
    }
  }, [selectedCourt, selectedDate])

  const checkAvailability = async () => {
    if (!selectedCourt || !selectedDate) return

    setCheckingAvailability(true)
    try {
      const response = await fetch(
        `/api/bookings/availability?courtId=${selectedCourt}&date=${format(selectedDate, "yyyy-MM-dd")}`
      )
      
      if (response.ok) {
        const data = await response.json()
        const currentUserId = parseInt(user?.id || '0')
        const slotsWithUserCheck = data.unavailableSlots.map((slot: any) => ({
          ...slot,
          isOwnBooking: data.bookings.some((booking: any) => 
            booking.user_id === currentUserId &&
            booking.start_time === slot.startTime &&
            booking.end_time === slot.endTime
          )
        }))
        setUnavailableSlots(slotsWithUserCheck)
      }
    } catch (error) {
      console.error('Failed to check availability:', error)
    } finally {
      setCheckingAvailability(false)
    }
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Venue not found</h1>
            <p className="mt-2 text-gray-600">The venue you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
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
        const slotId = `${timeString}-${endTimeString}`
        
        // Check if this slot conflicts with existing bookings
        const hasConflict = unavailableSlots.some(unavailableSlot => {
          const unavailableStart = unavailableSlot.startTime
          const unavailableEnd = unavailableSlot.endTime
          
          // Check for any overlap
          return (
            (timeString < unavailableEnd && endTimeString > unavailableStart)
          )
        })
        
        const conflictInfo = unavailableSlots.find(unavailableSlot => {
          const unavailableStart = unavailableSlot.startTime
          const unavailableEnd = unavailableSlot.endTime
          
          return (timeString < unavailableEnd && endTimeString > unavailableStart)
        })
        
        slots.push({
          id: slotId,
          label: slotId,
          isAvailable: !hasConflict,
          conflictInfo: conflictInfo || null
        })
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const totalPrice = selectedCourtData ? selectedCourtData.pricePerHour * duration : 0

  const handleBooking = async () => {
    setError("")

    if (!selectedCourt || !selectedDate || !selectedTimeSlot || !user) {
      setError("Please select all required fields")
      return
    }

    // Check if the selected slot is available
    const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeSlot)
    if (!selectedSlot?.isAvailable) {
      setError("The selected time slot is no longer available. Please choose a different time.")
      return
    }

    setIsBooking(true)

    try {
      // Parse time slot to get start and end times
      const [startTime, endTime] = selectedTimeSlot.split('-')
      const selectedCourtData = venue.courts.find((c) => c.id === selectedCourt)
      
      if (!selectedCourtData) {
        setError("Selected court not found")
        setIsBooking(false)
        return
      }

      // Create booking in SQLite database
      const bookingData = {
        userId: user.id,
        venueId: venue.id,
        courtId: selectedCourt,
        bookingDate: format(selectedDate, "yyyy-MM-dd"),
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        pricePerHour: selectedCourtData.pricePerHour,
        totalAmount: totalPrice,
        paymentMethod: 'card',
        specialRequests: ''
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle specific booking conflict scenarios
        if (response.status === 409) {
          switch (result.code) {
            case 'USER_ALREADY_BOOKED':
              setError('You have already booked this exact time slot. You can view your existing bookings in "My Bookings".')
              break
            case 'USER_OVERLAP_CONFLICT':
              setError(result.error + ' You can view and manage your bookings in "My Bookings".')
              break
            case 'SLOT_UNAVAILABLE':
              setError('Sorry, this time slot has been taken by another user. Please select a different time.')
              break
            case 'SLOT_OVERLAP_CONFLICT':
              setError(result.error + ' Please choose a different time.')
              break
            default:
              setError(result.error || 'This time slot is no longer available.')
          }
        } else {
          setError(result.error || 'Failed to create booking')
        }
        setIsBooking(false)
        return
      }
      const bookingId = result.bookingId

      // Also save to localStorage for backward compatibility (fallback for user bookings page)
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

      const existingBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
      existingBookings.push(newBooking)
      localStorage.setItem("user_bookings", JSON.stringify(existingBookings))

      setIsBooking(false)

      // Redirect to success page
      router.push(`/booking-success?id=${bookingId}`)

    } catch (error) {
      console.error('Booking failed:', error)
      setError(error instanceof Error ? error.message : 'Booking failed. Please try again.')
      setIsBooking(false)
    }
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
                  {checkingAvailability && (
                    <div className="text-sm text-gray-500 mb-2">
                      Checking availability...
                    </div>
                  )}
                  <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem 
                          key={slot.id} 
                          value={slot.id}
                          disabled={!slot.isAvailable}
                          className={!slot.isAvailable ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{slot.label}</span>
                            {!slot.isAvailable && slot.conflictInfo && (
                              <span className="text-xs text-red-500 ml-2">
                                {slot.conflictInfo.isOwnBooking ? "Your booking" : "Booked"}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedTimeSlot && !timeSlots.find(s => s.id === selectedTimeSlot)?.isAvailable && (
                    <Alert className="mt-2">
                      <AlertDescription className="text-red-600">
                        This time slot is not available. Please choose a different time.
                      </AlertDescription>
                    </Alert>
                  )}
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
                    <AlertDescription>
                      {error}
                      {(error.includes("already booked") || error.includes("overlaps")) && (
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="bg-white" asChild>
                            <Link href="/my-bookings">View My Bookings</Link>
                          </Button>
                        </div>
                      )}
                    </AlertDescription>
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
