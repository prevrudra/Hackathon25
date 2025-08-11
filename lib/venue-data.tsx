export interface Venue {
  id: string
  name: string
  description: string
  address: string
  location: {
    city: string
    area: string
  }
  sports: string[]
  amenities: string[]
  images: string[]
  rating: number
  reviewCount: number
  priceRange: {
    min: number
    max: number
  }
  courts: Court[]
  isApproved: boolean
  ownerId: string
}

export interface Court {
  id: string
  name: string
  sportType: string
  pricePerHour: number
  operatingHours: {
    start: string
    end: string
  }
  isActive: boolean
}

export interface Booking {
  id: string
  userId: string
  venueId: string
  courtId: string
  date: string
  timeSlot: string
  duration: number
  totalPrice: number
  status: "confirmed" | "cancelled" | "completed"
  createdAt: string
}

// Mock venue data
export const mockVenues: Venue[] = [
  {
    id: "1",
    name: "SportZone Arena",
    description: "Premium sports facility with state-of-the-art courts and modern amenities.",
    address: "123 Sports Street, Downtown",
    location: {
      city: "Mumbai",
      area: "Bandra West",
    },
    sports: ["Badminton", "Table Tennis", "Squash"],
    amenities: ["Parking", "Changing Rooms", "Cafeteria", "AC", "Equipment Rental"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    rating: 4.8,
    reviewCount: 124,
    priceRange: {
      min: 800,
      max: 1500,
    },
    courts: [
      {
        id: "c1",
        name: "Badminton Court 1",
        sportType: "Badminton",
        pricePerHour: 1200,
        operatingHours: { start: "06:00", end: "23:00" },
        isActive: true,
      },
      {
        id: "c2",
        name: "Badminton Court 2",
        sportType: "Badminton",
        pricePerHour: 1200,
        operatingHours: { start: "06:00", end: "23:00" },
        isActive: true,
      },
      {
        id: "c3",
        name: "TT Table 1",
        sportType: "Table Tennis",
        pricePerHour: 800,
        operatingHours: { start: "07:00", end: "22:00" },
        isActive: true,
      },
    ],
    isApproved: true,
    ownerId: "2",
  },
  {
    id: "2",
    name: "Green Turf Football Ground",
    description: "Professional football turf with floodlights for evening matches.",
    address: "456 Ground Avenue, Sports Complex",
    location: {
      city: "Mumbai",
      area: "Andheri East",
    },
    sports: ["Football"],
    amenities: ["Floodlights", "Parking", "Changing Rooms", "First Aid"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    rating: 4.5,
    reviewCount: 89,
    priceRange: {
      min: 2000,
      max: 3000,
    },
    courts: [
      {
        id: "c4",
        name: "Main Turf",
        sportType: "Football",
        pricePerHour: 2500,
        operatingHours: { start: "06:00", end: "24:00" },
        isActive: true,
      },
    ],
    isApproved: true,
    ownerId: "2",
  },
  {
    id: "3",
    name: "Ace Tennis Club",
    description: "Premium tennis courts with professional coaching available.",
    address: "789 Tennis Lane, Club District",
    location: {
      city: "Mumbai",
      area: "Powai",
    },
    sports: ["Tennis"],
    amenities: ["Pro Shop", "Coaching", "Parking", "Clubhouse", "Refreshments"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    rating: 4.9,
    reviewCount: 156,
    priceRange: {
      min: 1500,
      max: 2000,
    },
    courts: [
      {
        id: "c5",
        name: "Court A",
        sportType: "Tennis",
        pricePerHour: 1800,
        operatingHours: { start: "06:00", end: "22:00" },
        isActive: true,
      },
      {
        id: "c6",
        name: "Court B",
        sportType: "Tennis",
        pricePerHour: 1800,
        operatingHours: { start: "06:00", end: "22:00" },
        isActive: true,
      },
    ],
    isApproved: true,
    ownerId: "2",
  },
  {
    id: "4",
    name: "Urban Basketball Arena",
    description: "Indoor basketball court with wooden flooring and professional setup.",
    address: "321 Hoop Street, Sports City",
    location: {
      city: "Mumbai",
      area: "Malad West",
    },
    sports: ["Basketball"],
    amenities: ["Indoor", "AC", "Sound System", "Scoreboard", "Parking"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    rating: 4.6,
    reviewCount: 73,
    priceRange: {
      min: 1800,
      max: 2200,
    },
    courts: [
      {
        id: "c7",
        name: "Main Court",
        sportType: "Basketball",
        pricePerHour: 2000,
        operatingHours: { start: "07:00", end: "23:00" },
        isActive: true,
      },
    ],
    isApproved: true,
    ownerId: "2",
  },
  {
    id: "5",
    name: "Shuttle Point Badminton",
    description: "Dedicated badminton facility with multiple courts and tournament hosting.",
    address: "654 Racket Road, Game Zone",
    location: {
      city: "Mumbai",
      area: "Goregaon West",
    },
    sports: ["Badminton"],
    amenities: ["Multiple Courts", "Equipment Rental", "Coaching", "Tournaments", "Parking"],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    rating: 4.7,
    reviewCount: 98,
    priceRange: {
      min: 1000,
      max: 1400,
    },
    courts: [
      {
        id: "c8",
        name: "Court 1",
        sportType: "Badminton",
        pricePerHour: 1200,
        operatingHours: { start: "06:00", end: "23:00" },
        isActive: true,
      },
      {
        id: "c9",
        name: "Court 2",
        sportType: "Badminton",
        pricePerHour: 1200,
        operatingHours: { start: "06:00", end: "23:00" },
        isActive: true,
      },
      {
        id: "c10",
        name: "Court 3",
        sportType: "Badminton",
        pricePerHour: 1000,
        operatingHours: { start: "06:00", end: "23:00" },
        isActive: true,
      },
    ],
    isApproved: true,
    ownerId: "2",
  },
]

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: "b1",
    userId: "3",
    venueId: "1",
    courtId: "c1",
    date: "2024-12-20",
    timeSlot: "18:00-19:00",
    duration: 1,
    totalPrice: 1200,
    status: "confirmed",
    createdAt: "2024-12-15T10:30:00Z",
  },
  {
    id: "b2",
    userId: "3",
    venueId: "2",
    courtId: "c4",
    date: "2024-12-18",
    timeSlot: "16:00-17:00",
    duration: 1,
    totalPrice: 2500,
    status: "completed",
    createdAt: "2024-12-10T14:20:00Z",
  },
]
