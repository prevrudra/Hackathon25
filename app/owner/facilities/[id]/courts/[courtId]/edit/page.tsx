"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
                  required
                />
              </div>

              <div>
                <Label htmlFor="sportType">Sport Type</Label>
                <Select 
                  value={court.sportType} 
                  onValueChange={(value) => setCourt({ ...court, sportType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportOptions.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pricePerHour">Price per Hour (₹)</Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  value={court.pricePerHour}
                  onChange={(e) => setCourt({ ...court, pricePerHour: parseInt(e.target.value) })}
                  required
                  min="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
    <div>
                  <Label htmlFor="startTime">Opening Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={court.operatingHours.start}
                    onChange={(e) => setCourt({ 
                      ...court, 
                      operatingHours: { ...court.operatingHours, start: e.target.value }
                    })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Closing Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={court.operatingHours.end}
                    onChange={(e) => setCourt({ 
                      ...court, 
                      operatingHours: { ...court.operatingHours, end: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>

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
    </div>
  )
}
