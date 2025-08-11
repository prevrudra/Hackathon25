// Real-time data simulation utilities
export class RealTimeDataSimulator {
  private static intervals: Map<string, NodeJS.Timeout> = new Map()

  static startBookingUpdates(callback: (booking: any) => void, intervalMs = 30000) {
    const intervalId = setInterval(() => {
      const mockBooking = {
        id: Math.random().toString(36).substr(2, 9),
        user_name: `User ${Math.floor(Math.random() * 1000)}`,
        venue_name: ["Elite Sports Complex", "City Badminton Center", "Premium Courts"][Math.floor(Math.random() * 3)],
        court_name: `Court ${Math.floor(Math.random() * 5) + 1}`,
        sport_type: ["Badminton", "Table Tennis", "Squash"][Math.floor(Math.random() * 3)],
        booking_date: new Date().toISOString().split("T")[0],
        start_time: `${Math.floor(Math.random() * 12) + 8}:00`,
        total_amount: Math.floor(Math.random() * 1000) + 500,
        status: "confirmed",
        created_at: new Date().toISOString(),
      }
      callback(mockBooking)
    }, intervalMs)

    this.intervals.set("bookings", intervalId)
    return intervalId
  }

  static startRevenueUpdates(callback: (revenue: number) => void, intervalMs = 60000) {
    const intervalId = setInterval(() => {
      const mockRevenue = Math.floor(Math.random() * 5000) + 1000
      callback(mockRevenue)
    }, intervalMs)

    this.intervals.set("revenue", intervalId)
    return intervalId
  }

  static stopUpdates(type?: string) {
    if (type) {
      const intervalId = this.intervals.get(type)
      if (intervalId) {
        clearInterval(intervalId)
        this.intervals.delete(type)
      }
    } else {
      // Stop all intervals
      this.intervals.forEach((intervalId) => {
        clearInterval(intervalId)
      })
      this.intervals.clear()
    }
  }

  static generateMockAnalyticsData(days = 30) {
    const data = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      data.push({
        date: date.toISOString().split("T")[0],
        bookings: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 25000) + 5000,
        users: Math.floor(Math.random() * 20) + 2,
        owners: Math.floor(Math.random() * 5) + 1,
      })
    }

    return data
  }
}
