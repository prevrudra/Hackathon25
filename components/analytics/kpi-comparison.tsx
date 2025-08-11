"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { AnalyticsProcessor } from "@/lib/analytics-utils"

interface KPIComparisonProps {
  title: string
  current: number
  previous: number
  format?: "number" | "currency" | "percentage"
  suffix?: string
}

export function KPIComparison({ title, current, previous, format = "number", suffix = "" }: KPIComparisonProps) {
  const growthRate = AnalyticsProcessor.calculateGrowthRate(current, previous)
  const isPositive = growthRate > 0
  const isNegative = growthRate < 0

  const formatValue = (value: number) => {
    switch (format) {
      case "currency":
        return AnalyticsProcessor.formatCurrency(value)
      case "percentage":
        return `${value.toFixed(1)}%`
      default:
        return value.toLocaleString() + suffix
    }
  }

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus
  const trendColor = isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500"
  const badgeVariant = isPositive ? "default" : isNegative ? "destructive" : "secondary"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(current)}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Badge variant={badgeVariant} className="text-xs">
            {isPositive ? "+" : ""}
            {growthRate.toFixed(1)}%
          </Badge>
          <span>vs previous period</span>
        </div>
      </CardContent>
    </Card>
  )
}
