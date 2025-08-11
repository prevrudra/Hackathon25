"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface Venue {
  id: string
  name: string
  description: string
  address: string
  location: {
    city: string
    area: string
  }
  sports: string[]
  amenities: string[]
  isApproved: boolean
  isActive: boolean
}

export default function EditFacilityPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const facilityId = params.id as string

  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const sportOptions = ["Badminton", "Tennis", "Table Tennis", "Basketball", "Football", "Squash", "Cricket"]
  const amenityOptions = ["Parking", "Changing Rooms", "Cafeteria", "AC", "Equipment Rental", "First Aid", "Floodlights", "Pro Shop", "Coaching", "Clubhouse", "Refreshments"]

  useEffect(() => {
    if (!user || user.role !== "facility_owner") {
      router.push("/login")
      return
    }

    fetchVenue()
  }, [user, facilityId])

  const fetchVenue = async () => {
    try {
      // For now, we'll use the direct venue API endpoint which uses mock data
      const response = await fetch(`/api/owner/venues/${facilityId}`)
      if (response.ok) {
        const data = await response.json()
        const foundVenue = data.venue
        if (foundVenue) {
          setVenue({
            ...foundVenue,
            sports: Array.isArray(foundVenue.sports) ? foundVenue.sports : [],
            amenities: Array.isArray(foundVenue.amenities) ? foundVenue.amenities : []
          })
        } else {
          setError("Facility not found")
        }
      } else {
        setError("Failed to fetch facility details")
      }
    } catch (err) {
      setError("Error loading facility")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!venue) return

    setSaving(true)
    setError("")

    try {
      const response = await fetch(`/api/owner/venues/${facilityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...venue,
          sports: venue.sports.join(','),
          amenities: venue.amenities.join(',')
        }),
      })

      if (response.ok) {
        setSuccess("Facility updated successfully!")
        setTimeout(() => {
          router.push('/owner/facilities')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update facility')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleSportChange = (sport: string, checked: boolean) => {
    if (!venue) return
    
    const updatedSports = checked 
      ? [...venue.sports, sport]
      : venue.sports.filter(s => s !== sport)
    
    setVenue({ ...venue, sports: updatedSports })
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (!venue) return
    
    const updatedAmenities = checked 
      ? [...venue.amenities, amenity]
      : venue.amenities.filter(a => a !== amenity)
    
    setVenue({ ...venue, amenities: updatedAmenities })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading facility...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Facility not found</h1>
            <p className="mt-2 text-gray-600">The facility you're looking for doesn't exist.</p>
            <Link href="/owner/facilities">
              <Button className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Facilities
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
          <Link href="/owner/facilities">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Facilities
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Facility</h1>
          <p className="text-gray-600">Update your facility information</p>
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
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Facility Name</Label>
                <Input
                  id="name"
                  value={venue.name}
                  onChange={(e) => setVenue({ ...venue, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={venue.description}
                  onChange={(e) => setVenue({ ...venue, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={venue.address}
                  onChange={(e) => setVenue({ ...venue, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={venue.location.city}
                    onChange={(e) => setVenue({ 
                      ...venue, 
                      location: { ...venue.location, city: e.target.value }
                    })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    value={venue.location.area}
                    onChange={(e) => setVenue({ 
                      ...venue, 
                      location: { ...venue.location, area: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sports Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sportOptions.map((sport) => (
                  <div key={sport} className="flex items-center space-x-2">
                    <Checkbox
                      id={sport}
                      checked={venue.sports.includes(sport)}
                      onCheckedChange={(checked) => handleSportChange(sport, checked as boolean)}
                    />
                    <Label htmlFor={sport}>{sport}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenityOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={venue.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label htmlFor={amenity}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={venue.isActive}
                  onCheckedChange={(checked) => setVenue({ ...venue, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive">Active (accepting bookings)</Label>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Approval Status:</strong> {venue.isApproved ? "Approved" : "Pending Approval"}
                </p>
                {!venue.isApproved && (
                  <p className="text-sm text-amber-600 mt-1">
                    Your facility is pending admin approval before it can accept bookings.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href="/owner/facilities">
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
