import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FacilityOwnerStats } from "@/lib/owner-data"
import { format, parseISO } from "date-fns"
<<<<<<< HEAD
import { useEffect, useState } from "react"
import type { RecentBooking, OwnerBooking } from "@/lib/sqlite-owner-database"

// Union type to handle both old mock format and new database format
type BookingDisplay = RecentBooking | OwnerBooking

interface RecentBookingsProps {
  stats: FacilityOwnerStats
  ownerId?: number | null
}

export function RecentBookings({ stats, ownerId }: RecentBookingsProps) {
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Helper functions to handle different booking formats - use any to handle mixed types
  const getBookingDate = (booking: any): string => {
    return booking.bookingDate || booking.date || ''
  }

  const getBookingTime = (booking: any): string => {
    if (booking.startTime && booking.endTime) {
      return `${booking.startTime}-${booking.endTime}`
    }
    return booking.time || ''
  }

  const getBookingAmount = (booking: any): number => {
    return booking.totalAmount || booking.amount || 0
  }

  useEffect(() => {
    const fetchRecentBookings = async () => {
      if (!ownerId) {
        setRecentBookings([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/owner/bookings?ownerId=${ownerId}&limit=5`)
        if (response.ok) {
          const data = await response.json()
          setRecentBookings(data.bookings || [])
        } else {
          // Fallback to mock data
          setRecentBookings([])
        }
      } catch (error) {
        console.warn('Failed to fetch recent bookings, using mock data:', error)
        setRecentBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentBookings()
  }, [ownerId])

  // Use database data if available, otherwise fallback to mock data
  const bookingsToShow = recentBookings.length > 0 ? recentBookings : stats.recentBookings

=======

interface RecentBookingsProps {
  stats: FacilityOwnerStats
}

export function RecentBookings({ stats }: RecentBookingsProps) {
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
<<<<<<< HEAD
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookingsToShow.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{booking.userName}</span>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{booking.courtName}</p>
                  {/* Handle both old mock data format and new database format */}
                  <p className="text-sm text-muted-foreground">
                    {getBookingDate(booking).includes('-') ? 
                      format(parseISO(getBookingDate(booking)), "MMM dd") : 
                      getBookingDate(booking)
                    } • {getBookingTime(booking)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{getBookingAmount(booking)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
=======
        <div className="space-y-4">
          {stats.recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{booking.userName}</span>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{booking.courtName}</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(booking.date), "MMM dd")} • {booking.time}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{booking.amount}</p>
              </div>
            </div>
          ))}
        </div>
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
      </CardContent>
    </Card>
  )
}
