"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/owner/stats-cards"
import { BookingTrendsChart } from "@/components/owner/booking-trends-chart"
import { PeakHoursChart } from "@/components/owner/peak-hours-chart"
import { RecentBookings } from "@/components/owner/recent-bookings"
<<<<<<< HEAD
import { useCurrentOwnerId, useOwnerStats, useBookingTrends, usePeakHours } from "@/hooks/use-owner-data"
=======
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
import { mockOwnerStats } from "@/lib/owner-data"
import Link from "next/link"

export default function OwnerDashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
<<<<<<< HEAD
  const ownerId = useCurrentOwnerId()
  
  // Fetch real data from database
  const { stats, loading: statsLoading, error: statsError } = useOwnerStats(ownerId)
  const { trends, loading: trendsLoading } = useBookingTrends(ownerId, 7)
  const { peakHours, loading: peakHoursLoading } = usePeakHours(ownerId)
=======
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "facility_owner")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

<<<<<<< HEAD
  if (isLoading || statsLoading) {
=======
  if (isLoading) {
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
<<<<<<< HEAD
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
=======
          <p className="mt-2 text-muted-foreground">Loading...</p>
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
        </div>
      </div>
    )
  }

  if (!user || user.role !== "facility_owner") {
    return null
  }

<<<<<<< HEAD
  // Handle database connection errors gracefully
  const isUsingRealData = stats && !statsError

=======
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
  const handleLogout = () => {
    logout()
    router.push("/")
  }

<<<<<<< HEAD
  // Use real data if available, fallback to mock data
  const dashboardStats = stats || mockOwnerStats
  const chartTrends = trends.length > 0 ? trends : mockOwnerStats.bookingTrends
  const chartPeakHours = peakHours.length > 0 ? peakHours : mockOwnerStats.peakHours

=======
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Facility Owner Dashboard</h1>
              <p className="text-gray-600">Manage your facilities and track performance</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.fullName}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
<<<<<<< HEAD
          {/* Database Status Indicator */}
          {isUsingRealData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Live Database Connected
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Real-time data from SQLite database. All statistics are live and up-to-date.
                      {ownerId && ` (Owner ID: ${ownerId})`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isUsingRealData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Using Fallback Data
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Database connection issue. Showing demo data.
                      {ownerId && ` (Owner ID: ${ownerId})`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <StatsCards stats={dashboardStats} />

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            <BookingTrendsChart 
              stats={{
                ...mockOwnerStats,
                bookingTrends: chartTrends
              }} 
              loading={trendsLoading}
            />
            <PeakHoursChart 
              stats={{
                ...mockOwnerStats,
                peakHours: chartPeakHours
              }} 
              loading={peakHoursLoading}
            />
          </div>

          {/* Performance Summary */}
          {isUsingRealData && chartTrends.length > 0 && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Weekly Performance Summary</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {chartTrends.reduce((sum, trend) => sum + (trend.bookings || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{chartTrends.reduce((sum, trend) => sum + (trend.earnings || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {chartPeakHours.length > 0 ? 
                      chartPeakHours.reduce((peak, hour) => (hour.bookings || 0) > (peak.bookings || 0) ? hour : peak).hour 
                      : "N/A"
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Peak Hour</div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentBookings 
                stats={mockOwnerStats} 
                ownerId={ownerId}
              />
=======
          {/* Stats Overview */}
          <StatsCards stats={mockOwnerStats} />

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            <BookingTrendsChart stats={mockOwnerStats} />
            <PeakHoursChart stats={mockOwnerStats} />
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentBookings stats={mockOwnerStats} />
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/owner/facilities">Manage Facilities</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/owner/bookings">View All Bookings</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/owner/courts">Manage Courts</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
