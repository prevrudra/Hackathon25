// Analytics utilities for data processing and calculations
export interface DateRange {
  from: Date
  to: Date
}

export interface AnalyticsData {
  date: string
  value: number
  label?: string
}

export class AnalyticsProcessor {
  static generateDateRange(days: number): DateRange {
    const to = new Date()
    const from = new Date()
    from.setDate(to.getDate() - days)
    return { from, to }
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  static aggregateByPeriod(data: AnalyticsData[], period: "day" | "week" | "month"): AnalyticsData[] {
    const grouped = new Map<string, number>()

    data.forEach((item) => {
      const date = new Date(item.date)
      let key: string

      switch (period) {
        case "week":
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = weekStart.toISOString().split("T")[0]
          break
        case "month":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          break
        default:
          key = item.date
      }

      grouped.set(key, (grouped.get(key) || 0) + item.value)
    })

    return Array.from(grouped.entries()).map(([date, value]) => ({
      date,
      value,
    }))
  }

  static generateReportData(
    bookings: any[],
    dateRange: DateRange,
  ): {
    totalBookings: number
    totalRevenue: number
    averageBookingValue: number
    peakHours: { hour: number; count: number }[]
    popularSports: { sport: string; count: number }[]
  } {
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.booking_date)
      return bookingDate >= dateRange.from && bookingDate <= dateRange.to
    })

    const totalBookings = filteredBookings.length
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.total_amount, 0)
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

    // Calculate peak hours
    const hourCounts = new Map<number, number>()
    filteredBookings.forEach((booking) => {
      const hour = Number.parseInt(booking.start_time.split(":")[0])
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
    })
    const peakHours = Array.from(hourCounts.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate popular sports
    const sportCounts = new Map<string, number>()
    filteredBookings.forEach((booking) => {
      const sport = booking.court?.sport_type || "Unknown"
      sportCounts.set(sport, (sportCounts.get(sport) || 0) + 1)
    })
    const popularSports = Array.from(sportCounts.entries())
      .map(([sport, count]) => ({ sport, count }))
      .sort((a, b) => b.count - a.count)

    return {
      totalBookings,
      totalRevenue,
      averageBookingValue,
      peakHours,
      popularSports,
    }
  }
}

export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
