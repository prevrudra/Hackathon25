"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
<<<<<<< HEAD
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, ComposedChart } from "recharts"
import type { FacilityOwnerStats } from "@/lib/owner-data"
import type { BookingTrend } from "@/lib/sqlite-owner-database"

interface BookingTrendsChartProps {
  stats: FacilityOwnerStats
  loading?: boolean
=======
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { FacilityOwnerStats } from "@/lib/owner-data"

interface BookingTrendsChartProps {
  stats: FacilityOwnerStats
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
}

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-1))",
  },
  earnings: {
<<<<<<< HEAD
    label: "Earnings (₹)",
=======
    label: "Earnings",
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
    color: "hsl(var(--chart-2))",
  },
}

<<<<<<< HEAD
export function BookingTrendsChart({ stats, loading }: BookingTrendsChartProps) {
  const hasData = stats.bookingTrends && stats.bookingTrends.length > 0
  const totalBookings = hasData ? stats.bookingTrends.reduce((sum, trend) => sum + (trend.bookings || 0), 0) : 0
  const totalEarnings = hasData ? stats.bookingTrends.reduce((sum, trend) => sum + (trend.earnings || 0), 0) : 0

=======
export function BookingTrendsChart({ stats }: BookingTrendsChartProps) {
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Trends</CardTitle>
<<<<<<< HEAD
        <CardDescription>
          {hasData ? (
            `${totalBookings} bookings | ₹${totalEarnings.toLocaleString()} earnings this week`
          ) : (
            "Daily bookings and earnings over the last week"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No booking data available</p>
              <p className="text-sm">Start accepting bookings to see trends here</p>
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={stats.bookingTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-sm fill-muted-foreground"
                />
                <YAxis 
                  yAxisId="bookings"
                  className="text-sm fill-muted-foreground" 
                  orientation="left"
                />
                <YAxis 
                  yAxisId="earnings"
                  className="text-sm fill-muted-foreground" 
                  orientation="right"
                  tickFormatter={(value) => `₹${value}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => {
                    if (name === 'earnings') {
                      return [`₹${value}`, 'Earnings']
                    }
                    return [value, 'Bookings']
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="bookings"
                  dataKey="bookings" 
                  fill="var(--color-bookings)" 
                  name="Bookings"
                  radius={[2, 2, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
=======
        <CardDescription>Daily bookings and earnings over the last week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.bookingTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="bookings" fill="var(--color-bookings)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
      </CardContent>
    </Card>
  )
}
