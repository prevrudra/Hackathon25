"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { type PendingFacility } from "@/lib/admin-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { format, parseISO } from "date-fns"

export default function AdminFacilitiesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [facilities, setFacilities] = useState<PendingFacility[]>([])
  const [selectedFacility, setSelectedFacility] = useState<PendingFacility | null>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [facilitiesLoading, setFacilitiesLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchPendingFacilities = async () => {
      try {
        const response = await fetch('/api/admin/facilities/pending')
        if (response.ok) {
          const data = await response.json()
          setFacilities(data)
        } else {
          console.error('Failed to fetch pending facilities')
        }
      } catch (error) {
        console.error('Error fetching pending facilities:', error)
      } finally {
        setFacilitiesLoading(false)
      }
    }

    if (user && user.role === "admin") {
      fetchPendingFacilities()
    }
  }, [user])

  if (isLoading || facilitiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const handleApprove = async (facilityId: string) => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/admin/facilities/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'approve', venueId: facilityId }),
      })

      if (response.ok) {
        // Remove from pending list
        setFacilities((prev) => prev.filter((f) => f.id !== facilityId))
        setSelectedFacility(null)
        setReviewComment("")
      } else {
        console.error('Failed to approve facility')
        alert('Failed to approve facility. Please try again.')
      }
    } catch (error) {
      console.error('Error approving facility:', error)
      alert('Error approving facility. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (facilityId: string) => {
    if (!reviewComment.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/admin/facilities/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'reject', 
          venueId: facilityId, 
          reason: reviewComment 
        }),
      })

      if (response.ok) {
        // Remove from pending list
        setFacilities((prev) => prev.filter((f) => f.id !== facilityId))
        setSelectedFacility(null)
        setReviewComment("")
      } else {
        console.error('Failed to reject facility')
        alert('Failed to reject facility. Please try again.')
      }
    } catch (error) {
      console.error('Error rejecting facility:', error)
      alert('Error rejecting facility. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const pendingFacilities = facilities
  const approvedFacilities: PendingFacility[] = [] // Would come from API
  const rejectedFacilities: PendingFacility[] = [] // Would come from API

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Facility Management</h1>
              <p className="text-muted-foreground">Review and approve facility registrations</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending ({pendingFacilities.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedFacilities.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedFacilities.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {pendingFacilities.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending facilities</h3>
                  <p className="text-gray-600">All facility submissions have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Facility List */}
                <div className="space-y-4">
                  {pendingFacilities.map((facility) => (
                    <Card
                      key={facility.id}
                      className={`cursor-pointer transition-colors ${
                        selectedFacility?.id === facility.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedFacility(facility)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{facility.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{facility.location}</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Owner:</span>
                            <span>{facility.ownerName}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Courts:</span>
                            <span>{facility.courts}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Submitted:</span>
                            <span>{format(parseISO(facility.submittedAt), "MMM dd, yyyy")}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Facility Details */}
                <div className="sticky top-4">
                  {selectedFacility ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Review Facility</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Images */}
                        <div className="space-y-2">
                          <Label>Facility Images</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedFacility.images.map((image, index) => (
                              <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`${selectedFacility.name} ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Description</Label>
                            <p className="text-sm text-muted-foreground mt-1">{selectedFacility.description}</p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Sports Available</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedFacility.sports.map((sport) => (
                                <Badge key={sport} variant="outline" className="text-xs">
                                  {sport}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Amenities</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedFacility.amenities.map((amenity) => (
                                <Badge key={amenity} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Owner Contact</Label>
                            <p className="text-sm text-muted-foreground mt-1">{selectedFacility.ownerEmail}</p>
                          </div>
                        </div>

                        {/* Review Actions */}
                        <div className="space-y-4 pt-4 border-t">
                          <div className="space-y-2">
                            <Label htmlFor="comment">
                              Review Comment (Optional for approval, Required for rejection)
                            </Label>
                            <Textarea
                              id="comment"
                              placeholder="Add your review comments..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={() => handleApprove(selectedFacility.id)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? "Processing..." : "Approve"}
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleReject(selectedFacility.id)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? "Processing..." : "Reject"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <p className="text-muted-foreground">Select a facility to review</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
            <Alert>
              <AlertDescription>
                Approved facilities will be shown here. This would typically load from the database.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="rejected">
            <Alert>
              <AlertDescription>
                Rejected facilities will be shown here. This would typically load from the database.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
