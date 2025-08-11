export interface FacilityOwnerStats {
  totalBookings: number
  totalEarnings: number
  activeFacilities: number
  totalCourts: number
  bookingTrends: {
    date: string
    bookings: number
    earnings: number
  }[]
  peakHours: {
    hour: string
    bookings: number
  }[]
  recentBookings: {
    id: string
    userName: string
    courtName: string
    date: string
    time: string
    status: string
    amount: number
  }[]
}

// Mock data for facility owner dashboard
export const mockOwnerStats: FacilityOwnerStats = {
  totalBookings: 156,
  totalEarnings: 234500,
  activeFacilities: 2,
  totalCourts: 8,
  bookingTrends: [
    { date: "Dec 10", bookings: 12, earnings: 18000 },
    { date: "Dec 11", bookings: 15, earnings: 22500 },
    { date: "Dec 12", bookings: 8, earnings: 12000 },
    { date: "Dec 13", bookings: 18, earnings: 27000 },
    { date: "Dec 14", bookings: 22, earnings: 33000 },
    { date: "Dec 15", bookings: 16, earnings: 24000 },
    { date: "Dec 16", bookings: 20, earnings: 30000 },
  ],
  peakHours: [
    { hour: "06:00", bookings: 5 },
    { hour: "07:00", bookings: 8 },
    { hour: "08:00", bookings: 12 },
    { hour: "09:00", bookings: 15 },
    { hour: "10:00", bookings: 18 },
    { hour: "11:00", bookings: 14 },
    { hour: "12:00", bookings: 10 },
    { hour: "13:00", bookings: 8 },
    { hour: "14:00", bookings: 12 },
    { hour: "15:00", bookings: 16 },
    { hour: "16:00", bookings: 22 },
    { hour: "17:00", bookings: 28 },
    { hour: "18:00", bookings: 35 },
    { hour: "19:00", bookings: 32 },
    { hour: "20:00", bookings: 25 },
    { hour: "21:00", bookings: 18 },
    { hour: "22:00", bookings: 12 },
  ],
  recentBookings: [
    {
      id: "b1",
      userName: "Rahul Sharma",
      courtName: "Badminton Court 1",
      date: "2024-12-20",
      time: "18:00-19:00",
      status: "confirmed",
      amount: 1200,
    },
    {
      id: "b2",
      userName: "Priya Patel",
      courtName: "Tennis Court A",
      date: "2024-12-20",
      time: "16:00-17:00",
      status: "confirmed",
      amount: 1800,
    },
    {
      id: "b3",
      userName: "Amit Kumar",
      courtName: "Football Turf",
      date: "2024-12-19",
      time: "19:00-20:00",
      status: "completed",
      amount: 2500,
    },
    {
      id: "b4",
      userName: "Sneha Singh",
      courtName: "Badminton Court 2",
      date: "2024-12-19",
      time: "17:00-18:00",
      status: "completed",
      amount: 1200,
    },
  ],
}
