'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, Calendar, Clock, Trophy } from 'lucide-react'

interface ReportsData {
  totalUsers: number
  totalFacilityOwners: number
  totalBookings: number
  totalActiveCourts: number
  totalRevenue: number
  monthlyBookings: Array<{
    month: string
    totalBookings: number
    totalRevenue: number
    avgBookingValue: number
    uniqueUsers: number
  }>
  venuePerformance: Array<{
    venueName: string
    location: string
    totalBookings: number
    totalRevenue: number
    avgBookingValue: number
    uniqueCustomers: number
  }>
  userActivityPatterns: Array<{
    activityLevel: string
    userCount: number
    avgSpent: number
  }>
  peakBookingTimes: Array<{
    timePeriod: string
    bookingCount: number
    percentage: number
  }>
  sportRevenue: Array<{
    sportType: string
    totalBookings: number
    totalRevenue: number
    avgBookingValue: number
    revenuePercentage: number
  }>
}

export default function AdminReportsPage() {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReportsData()
  }, [])

  const fetchReportsData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/reports')
      
      if (!response.ok) {
        throw new Error('Failed to fetch reports data')
      }
      
      const data = await response.json()
      setReportsData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              <p className="text-white/70">Loading reports...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-red-50/10 border-red-200/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-red-400">Error: {error}</p>
              <Button onClick={fetchReportsData} className="mt-4 bg-purple-600 hover:bg-purple-700">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!reportsData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Admin Reports
            </h1>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white/70">Total Users</p>
                  <p className="text-2xl font-bold text-white">{reportsData.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white/70">Total Bookings</p>
                  <p className="text-2xl font-bold text-white">{reportsData.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-white/70">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(reportsData.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-white/70">Active Courts</p>
                  <p className="text-2xl font-bold text-white">{reportsData.totalActiveCourts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span>Monthly Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.monthlyBookings.length > 0 ? (
                reportsData.monthlyBookings.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="border-purple-400 text-purple-300">{month.month}</Badge>
                      <div>
                        <p className="font-medium text-white">{month.totalBookings} bookings</p>
                        <p className="text-sm text-white/60">{month.uniqueUsers} unique users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{formatCurrency(month.totalRevenue)}</p>
                      <p className="text-sm text-white/60">Avg: {formatCurrency(month.avgBookingValue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/60 text-center py-8">No monthly data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Venue Performance */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Venues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.venuePerformance.length > 0 ? (
                reportsData.venuePerformance.slice(0, 5).map((venue, index) => (
                  <div key={venue.venueName} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div>
                      <p className="font-medium text-white">{venue.venueName}</p>
                      <p className="text-sm text-white/60">{venue.location}</p>
                      <p className="text-sm text-white/60">{venue.totalBookings} bookings • {venue.uniqueCustomers} customers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{formatCurrency(venue.totalRevenue)}</p>
                      <p className="text-sm text-white/60">Avg: {formatCurrency(venue.avgBookingValue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/60 text-center py-8">No venue data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Activity & Peak Times */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">User Activity Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.userActivityPatterns.length > 0 ? (
                  reportsData.userActivityPatterns.map((pattern) => (
                    <div key={pattern.activityLevel} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="font-medium text-white">{pattern.activityLevel}</p>
                        <p className="text-sm text-white/60">{pattern.userCount} users</p>
                      </div>
                      <p className="font-medium text-green-400">{formatCurrency(pattern.avgSpent)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-center py-8">No activity data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>Peak Booking Times</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.peakBookingTimes.length > 0 ? (
                  reportsData.peakBookingTimes.map((time) => (
                    <div key={time.timePeriod} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="font-medium text-white">{time.timePeriod}</p>
                      <div className="text-right">
                        <p className="font-medium text-white">{time.bookingCount} bookings</p>
                        <p className="text-sm text-white/60">{time.percentage}%</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-center py-8">No booking time data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sport Revenue Breakdown */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Sport Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.sportRevenue.length > 0 ? (
                reportsData.sportRevenue.map((sport) => (
                  <div key={sport.sportType} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div>
                      <p className="font-medium capitalize text-white">{sport.sportType}</p>
                      <p className="text-sm text-white/60">{sport.totalBookings} bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{formatCurrency(sport.totalRevenue)}</p>
                      <p className="text-sm text-white/60">{sport.revenuePercentage}% of total</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/60 text-center py-8">No sport revenue data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
