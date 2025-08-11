"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
<<<<<<< HEAD
import { useRouter } from "next/navigation"
import { 
  mockVenues, 
  mockBookings, 
  getUserReviewForVenue, 
  hasUserBookedVenue,
  type Booking 
} from "@/lib/venue-data"
=======
import { useAppState } from "@/lib/app-state"
import { useRouter } from "next/navigation"
import type { Booking } from "@/lib/venue-data"
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
<<<<<<< HEAD
import { ReviewDialog } from "@/components/venues/review-dialog"
import Link from "next/link"
import { format, parseISO, isAfter } from "date-fns"
import { Star } from "lucide-react"
=======
import { ReviewForm } from "@/components/reviews/review-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { format, parseISO, isAfter } from "date-fns"
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877

export default function MyBookingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
<<<<<<< HEAD
  const [bookings, setBookings] = useState<Booking[]>([])
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null)
  const [refreshReviews, setRefreshReviews] = useState(0) // For triggering review refresh
=======
  const { bookings, venues, reviews, cancelBooking, refreshStats } = useAppState()
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState<string | null>(null)
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }
<<<<<<< HEAD

    if (user) {
      // Fetch bookings from SQLite database and localStorage (for backward compatibility)
      const fetchBookings = async () => {
        try {
          // Fetch from SQLite API
          const response = await fetch(`/api/bookings?userId=${user.id}`)
          let dbBookings: any[] = []
          
          if (response.ok) {
            dbBookings = await response.json()
          }

          // Also get localStorage bookings for backward compatibility
          const storedBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
          const userMockBookings = mockBookings.filter((b) => b.userId === user.id)
          
          // Convert database bookings to the same format as localStorage bookings
          const formattedDbBookings = dbBookings.map((booking: any) => ({
            id: booking.id.toString(),
            userId: user.id,
            venueId: booking.venue_id.toString(),
            courtId: booking.court_id.toString(),
            date: booking.booking_date,
            timeSlot: `${booking.start_time}-${booking.end_time}`,
            duration: booking.duration,
            totalPrice: booking.total_amount,
            status: booking.status,
            createdAt: booking.created_at,
          }))

          // Combine all bookings and remove duplicates by ID
          const allBookings = [...userMockBookings, ...storedBookings, ...formattedDbBookings]
          const uniqueBookings = allBookings.filter((booking, index, self) =>
            index === self.findIndex((b) => b.id === booking.id)
          )

          setBookings(uniqueBookings)
        } catch (error) {
          console.error('Failed to fetch bookings:', error)
          // Fallback to localStorage and mock data only
          const storedBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
          const userMockBookings = mockBookings.filter((b) => b.userId === user.id)
          const allBookings = [...userMockBookings, ...storedBookings]
          setBookings(allBookings)
        }
      }

      fetchBookings()
    }
  }, [user, isLoading, router, refreshReviews]) // Added refreshReviews to dependencies
=======
  }, [user, isLoading, router])
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877

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

<<<<<<< HEAD
    try {
      // Try to cancel via API first
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingId,
          action: 'cancel',
          userId: user.id
        }),
      })

      if (response.ok) {
        // If API call succeeds, update local state
        const updatedBookings = bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking,
        )
        setBookings(updatedBookings)
      } else {
        // If API fails, try localStorage cancellation (fallback)
        console.warn('API cancellation failed, using localStorage fallback')
        
        // Update booking status in memory
        const updatedBookings = bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking,
        )
        setBookings(updatedBookings)

        // Update localStorage
        const storedBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
        const updatedStoredBookings = storedBookings.map((booking: Booking) =>
          booking.id === bookingId ? { ...booking, status: "cancelled" } : booking,
        )
        localStorage.setItem("user_bookings", JSON.stringify(updatedStoredBookings))
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      
      // Fallback to localStorage update
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking,
      )
      setBookings(updatedBookings)

      // Update localStorage
      const storedBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
      const updatedStoredBookings = storedBookings.map((booking: Booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking,
      )
      localStorage.setItem("user_bookings", JSON.stringify(updatedStoredBookings))
    }
=======
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Use real cancel function
    cancelBooking(bookingId)
    refreshStats()
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877

    setCancellingBooking(null)
  }

  const getVenueDetails = (venueId: string) => {
<<<<<<< HEAD
    return mockVenues.find((v) => v.id === venueId)
=======
    return venues.find((v) => v.id === venueId)
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
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

<<<<<<< HEAD
  // Helper function to safely parse dates from different formats
  const parseBookingDate = (dateStr: string): Date => {
    try {
      // Try parsing as ISO string first
      if (dateStr.includes('T') || dateStr.includes('Z')) {
        return parseISO(dateStr)
      }
      // Try parsing as YYYY-MM-DD format
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return parseISO(dateStr)
      }
      // Fallback to Date constructor
      return new Date(dateStr)
    } catch (error) {
      console.warn('Failed to parse date:', dateStr, error)
      return new Date() // Return current date as fallback
    }
  }

  const upcomingBookings = bookings.filter((b) => {
    try {
      return b.status === "confirmed" && isAfter(parseBookingDate(b.date), new Date())
    } catch (error) {
      console.warn('Error filtering upcoming booking:', b, error)
      return false
    }
  })

  const pastBookings = bookings.filter((b) => {
    try {
      const isPast = b.status === "completed" || !isAfter(parseBookingDate(b.date), new Date())
      if (isPast) {
        console.log('Past booking found:', b)
      }
      return isPast
    } catch (error) {
      console.warn('Error filtering past booking:', b, error)
      return false
    }
  })

  console.log('All bookings:', bookings)
  console.log('Past bookings count:', pastBookings.length)
  console.log('Past bookings:', pastBookings)

  const cancelledBookings = bookings.filter((b) => b.status === "cancelled")

=======
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

>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
  const BookingCard = ({ booking }: { booking: Booking }) => {
    const venue = getVenueDetails(booking.venueId)
    const court = getCourtDetails(booking.venueId, booking.courtId)

    if (!venue || !court) return null

<<<<<<< HEAD
    // Check if booking is completed or past date
    const isBookingCompleted = booking.status === "completed" || !isAfter(parseBookingDate(booking.date), new Date())
    
    // Check if user has already reviewed this venue - force refresh when refreshReviews changes
    const existingReview = user ? getUserReviewForVenue(user.id, booking.venueId) : null
    
    // Show review button only for completed/past bookings where user hasn't reviewed yet
    const canReview = isBookingCompleted && !existingReview && user

    const handleReviewSubmitted = () => {
      setRefreshReviews(prev => prev + 1) // This will trigger a re-render
    }

    return (
      <Card key={`${booking.id}-${refreshReviews}`}>
=======
    return (
      <Card>
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
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
<<<<<<< HEAD
              <span className="font-medium">{format(parseBookingDate(booking.date), "MMM dd, yyyy")}</span>
=======
              <span className="font-medium">{format(parseISO(booking.date), "MMM dd, yyyy")}</span>
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
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

<<<<<<< HEAD
          {/* Show existing review if user has reviewed */}
          {existingReview && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= existingReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-green-700">Your Review</span>
              </div>
              <p className="text-sm font-medium text-green-800">{existingReview.title}</p>
              <p className="text-sm text-green-700">{existingReview.comment}</p>
            </div>
          )}

=======
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
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

<<<<<<< HEAD
            {/* Show Add Review button if booking is completed and no review exists */}
            {canReview && (
              <ReviewDialog
                venueId={booking.venueId}
                venueName={venue.name}
                bookingId={booking.id}
                onReviewSubmitted={handleReviewSubmitted}
              >
                <Button variant="outline" size="sm" className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100">
                  <Star className="w-4 h-4 mr-2" />
                  Add Review
                </Button>
              </ReviewDialog>
=======
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
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
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
<<<<<<< HEAD
        {bookings.length === 0 ? (
=======
        {userBookings.length === 0 ? (
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
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
