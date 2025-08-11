"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOwnerStats, useOwnerBookings, useOwnerVenues, useOwnerCourts } from "@/hooks/use-owner-data"

export default function DatabaseTestPage() {
  const [ownerId, setOwnerId] = useState<number>(1)
  const [testApiCall, setTestApiCall] = useState<string>('')
  const [apiResult, setApiResult] = useState<any>(null)
  
  // Test hooks
  const { stats, loading: statsLoading, error: statsError } = useOwnerStats(ownerId)
  const { bookings, total, loading: bookingsLoading } = useOwnerBookings(ownerId, undefined, undefined, undefined, 1, 5)
  const { venues, loading: venuesLoading } = useOwnerVenues(ownerId)
  const { courts, loading: courtsLoading } = useOwnerCourts(ownerId)

  const testApiEndpoint = async (endpoint: string) => {
    setTestApiCall(endpoint)
    try {
      const response = await fetch(endpoint)
      const data = await response.json()
      setApiResult(data)
    } catch (error) {
      setApiResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">SQLite Database Integration Test</h1>
          <p className="text-gray-600 mb-6">
            Testing real SQLite database integration for owner functionality. All data is stored locally in <code>data/quickcourt.db</code>.
          </p>
          
          {/* Owner ID Selector */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <label>Owner ID:</label>
            <select 
              value={ownerId} 
              onChange={(e) => setOwnerId(parseInt(e.target.value))}
              className="border rounded px-3 py-1"
            >
              <option value={1}>Owner 1 (Rajesh Kumar - SportZone Arena)</option>
              <option value={2}>Owner 2 (Priya Sharma - Elite Sports Complex)</option>
            </select>
          </div>
        </div>

        {/* Stats Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Owner Statistics 
              {statsLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
              {!statsError && <Badge variant="default">SQLite Connected</Badge>}
              {statsError && <Badge variant="destructive">Error: {statsError}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">₹{stats.totalEarnings.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-600">{stats.activeFacilities}</div>
                  <div className="text-sm text-gray-600">Active Facilities</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded">
                  <div className="text-2xl font-bold text-orange-600">{stats.totalCourts}</div>
                  <div className="text-sm text-gray-600">Total Courts</div>
                </div>
                <div className="text-center p-4 bg-teal-50 rounded">
                  <div className="text-2xl font-bold text-teal-600">₹{stats.monthlyRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded">
                  <div className="text-2xl font-bold text-indigo-600">{stats.todayBookings}</div>
                  <div className="text-sm text-gray-600">Today's Bookings</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded">
                  <div className="text-2xl font-bold text-yellow-600">{stats.occupancyRate}%</div>
                  <div className="text-sm text-gray-600">Occupancy Rate</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded">
                  <div className="text-2xl font-bold text-red-600">₹{stats.pendingPayments.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Pending Payments</div>
                </div>
              </div>
            ) : (
              <div>Loading stats from SQLite database...</div>
            )}
          </CardContent>
        </Card>

        {/* API Test Section */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoint Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <Button onClick={() => testApiEndpoint(`/api/owner/stats?ownerId=${ownerId}`)}>
                Test Stats API
              </Button>
              <Button onClick={() => testApiEndpoint(`/api/owner/bookings?ownerId=${ownerId}&limit=3`)}>
                Test Bookings API
              </Button>
              <Button onClick={() => testApiEndpoint(`/api/owner/venues?ownerId=${ownerId}`)}>
                Test Venues API
              </Button>
              <Button onClick={() => testApiEndpoint(`/api/owner/courts?ownerId=${ownerId}`)}>
                Test Courts API
              </Button>
              <Button onClick={() => testApiEndpoint(`/api/owner/trends?ownerId=${ownerId}&days=7`)}>
                Test Trends API
              </Button>
              <Button onClick={() => testApiEndpoint(`/api/owner/peak-hours?ownerId=${ownerId}`)}>
                Test Peak Hours API
              </Button>
            </div>
            
            {testApiCall && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">API Call: {testApiCall}</div>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(apiResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Bookings
              {bookingsLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{booking.userName}</div>
                      <div className="text-sm text-gray-600">{booking.courtName} - {booking.venueName}</div>
                      <div className="text-sm text-gray-500">{booking.bookingDate} • {booking.startTime}-{booking.endTime}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{booking.totalAmount}</div>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'completed' ? 'secondary' : 'destructive'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="text-sm text-gray-500 text-center">
                  Total: {total} bookings
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">No bookings found</div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" asChild>
                <a href="/owner/dashboard">Owner Dashboard</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/owner/bookings">Manage Bookings</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/owner/facilities">Manage Facilities</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/owner/courts">Manage Courts</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle>Database Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statsError ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span>Stats API: {statsError ? 'Using Mock Data' : 'Connected to Database'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${bookings.length === 0 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span>Bookings API: {bookings.length === 0 ? 'No Data/Mock' : 'Database Connected'}</span>
              </div>
              <div className="text-sm text-gray-600 mt-4">
                <p><strong>Note:</strong> This application gracefully falls back to comprehensive mock data when database is unavailable.</p>
                <p>See <code>DATABASE_SETUP.md</code> for database configuration instructions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
