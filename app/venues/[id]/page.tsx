"use client"
import { useParams, useRouter } from "next/navigation"
import { useAppState } from "@/lib/app-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { format, parseISO } from "date-fns"

export default function VenueDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const venueId = params.id as string

  const { venues, reviews } = useAppState()
  const venue = venues.find((v) => v.id === venueId)

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Venue not found</h1>
          <Button asChild>
            <Link href="/venues">Back to Venues</Link>
          </Button>
        </div>
      </div>
    )
  }

  const venueReviews = reviews.filter((review) => review.venueId === venueId)
  const averageRating =
    venueReviews.length > 0
      ? (venueReviews.reduce((sum, review) => sum + review.rating, 0) / venueReviews.length).toFixed(1)
      : venue.rating

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{venue.name}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-2xl">★</span>
              <span className="text-2xl font-bold">{averageRating}</span>
            </div>
            <div className="text-muted-foreground">
              Based on {venueReviews.length} review{venueReviews.length !== 1 ? "s" : ""}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Location:</span>
              <span>{venue.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Capacity:</span>
              <span>{venue.capacity}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Price:</span>
              <span>{venue.price}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reviews" className="space-y-4 mt-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <span className="text-2xl font-bold">{averageRating}</span>
                </div>
                <div className="text-muted-foreground">
                  Based on {venueReviews.length} review{venueReviews.length !== 1 ? "s" : ""}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {venueReviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No reviews yet. Be the first to review this venue!</p>
                  </div>
                ) : (
                  venueReviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review.userName}</span>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(parseISO(review.date), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Add details tab content */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Venue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Description:</span>
                  <span>{venue.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Features:</span>
                  <span>{venue.features.join(", ")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
