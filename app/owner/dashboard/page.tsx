"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/owner/stats-cards"
import { BookingTrendsChart } from "@/components/owner/booking-trends-chart"
import { PeakHoursChart } from "@/components/owner/peak-hours-chart"
import { RecentBookings } from "@/components/owner/recent-bookings"
import { mockOwnerStats } from "@/lib/owner-data"
import Link from "next/link"

export default function OwnerDashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

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

  const handleLogout = () => {
    logout()
    router.push("/")
  }

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
