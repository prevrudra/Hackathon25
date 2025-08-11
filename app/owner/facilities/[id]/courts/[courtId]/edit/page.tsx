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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function EditCourtPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const facilityId = params.id as string
  const courtId = params.courtId as string

  const facility = mockVenues.find((v) => v.id === facilityId && v.ownerId === "2")
  const court = facility?.courts.find((c) => c.id === courtId)

  const [formData, setFormData] = useState({
    name: "",
    sportType: "",
    pricePerHour: 0,
    startTime: "",
    endTime: "",
    isActive: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const availableSports = ["Badminton", "Tennis", "Table Tennis", "Football", "Cricket", "Basketball"]

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "facility_owner")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (court) {
      setFormData({
        name: court.name,
        sportType: court.sportType,
        pricePerHour: court.pricePerHour,
        startTime: court.operatingHours.start,
        endTime: court.operatingHours.end,
        isActive: court.isActive,
      })
    }
  }, [court])

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

  if (!facility || !court) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Court not found</h1>
          <Button asChild>
            <Link href={`/owner/facilities/${facilityId}/courts`}>Back to Courts</Link>
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

      setSubmitMessage("Court updated successfully!")
      setTimeout(() => {
        router.push(`/owner/facilities/${facilityId}/courts`)
      }, 2000)
    } catch (error) {
      setSubmitMessage("Error updating court. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Edit Court</h1>
              <p className="text-muted-foreground">
                {court.name} - {facility.name}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/owner/facilities/${facilityId}/courts`}>Back to Courts</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Court Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Court Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sportType">Sport Type</Label>
                <Select
                  value={formData.sportType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, sportType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Hour (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.pricePerHour}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, pricePerHour: Number.parseInt(e.target.value) || 0 }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Opening Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Closing Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Court Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                  />
                  <span className="text-sm text-muted-foreground">{formData.isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>

              {submitMessage && (
                <Alert>
                  <AlertDescription>{submitMessage}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Updating..." : "Update Court"}
                </Button>
                <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href={`/owner/facilities/${facilityId}/courts`}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
