"use client"
import { useParams, useRouter } from "next/navigation"
<<<<<<< HEAD
import { mockVenues } from "@/lib/venue-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
=======
import { useAppState } from "@/lib/app-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { format, parseISO } from "date-fns"
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877

export default function VenueDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const venueId = params.id as string

<<<<<<< HEAD
  const venue = mockVenues.find((v) => v.id === venueId)
=======
  const { venues, reviews } = useAppState()
  const venue = venues.find((v) => v.id === venueId)
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877

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

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => router.back()}>
              ← Back
            </Button>
            <Button asChild>
              <Link href={`/venues/${venue.id}/book`}>Book Now</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src={venue.images[0] || "/placeholder.svg"} alt={venue.name} fill className="object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {venue.images.slice(1, 3).map((image, index) => (
                <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${venue.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">{venue.name}</h1>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-semibold">{venue.rating}</span>
                  <span className="text-muted-foreground">({venue.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                {venue.location.area}, {venue.location.city}
              </p>
              <p className="text-gray-600 mt-2">{venue.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Sports Available</h3>
              <div className="flex flex-wrap gap-2">
                {venue.sports.map((sport) => (
                  <Badge key={sport} variant="secondary">
                    {sport}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Pricing</h3>
              <p className="text-2xl font-bold text-blue-600">
                ₹{venue.priceRange.min} - ₹{venue.priceRange.max}
                <span className="text-sm font-normal text-blue-700"> per hour</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="courts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courts">Courts & Pricing</TabsTrigger>
            <TabsTrigger value="about">About Venue</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="courts" className="space-y-4">
            <h2 className="text-2xl font-bold">Available Courts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venue.courts.map((court) => (
                <Card key={court.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{court.name}</CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {court.sportType}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price per hour:</span>
                        <span className="font-semibold">₹{court.pricePerHour}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Operating hours:</span>
                        <span className="font-medium">
                          {court.operatingHours.start} - {court.operatingHours.end}
                        </span>
                      </div>
                      <Button className="w-full mt-4" asChild>
                        <Link href={`/venues/${venue.id}/book?court=${court.id}`}>Book This Court</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {venue.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{venue.description}</p>
                <div>
                  <h4 className="font-semibold mb-2">Address</h4>
                  <p className="text-muted-foreground">{venue.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Facilities</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {venue.amenities.map((amenity) => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-2xl">★</span>
                    <span className="text-2xl font-bold">{venue.rating}</span>
                  </div>
                  <div className="text-muted-foreground">Based on {venue.reviewCount} reviews</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock reviews */}
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Rahul S.</span>
                      <div className="flex text-yellow-500">★★★★★</div>
                    </div>
                    <p className="text-muted-foreground">
                      Excellent facility with well-maintained courts. Staff is very helpful and the booking process is
                      smooth.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Priya M.</span>
                      <div className="flex text-yellow-500">★★★★☆</div>
                    </div>
                    <p className="text-muted-foreground">
                      Good courts and amenities. Parking can be a bit challenging during peak hours.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Amit K.</span>
                      <div className="flex text-yellow-500">★★★★★</div>
                    </div>
                    <p className="text-muted-foreground">
                      Love playing here! The courts are professional quality and the atmosphere is great.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
=======
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
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
    </div>
  )
}
