"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminStatsCards } from "@/components/admin/admin-stats-cards"
import { UserRegistrationChart } from "@/components/admin/user-registration-chart"
import { SportPopularityChart } from "@/components/admin/sport-popularity-chart"
import { RecentActivity } from "@/components/admin/recent-activity"
import { AdminStats } from "@/lib/admin-data"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const stats = await response.json()
          setAdminStats(stats)
        } else {
          console.error('Failed to fetch admin stats')
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    if (user && user.role === "admin") {
      fetchAdminStats()
    }
  }, [user])

  if (isLoading || statsLoading) {
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

  if (!adminStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load admin dashboard data</p>
        </div>
      </div>
    )
  }

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-gray-600">Platform overview and management</p>
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
          {/* Stats Overview */}
          <AdminStatsCards stats={adminStats} />

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            <UserRegistrationChart stats={adminStats} />
            <SportPopularityChart stats={adminStats} />
          </div>

          {/* Activity and Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivity stats={adminStats} />
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/admin/facilities">Review Facilities ({adminStats.pendingApprovals})</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/admin/users">Manage Users</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/admin/reports">View Reports</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Platform Status</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Operational</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Courts</span>
                      <span className="text-sm font-medium">{adminStats.totalActiveCourts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Reviews</span>
                      <span className="text-sm font-medium">{adminStats.pendingApprovals}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
