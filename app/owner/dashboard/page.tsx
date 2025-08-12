"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/owner/stats-cards"
import { BookingTrendsChart } from "@/components/owner/booking-trends-chart"
import { PeakHoursChart } from "@/components/owner/peak-hours-chart"
import { RecentBookings } from "@/components/owner/recent-bookings"
import { useCurrentOwnerId, useOwnerStats, useBookingTrends, usePeakHours } from "@/hooks/use-owner-data"
import { mockOwnerStats } from "@/lib/owner-data"
import Link from "next/link"

export default function OwnerDashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const ownerId = useCurrentOwnerId()
  const { stats, loading: statsLoading, error: statsError } = useOwnerStats(ownerId)
  const { trends, loading: trendsLoading } = useBookingTrends(ownerId, 7)
  const { peakHours, loading: peakHoursLoading } = usePeakHours(ownerId)
  const dashboardStats = stats || mockOwnerStats
  const chartTrends = trends.length > 0 ? trends : mockOwnerStats.bookingTrends
  const chartPeakHours = peakHours.length > 0 ? peakHours : mockOwnerStats.peakHours

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("DEBUG: OwnerDashboardPage ownerId:", ownerId)
      console.log("DEBUG: dashboardStats:", dashboardStats)
      console.log("DEBUG: chartTrends:", chartTrends)
      console.log("DEBUG: chartPeakHours:", chartPeakHours)
    }
  }, [ownerId, dashboardStats, chartTrends, chartPeakHours])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "facility_owner")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "facility_owner") {
    return null
  }

  // Handle database connection errors gracefully
  const isUsingRealData = stats && !statsError

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Facility Owner Dashboard</h1>
              <p className="text-gray-600">Manage your facilities and track performance</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.fullName}</span>
              <Button variant="outline" onClick={handleLogout} className="border-indigo-200 hover:bg-indigo-50">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
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
                ...dashboardStats,
                bookingTrends: chartTrends,
                peakHours: mockOwnerStats.peakHours,
                recentBookings: mockOwnerStats.recentBookings
              }} 
              loading={trendsLoading}
            />
            <PeakHoursChart 
              stats={{
                ...dashboardStats,
                peakHours: chartPeakHours,
                bookingTrends: mockOwnerStats.bookingTrends,
                recentBookings: mockOwnerStats.recentBookings
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
