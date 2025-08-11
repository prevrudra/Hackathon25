"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
=======
import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { mockVenues } from "@/lib/venue-data"
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
<<<<<<< HEAD
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface Court {
  id: string
  name: string
  sportType: string
  pricePerHour: number
  operatingHours: {
    start: string
    end: string
  }
  isActive: boolean
}

export default function EditCourtPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const facilityId = params.id as string
  const courtId = params.courtId as string

  const [court, setCourt] = useState<Court | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const sportOptions = ["Badminton", "Tennis", "Table Tennis", "Basketball", "Football", "Squash", "Cricket"]

  useEffect(() => {
    if (!user || user.role !== "facility_owner") {
      router.push("/login")
      return
    }

    fetchCourt()
  }, [user, facilityId, courtId])

  const fetchCourt = async () => {
    try {
      const response = await fetch(`/api/owner/facilities/${facilityId}/courts`)
      if (response.ok) {
        const data = await response.json()
        const foundCourt = data.courts.find((c: any) => c.id === courtId)
        if (foundCourt) {
          setCourt(foundCourt)
        } else {
          setError("Court not found")
        }
      } else {
        setError("Failed to fetch court details")
      }
    } catch (err) {
      setError("Error loading court")
    } finally {
      setLoading(false)
    }
=======
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
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
<<<<<<< HEAD
    if (!court) return

    setSaving(true)
    setError("")

    try {
      const response = await fetch(`/api/owner/facilities/${facilityId}/courts/${courtId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(court),
      })

      if (response.ok) {
        setSuccess("Court updated successfully!")
        setTimeout(() => {
          router.push(`/owner/facilities/${facilityId}/courts`)
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update court')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading court...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Court not found</h1>
            <p className="mt-2 text-gray-600">The court you're looking for doesn't exist.</p>
            <Link href={`/owner/facilities/${facilityId}/courts`}>
              <Button className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/owner/facilities/${facilityId}/courts`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courts
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Court</h1>
          <p className="text-gray-600">Update court information</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Court Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Court Name</Label>
                <Input
                  id="name"
                  value={court.name}
                  onChange={(e) => setCourt({ ...court, name: e.target.value })}
=======
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
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
                  required
                />
              </div>

<<<<<<< HEAD
              <div>
                <Label htmlFor="sportType">Sport Type</Label>
                <Select 
                  value={court.sportType} 
                  onValueChange={(value) => setCourt({ ...court, sportType: value })}
=======
              <div className="space-y-2">
                <Label htmlFor="sportType">Sport Type</Label>
                <Select
                  value={formData.sportType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, sportType: value }))}
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport type" />
                  </SelectTrigger>
                  <SelectContent>
<<<<<<< HEAD
                    {sportOptions.map((sport) => (
=======
                    {availableSports.map((sport) => (
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

<<<<<<< HEAD
              <div>
                <Label htmlFor="pricePerHour">Price per Hour (₹)</Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  value={court.pricePerHour}
                  onChange={(e) => setCourt({ ...court, pricePerHour: parseInt(e.target.value) })}
                  required
                  min="0"
=======
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
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
<<<<<<< HEAD
                <div>
=======
                <div className="space-y-2">
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
                  <Label htmlFor="startTime">Opening Time</Label>
                  <Input
                    id="startTime"
                    type="time"
<<<<<<< HEAD
                    value={court.operatingHours.start}
                    onChange={(e) => setCourt({ 
                      ...court, 
                      operatingHours: { ...court.operatingHours, start: e.target.value }
                    })}
                    required
                  />
                </div>
                <div>
=======
                    value={formData.startTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
                  <Label htmlFor="endTime">Closing Time</Label>
                  <Input
                    id="endTime"
                    type="time"
<<<<<<< HEAD
                    value={court.operatingHours.end}
                    onChange={(e) => setCourt({ 
                      ...court, 
                      operatingHours: { ...court.operatingHours, end: e.target.value }
                    })}
=======
                    value={formData.endTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
                    required
                  />
                </div>
              </div>

<<<<<<< HEAD
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={court.isActive}
                  onCheckedChange={(checked) => setCourt({ ...court, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive">Active (available for booking)</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href={`/owner/facilities/${facilityId}/courts`}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
=======
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
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
    </div>
  )
}
