"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { mockVenues } from "@/lib/venue-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function EditFacilityPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const facilityId = params.id as string

  const facility = mockVenues.find((v) => v.id === facilityId && v.ownerId === "2")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    area: "",
    city: "",
    sports: [] as string[],
    amenities: [] as string[],
    images: [] as string[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const availableSports = ["Badminton", "Tennis", "Table Tennis", "Football", "Cricket", "Basketball"]
  const availableAmenities = ["Parking", "Changing Rooms", "Cafeteria", "Equipment Rental", "Air Conditioning", "WiFi"]

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "facility_owner")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name,
        description: facility.description,
        address: facility.location.address,
        area: facility.location.area,
        city: facility.location.city,
        sports: facility.sports,
        amenities: facility.amenities,
        images: facility.images,
      })
    }
  }, [facility])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitMessage("Facility updated successfully!")
      setTimeout(() => {
        router.push("/owner/facilities")
      }, 2000)
    } catch (error) {
      setSubmitMessage("Error updating facility. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSportChange = (sport: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, sports: [...prev.sports, sport] }))
    } else {
      setFormData((prev) => ({ ...prev, sports: prev.sports.filter((s) => s !== sport) }))
    }
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, amenity] }))
    } else {
      setFormData((prev) => ({ ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Edit Facility</h1>
              <p className="text-muted-foreground">{facility.name}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/owner/facilities">Back to Facilities</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Facility Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Facility Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Sports Supported</Label>
                <div className="grid grid-cols-2 gap-3">
                  {availableSports.map((sport) => (
                    <div key={sport} className="flex items-center space-x-2">
                      <Checkbox
                        id={sport}
                        checked={formData.sports.includes(sport)}
                        onCheckedChange={(checked) => handleSportChange(sport, checked as boolean)}
                      />
                      <Label htmlFor={sport} className="text-sm font-normal">
                        {sport}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-3">
                  {availableAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                      />
                      <Label htmlFor={amenity} className="text-sm font-normal">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {submitMessage && (
                <Alert>
                  <AlertDescription>{submitMessage}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Updating..." : "Update Facility"}
                </Button>
                <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href="/owner/facilities">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
