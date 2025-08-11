"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import type { AdminStats } from "@/lib/admin-data"

interface SportPopularityChartProps {
  stats: AdminStats
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const chartConfig = {
  bookings: {
    label: "Bookings",
  },
}

export function SportPopularityChart({ stats }: SportPopularityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sport Popularity</CardTitle>
        <CardDescription>Distribution of bookings by sport type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.sportPopularity}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ sport, percentage }) => `${sport} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="bookings"
              >
                {stats.sportPopularity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {stats.sportPopularity.map((sport, index) => (
            <div key={sport.sport} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span>
                {sport.sport}: {sport.bookings}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
