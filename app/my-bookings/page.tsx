"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useAppState } from "@/lib/app-state"
import { useRouter } from "next/navigation"
import type { Booking } from "@/lib/venue-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewForm } from "@/components/reviews/review-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { format, parseISO, isAfter } from "date-fns"

export default function MyBookingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { bookings, venues, reviews, cancelBooking, refreshStats } = useAppState()
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }
  }, [user, isLoading, router])

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

  if (!user) {
    return null
  }

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingBooking(bookingId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Use real cancel function
    cancelBooking(bookingId)
    refreshStats()

    setCancellingBooking(null)
  }

  const getVenueDetails = (venueId: string) => {
    return venues.find((v) => v.id === venueId)
  }

  const getCourtDetails = (venueId: string, courtId: string) => {
    const venue = getVenueDetails(venueId)
    return venue?.courts.find((c) => c.id === courtId)
  }

  const canCancelBooking = (booking: Booking) => {
    const bookingDate = parseISO(booking.date)
    const now = new Date()
    return isAfter(bookingDate, now) && booking.status === "confirmed"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const userBookings = bookings.filter((b) => b.userId === user.id)

  const upcomingBookings = userBookings.filter((b) => b.status === "confirmed" && isAfter(parseISO(b.date), new Date()))

  const pastBookings = userBookings.filter((b) => b.status === "completed" || !isAfter(parseISO(b.date), new Date()))

  const cancelledBookings = userBookings.filter((b) => b.status === "cancelled")

  const canReviewVenue = (booking: Booking) => {
    const bookingDate = parseISO(booking.date)
    const now = new Date()
    const hasBookingCompleted = booking.status === "completed" || !isAfter(bookingDate, now)

    const hasAlreadyReviewed = reviews.some(
      (review) => review.venueId === booking.venueId && review.userId === user?.id,
    )

    return hasBookingCompleted && !hasAlreadyReviewed
  }

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const venue = getVenueDetails(booking.venueId)
    const court = getCourtDetails(booking.venueId, booking.courtId)

    if (!venue || !court) return null

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{venue.name}</CardTitle>
              <p className="text-muted-foreground">{court.name}</p>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{format(parseISO(booking.date), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{booking.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">
                {booking.duration} hour{booking.duration > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Paid:</span>
              <span className="font-semibold">₹{booking.totalPrice}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <Link href={`/venues/${booking.venueId}`}>View Venue</Link>
            </Button>

            {canCancelBooking(booking) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancelBooking(booking.id)}
                disabled={cancellingBooking === booking.id}
              >
                {cancellingBooking === booking.id ? "Cancelling..." : "Cancel Booking"}
              </Button>
            )}

            {canReviewVenue(booking) && (
              <Dialog
                open={reviewDialogOpen === booking.id}
                onOpenChange={(open) => setReviewDialogOpen(open ? booking.id : null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                  >
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Review {venue.name}</DialogTitle>
                  </DialogHeader>
                  <ReviewForm venueId={booking.venueId} onReviewSubmitted={() => setReviewDialogOpen(null)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">Manage your court reservations</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {userBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-4">Start by booking your first court!</p>
              <Button asChild>
                <Link href="/venues">Browse Venues</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No upcoming bookings.{" "}
                    <Link href="/venues" className="underline">
                      Book a court now!
                    </Link>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastBookings.length === 0 ? (
                <Alert>
                  <AlertDescription>No past bookings to show.</AlertDescription>
                </Alert>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {cancelledBookings.length === 0 ? (
                <Alert>
                  <AlertDescription>No cancelled bookings.</AlertDescription>
                </Alert>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {cancelledBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
