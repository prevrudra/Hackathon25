"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Clock, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { format, addDays, isSameDay } from "date-fns"

interface Booking {
  id: number
  userName: string
  userEmail: string
  bookingDate: string
  startTime: string
  endTime: string
  duration: number
  totalAmount: number
  status: string
  paymentStatus: string
}

interface Court {
  id: string
  name: string
  sportType: string
  pricePerHour: number
  operatingHours: {
    start: string
    end: string
  }
}

export default function CourtSchedulePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const facilityId = params.id as string
  const courtId = params.courtId as string

  const [court, setCourt] = useState<Court | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user || user.role !== "facility_owner") {
      router.push("/login")
      return
    }

    fetchCourtAndBookings()
  }, [user, facilityId, courtId, selectedDate])

  const fetchCourtAndBookings = async () => {
    try {
      // Fetch court details
      const courtsResponse = await fetch(`/api/owner/facilities/${facilityId}/courts`)
      let foundCourt = null
      
      if (courtsResponse.ok) {
        const courtsData = await courtsResponse.json()
        foundCourt = courtsData.courts.find((c: any) => c.id === courtId)
        if (foundCourt) {
          setCourt(foundCourt)
        }
      }

      // Fetch bookings for the selected date
      const ownerId = parseInt(user!.id)
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const bookingsResponse = await fetch(`/api/owner/bookings?ownerId=${ownerId}&date=${dateStr}`)
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        // Filter bookings for this specific court
        const courtBookings = bookingsData.bookings.filter((booking: any) => 
          booking.courtName === foundCourt?.name || booking.courtId === courtId
        )
        setBookings(courtBookings)
      }
    } catch (err) {
      setError("Error loading court schedule")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const generateTimeSlots = () => {
    if (!court) return []
    
    const slots = []
    const start = parseInt(court.operatingHours.start.split(':')[0])
    const end = parseInt(court.operatingHours.end.split(':')[0])
    
    for (let hour = start; hour < end; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`
      const booking = bookings.find(b => 
        b.startTime === `${hour.toString().padStart(2, '0')}:00` && 
        b.status !== 'cancelled'
      )
      
      slots.push({
        time: timeSlot,
        hour: hour,
        booking: booking || null,
        isAvailable: !booking
      })
    }
    
    return slots
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading schedule...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Court not found</h1>
            <p className="mt-2 text-gray-600">The court you're looking for doesn't exist.</p>
            <Link href={`/owner/facilities/${facilityId}/courts`}>
              <Button className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const timeSlots = generateTimeSlots()
  const dailyRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/owner/facilities/${facilityId}/courts`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courts
            </Button>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{court.name} Schedule</h1>
              <p className="text-gray-600">{court.sportType} • ₹{court.pricePerHour}/hour</p>
            </div>
            <Link href={`/owner/facilities/${facilityId}/courts/${courtId}/edit`}>
              <Button variant="outline">Edit Court</Button>
            </Link>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Schedule */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">{bookings.filter(b => b.status !== 'cancelled').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Revenue</p>
                      <p className="text-2xl font-bold">₹{dailyRevenue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Available Slots</p>
                      <p className="text-2xl font-bold">{timeSlots.filter(s => s.isAvailable).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schedule for selected date */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule for {format(selectedDate, "MMMM dd, yyyy")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.time}
                      className={`p-4 border rounded-lg ${
                        slot.isAvailable 
                          ? 'border-gray-200 bg-gray-50' 
                          : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-sm font-medium">{slot.time}</span>
                          {slot.booking ? (
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{slot.booking.userName}</span>
                              <Badge className={getStatusColor(slot.booking.status)}>
                                {slot.booking.status}
                              </Badge>
                              <Badge className={getPaymentStatusColor(slot.booking.paymentStatus)}>
                                {slot.booking.paymentStatus}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-green-600 font-medium">Available</span>
                          )}
                        </div>
                        <div className="text-right">
                          {slot.booking ? (
                            <div>
                              <p className="font-semibold">₹{slot.booking.totalAmount}</p>
                              <p className="text-sm text-muted-foreground">{slot.booking.userEmail}</p>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">₹{court.pricePerHour}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
