"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { FacilityOwnerStats } from "@/lib/owner-data"

interface BookingTrendsChartProps {
  stats: FacilityOwnerStats
}

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-1))",
  },
  earnings: {
    label: "Earnings",
    color: "hsl(var(--chart-2))",
  },
}

export function BookingTrendsChart({ stats }: BookingTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Trends</CardTitle>
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
      </CardContent>
    </Card>
  )
}
