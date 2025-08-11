"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { AdminStats } from "@/lib/admin-data"

interface UserRegistrationChartProps {
  stats: AdminStats
}

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
  owners: {
    label: "Facility Owners",
    color: "hsl(var(--chart-2))",
  },
}

export function UserRegistrationChart({ stats }: UserRegistrationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Registration Trends</CardTitle>
        <CardDescription>Daily user and facility owner registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.userRegistrationTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
              <Line type="monotone" dataKey="owners" stroke="var(--color-owners)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
