"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { mockVenues } from "@/lib/venue-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function OwnerCourtsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedFacility, setSelectedFacility] = useState("all")

  const ownerFacilities = mockVenues.filter((v) => v.ownerId === user?.id?.toString())
  const allCourts = ownerFacilities.flatMap((facility) =>
    facility.courts.map((court) => ({
      ...court,
      facilityName: facility.name,
      facilityId: facility.id,
    })),
  )

  const filteredCourts =
    selectedFacility === "all" ? allCourts : allCourts.filter((court) => court.facilityId === selectedFacility)

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

  const handleToggleStatus = async (courtId: string) => {
    // In a real app, this would update the court status in the database
    console.log("Toggle court status:", courtId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Manage Courts</h1>
              <p className="text-muted-foreground">Overview of all your courts</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/owner/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      {ownerFacilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courts Grid */}
          {filteredCourts.length === 0 ? (
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courts found</h3>
                <p className="text-gray-600 mb-4">Add courts to your facilities to get started!</p>
                <Button asChild>
                  <Link href="/owner/facilities">Manage Facilities</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourts.map((court) => (
                <Card key={`${court.facilityId}-${court.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{court.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{court.facilityName}</p>
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

                      <div className="flex items-center justify-between pt-2">
                        <Label htmlFor={`status-${court.id}`} className="text-sm">
                          Active Status
                        </Label>
                        <Switch
                          id={`status-${court.id}`}
                          checked={court.isActive}
                          onCheckedChange={() => handleToggleStatus(court.id)}
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                          <Link href={`/owner/facilities/${court.facilityId}/courts/${court.id}/edit`}>Edit</Link>
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                          <Link href={`/owner/facilities/${court.facilityId}/courts/${court.id}/schedule`}>
                            Schedule
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
