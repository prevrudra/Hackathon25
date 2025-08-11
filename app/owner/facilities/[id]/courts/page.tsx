"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { mockVenues } from "@/lib/venue-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function FacilityCourtsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const facilityId = params.id as string

  const facility = mockVenues.find((v) => v.id === facilityId && v.ownerId === "2")

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

  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Facility not found</h1>
          <Button asChild>
            <Link href="/owner/facilities">Back to Facilities</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Manage Courts</h1>
              <p className="text-muted-foreground">{facility.name}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/owner/facilities/${facilityId}/courts/add`}>Add New Court</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/owner/facilities">Back to Facilities</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {facility.courts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courts yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first court!</p>
              <Button asChild>
                <Link href={`/owner/facilities/${facilityId}/courts/add`}>Add New Court</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facility.courts.map((court) => (
              <Card key={court.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{court.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {court.sportType}
                      </Badge>
                    </div>
                    <Badge variant={court.isActive ? "default" : "secondary"}>
                      {court.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href={`/owner/facilities/${facilityId}/courts/${court.id}/edit`}>Edit</Link>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href={`/owner/facilities/${facilityId}/courts/${court.id}/schedule`}>Schedule</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!facility.isApproved && (
          <Alert className="mt-6">
            <AlertDescription>
              This facility is pending approval. Courts will be available for booking once the facility is approved by
              our admin team.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}
