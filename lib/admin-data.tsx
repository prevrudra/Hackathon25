export interface AdminStats {
  totalUsers: number
  totalFacilityOwners: number
  totalBookings: number
  totalActiveCourts: number
  pendingApprovals: number
  totalRevenue: number
  userRegistrationTrends: {
    date: string
    users: number
    owners: number
  }[]
  bookingActivityTrends: {
    date: string
    bookings: number
    revenue: number
  }[]
  sportPopularity: {
    sport: string
    bookings: number
    percentage: number
  }[]
  recentActivity: {
    id: string
    type: "user_registration" | "facility_submission" | "booking" | "facility_approval"
    description: string
    timestamp: string
    status?: string
  }[]
}

export interface PendingFacility {
  id: string
  name: string
  ownerName: string
  ownerEmail: string
  location: string
  sports: string[]
  courts: number
  submittedAt: string
  description: string
  images: string[]
  amenities: string[]
}

export interface PlatformUser {
  id: string
  fullName: string
  email: string
  role: "user" | "facility_owner"
  isVerified: boolean
  isBanned: boolean
  joinedAt: string
  totalBookings: number
  totalSpent: number
  lastActive: string
}

// Mock admin data
export const mockAdminStats: AdminStats = {
  totalUsers: 1247,
  totalFacilityOwners: 89,
  totalBookings: 3456,
  totalActiveCourts: 234,
  pendingApprovals: 7,
  totalRevenue: 2845600,
  userRegistrationTrends: [
    { date: "Dec 10", users: 15, owners: 2 },
    { date: "Dec 11", users: 23, owners: 3 },
    { date: "Dec 12", users: 18, owners: 1 },
    { date: "Dec 13", users: 31, owners: 4 },
    { date: "Dec 14", users: 27, owners: 2 },
    { date: "Dec 15", users: 35, owners: 5 },
    { date: "Dec 16", users: 29, owners: 3 },
  ],
  bookingActivityTrends: [
    { date: "Dec 10", bookings: 145, revenue: 218000 },
    { date: "Dec 11", bookings: 167, revenue: 251000 },
    { date: "Dec 12", bookings: 134, revenue: 201000 },
    { date: "Dec 13", bookings: 189, revenue: 284000 },
    { date: "Dec 14", bookings: 203, revenue: 305000 },
    { date: "Dec 15", bookings: 178, revenue: 267000 },
    { date: "Dec 16", bookings: 195, revenue: 293000 },
  ],
  sportPopularity: [
    { sport: "Badminton", bookings: 1245, percentage: 36 },
    { sport: "Football", bookings: 892, percentage: 26 },
    { sport: "Tennis", bookings: 654, percentage: 19 },
    { sport: "Basketball", bookings: 423, percentage: 12 },
    { sport: "Table Tennis", bookings: 242, percentage: 7 },
  ],
  recentActivity: [
    {
      id: "1",
      type: "facility_submission",
      description: "New facility 'Elite Sports Complex' submitted for approval",
      timestamp: "2024-12-16T10:30:00Z",
      status: "pending",
    },
    {
      id: "2",
      type: "user_registration",
      description: "New user 'Rahul Sharma' registered as sports player",
      timestamp: "2024-12-16T09:15:00Z",
    },
    {
      id: "3",
      type: "facility_approval",
      description: "Facility 'Green Turf Arena' approved and activated",
      timestamp: "2024-12-16T08:45:00Z",
      status: "approved",
    },
    {
      id: "4",
      type: "booking",
      description: "High booking activity: 195 bookings today",
      timestamp: "2024-12-16T08:00:00Z",
    },
  ],
}

export const mockPendingFacilities: PendingFacility[] = [
  {
    id: "pending-1",
    name: "Elite Sports Complex",
    ownerName: "Rajesh Kumar",
    ownerEmail: "rajesh@example.com",
    location: "Andheri West, Mumbai",
    sports: ["Badminton", "Tennis", "Squash"],
    courts: 8,
    submittedAt: "2024-12-15T14:30:00Z",
    description: "Premium sports facility with state-of-the-art equipment and modern amenities.",
    images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    amenities: ["Parking", "AC", "Changing Rooms", "Cafeteria", "Equipment Rental"],
  },
  {
    id: "pending-2",
    name: "Victory Football Ground",
    ownerName: "Priya Patel",
    ownerEmail: "priya@example.com",
    location: "Borivali East, Mumbai",
    sports: ["Football"],
    courts: 2,
    submittedAt: "2024-12-14T11:20:00Z",
    description: "Professional football turf with floodlights for evening matches.",
    images: ["/placeholder.svg?height=300&width=400"],
    amenities: ["Floodlights", "Parking", "First Aid", "Changing Rooms"],
  },
  {
    id: "pending-3",
    name: "Champion Basketball Arena",
    ownerName: "Amit Singh",
    ownerEmail: "amit@example.com",
    location: "Thane West, Mumbai",
    sports: ["Basketball"],
    courts: 3,
    submittedAt: "2024-12-13T16:45:00Z",
    description: "Indoor basketball courts with wooden flooring and professional setup.",
    images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    amenities: ["Indoor", "AC", "Sound System", "Scoreboard", "Parking"],
  },
]

export const mockPlatformUsers: PlatformUser[] = [
  {
    id: "user-1",
    fullName: "Rahul Sharma",
    email: "rahul@example.com",
    role: "user",
    isVerified: true,
    isBanned: false,
    joinedAt: "2024-11-15T10:30:00Z",
    totalBookings: 23,
    totalSpent: 34500,
    lastActive: "2024-12-16T08:30:00Z",
  },
  {
    id: "user-2",
    fullName: "Priya Patel",
    email: "priya@example.com",
    role: "facility_owner",
    isVerified: true,
    isBanned: false,
    joinedAt: "2024-10-20T14:20:00Z",
    totalBookings: 0,
    totalSpent: 0,
    lastActive: "2024-12-16T07:15:00Z",
  },
  {
    id: "user-3",
    fullName: "Amit Kumar",
    email: "amit@example.com",
    role: "user",
    isVerified: true,
    isBanned: false,
    joinedAt: "2024-12-01T09:45:00Z",
    totalBookings: 8,
    totalSpent: 12000,
    lastActive: "2024-12-15T19:20:00Z",
  },
  {
    id: "user-4",
    fullName: "Sneha Singh",
    email: "sneha@example.com",
    role: "user",
    isVerified: false,
    isBanned: false,
    joinedAt: "2024-12-10T16:30:00Z",
    totalBookings: 2,
    totalSpent: 2400,
    lastActive: "2024-12-14T12:10:00Z",
  },
  {
    id: "user-5",
    fullName: "Ravi Malhotra",
    email: "ravi@example.com",
    role: "user",
    isVerified: true,
    isBanned: true,
    joinedAt: "2024-09-15T11:20:00Z",
    totalBookings: 45,
    totalSpent: 67500,
    lastActive: "2024-12-10T15:45:00Z",
  },
]
