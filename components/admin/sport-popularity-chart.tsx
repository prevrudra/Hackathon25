"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import type { AdminStats } from "@/lib/admin-data"

interface SportPopularityChartProps {
  stats: AdminStats
}

const COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
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
                label={({ sport, percentage }) => percentage > 5 ? `${sport} ${percentage}%` : ''}
                outerRadius={100}
                innerRadius={30}
                fill="#8884d8"
                dataKey="bookings"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {stats.sportPopularity.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [`${value} bookings`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {stats.sportPopularity.map((sport, index) => (
            <div key={sport.sport} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <span className="text-gray-700">
                {sport.sport}: {sport.bookings} ({sport.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
