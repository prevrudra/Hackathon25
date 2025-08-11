import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FacilityOwnerStats } from "@/lib/owner-data"
import { format, parseISO } from "date-fns"

interface RecentBookingsProps {
  stats: FacilityOwnerStats
}

export function RecentBookings({ stats }: RecentBookingsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{booking.userName}</span>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{booking.courtName}</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(booking.date), "MMM dd")} • {booking.time}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{booking.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
