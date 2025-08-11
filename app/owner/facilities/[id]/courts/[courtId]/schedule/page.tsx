"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { mockVenues } from "@/lib/venue-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function CourtSchedulePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const facilityId = params.id as string
  const courtId = params.courtId as string

  const facility = mockVenues.find((v) => v.id === facilityId && v.ownerId === "2")
  const court = facility?.courts.find((c) => c.id === courtId)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [timeSlots, setTimeSlots] = useState<
    Array<{
      time: string
      status: "available" | "booked" | "blocked"
      bookedBy?: string
    }>
  >([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "facility_owner")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (court && selectedDate) {
      const slots = []
      const startHour = Number.parseInt(court.operatingHours.start.split(":")[0])
      const endHour = Number.parseInt(court.operatingHours.end.split(":")[0])

      for (let hour = startHour; hour < endHour; hour++) {
        const timeString = `${hour.toString().padStart(2, "0")}:00`
        const isBooked = Math.random() > 0.7 // Random booking simulation
        slots.push({
          time: timeString,
          status: isBooked ? "booked" : "available",
          bookedBy: isBooked ? "John Doe" : undefined,
        })
      }
      setTimeSlots(slots)
    }
  }, [court, selectedDate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "facility_owner") {
    return null
  }

  if (!facility || !court) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Court not found</h1>
          <Button asChild>
            <Link href={`/owner/facilities/${facilityId}/courts`}>Back to Courts</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleBlockSlot = (time: string) => {
    setTimeSlots((prev) =>
      prev.map((slot) =>
        slot.time === time ? { ...slot, status: slot.status === "blocked" ? "available" : "blocked" } : slot,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Court Schedule</h1>
              <p className="text-muted-foreground">
                {court.name} - {facility.name}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/owner/facilities/${facilityId}/courts`}>Back to Courts</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Time Slots - {selectedDate?.toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <div key={slot.time} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{slot.time}</span>
                        <Badge
                          variant={
                            slot.status === "available"
                              ? "default"
                              : slot.status === "booked"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {slot.status === "available" ? "Available" : slot.status === "booked" ? "Booked" : "Blocked"}
                        </Badge>
                        {slot.bookedBy && <span className="text-sm text-muted-foreground">by {slot.bookedBy}</span>}
                      </div>
                      {slot.status !== "booked" && (
                        <Button size="sm" variant="outline" onClick={() => handleBlockSlot(slot.time)}>
                          {slot.status === "blocked" ? "Unblock" : "Block"}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert className="mt-6">
              <AlertDescription>
                You can block time slots for maintenance or other purposes. Blocked slots will not be available for
                booking.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  )
}
