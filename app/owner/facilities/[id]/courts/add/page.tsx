"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { mockVenues } from "@/lib/venue-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function AddCourtPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const facilityId = params.id as string

  const facility = mockVenues.find((v) => v.id === facilityId && v.ownerId === "2")

  const [formData, setFormData] = useState({
    name: "",
    sportType: "",
    pricePerHour: "",
    operatingStart: "06:00",
    operatingEnd: "23:00",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    // Validation
    if (!formData.name || !formData.sportType || !formData.pricePerHour) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    const price = Number.parseFloat(formData.pricePerHour)
    if (Number.isNaN(price) || price <= 0) {
      setError("Please enter a valid price")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would save to database
    setSuccess("Court added successfully!")
    setIsSubmitting(false)

    // Reset form and redirect
    setTimeout(() => {
      router.push(`/owner/facilities/${facilityId}/courts`)
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Add New Court</h1>
              <p className="text-muted-foreground">{facility.name}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/owner/facilities/${facilityId}/courts`}>Cancel</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Court Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Court Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Badminton Court 1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sport Type *</Label>
                  <Select value={formData.sportType} onValueChange={(value) => handleInputChange("sportType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport type" />
                    </SelectTrigger>
                    <SelectContent>
                      {facility.sports.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Hour (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="50"
                    value={formData.pricePerHour}
                    onChange={(e) => handleInputChange("pricePerHour", e.target.value)}
                    placeholder="1200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start">Opening Time</Label>
                    <Input
                      id="start"
                      type="time"
                      value={formData.operatingStart}
                      onChange={(e) => handleInputChange("operatingStart", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">Closing Time</Label>
                    <Input
                      id="end"
                      type="time"
                      value={formData.operatingEnd}
                      onChange={(e) => handleInputChange("operatingEnd", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Adding Court..." : "Add Court"}
              </Button>
              <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                <Link href={`/owner/facilities/${facilityId}/courts`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
