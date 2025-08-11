"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { FacilityOwnerStats } from "@/lib/owner-data"

interface PeakHoursChartProps {
  stats: FacilityOwnerStats
}

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-3))",
  },
}

export function PeakHoursChart({ stats }: PeakHoursChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Peak Booking Hours</CardTitle>
        <CardDescription>Hourly booking distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.peakHours}>
              <XAxis dataKey="hour" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="var(--color-bookings)"
                fill="var(--color-bookings)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
