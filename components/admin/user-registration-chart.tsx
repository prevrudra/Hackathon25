"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import type { AdminStats } from "@/lib/admin-data"

interface UserRegistrationChartProps {
  stats: AdminStats
}

const chartConfig = {
  users: {
    label: "Users",
    color: "#3B82F6", // Blue
  },
  owners: {
    label: "Facility Owners",
    color: "#EF4444", // Red
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
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                name="Users"
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#3B82F6" }}
              />
              <Line 
                type="monotone" 
                dataKey="owners" 
                name="Facility Owners"
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#EF4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
