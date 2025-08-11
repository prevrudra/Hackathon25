"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { AnalyticsProcessor } from "@/lib/analytics-utils"

interface RevenueChartProps {
  data: { date: string; revenue: number }[]
  title?: string
  description?: string
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-3))",
  },
}

export function RevenueChart({
  data,
  title = "Revenue Trends",
  description = "Daily revenue over time",
}: RevenueChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    formattedRevenue: AnalyticsProcessor.formatCurrency(item.revenue),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => AnalyticsProcessor.formatCurrency(value)} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [AnalyticsProcessor.formatCurrency(value), "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
