"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { mockVenues } from "@/lib/venue-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"

export default function OwnerFacilitiesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [facilities, setFacilities] = useState(mockVenues.filter((v) => v.ownerId === "2"))

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "facility_owner")) {
      router.push("/login")
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

  if (!user || user.role !== "facility_owner") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Facilities</h1>
              <p className="text-muted-foreground">Manage your sports facilities</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/owner/facilities/add">Add New Facility</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/owner/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {facilities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first sports facility!</p>
              <Button asChild>
                <Link href="/owner/facilities/add">Add New Facility</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <Card key={facility.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={facility.images[0] || "/placeholder.svg"}
                    alt={facility.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={facility.isApproved ? "default" : "secondary"}>
                      {facility.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg">{facility.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {facility.location.area}, {facility.location.city}
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {facility.sports.slice(0, 3).map((sport) => (
                        <Badge key={sport} variant="outline" className="text-xs">
                          {sport}
                        </Badge>
                      ))}
                      {facility.sports.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{facility.sports.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Courts:</span>
                      <span className="font-medium">{facility.courts.length}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price Range:</span>
                      <span className="font-medium">
                        ₹{facility.priceRange.min}-{facility.priceRange.max}/hr
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href={`/owner/facilities/${facility.id}/edit`}>Edit</Link>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href={`/owner/facilities/${facility.id}/courts`}>Courts</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!facilities.some((f) => f.isApproved) && facilities.length > 0 && (
          <Alert className="mt-6">
            <AlertDescription>
              Your facilities are pending approval. Once approved by our admin team, they will be visible to users for
              booking.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}
