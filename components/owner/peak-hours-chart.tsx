"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
<<<<<<< HEAD
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
=======
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
import type { FacilityOwnerStats } from "@/lib/owner-data"

interface PeakHoursChartProps {
  stats: FacilityOwnerStats
<<<<<<< HEAD
  loading?: boolean
=======
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
}

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-3))",
  },
}

<<<<<<< HEAD
export function PeakHoursChart({ stats, loading }: PeakHoursChartProps) {
  const hasData = stats.peakHours && stats.peakHours.length > 0
  const totalBookings = hasData ? stats.peakHours.reduce((sum, hour) => sum + (hour.bookings || 0), 0) : 0
  const peakHour = hasData ? stats.peakHours.reduce((peak, hour) => 
    (hour.bookings || 0) > (peak.bookings || 0) ? hour : peak
  ) : null

=======
export function PeakHoursChart({ stats }: PeakHoursChartProps) {
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
  return (
    <Card>
      <CardHeader>
        <CardTitle>Peak Booking Hours</CardTitle>
<<<<<<< HEAD
        <CardDescription>
          {hasData && peakHour ? (
            `Peak: ${peakHour.hour} (${peakHour.bookings} bookings) | Total: ${totalBookings} bookings`
          ) : (
            "Hourly booking distribution over the last 30 days"
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
              <p className="text-sm">Start accepting bookings to see peak hours</p>
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.peakHours} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="hour" 
                  className="text-sm fill-muted-foreground"
                  interval={1}
                />
                <YAxis className="text-sm fill-muted-foreground" />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${value} bookings`, 'Bookings']}
                  labelFormatter={(label) => `${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="var(--color-bookings)"
                  fill="var(--color-bookings)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
=======
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
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
      </CardContent>
    </Card>
  )
}
