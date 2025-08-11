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

export interface Review {
  id: string
  userId: string
  venueId: string
  bookingId?: string
  rating: number
  title: string
  comment: string
  isVerified: boolean
  isActive: boolean
  createdAt: string
  userName: string
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
    userId: "mock_user_1", // Changed from "3" to avoid conflict with real users
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
    userId: "mock_user_1", // Changed from "3" to avoid conflict with real users
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

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: "r1",
    userId: "mock_user_1", // Changed from "3" to avoid conflict with real users
    venueId: "1",
    bookingId: "mock_b1",
    rating: 5,
    title: "Excellent facility!",
    comment: "Amazing courts with great facilities. Will definitely book again!",
    isVerified: true,
    isActive: true,
    createdAt: "2024-12-19T10:30:00Z",
    userName: "John Doe"
  },
  {
    id: "r2",
    userId: "mock_user_2", // Changed from "4" to avoid conflict with real users
    venueId: "1",
    rating: 4,
    title: "Good experience",
    comment: "Clean courts and good service. Parking could be better.",
    isVerified: false,
    isActive: true,
    createdAt: "2024-12-18T15:45:00Z",
    userName: "Jane Smith"
  }
]

// Helper functions
export const getVenueReviews = (venueId: string): Review[] => {
  const storedReviews = JSON.parse(localStorage.getItem("venue_reviews") || "[]")
  const allReviews = [...mockReviews, ...storedReviews]
  return allReviews.filter(review => review.venueId === venueId && review.isActive)
}

export const getUserReviewForVenue = (userId: string, venueId: string): Review | null => {
  // Only get reviews from localStorage for real users, exclude mock data
  const storedReviews = JSON.parse(localStorage.getItem("venue_reviews") || "[]")
  return storedReviews.find((review: Review) => 
    review.userId === userId && 
    review.venueId === venueId && 
    review.isActive &&
    !review.userId.startsWith("mock_") // Exclude mock reviews
  ) || null
}

export const hasUserBookedVenue = (userId: string, venueId: string): boolean => {
  const storedBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
  const allBookings = [...mockBookings, ...storedBookings]
  return allBookings.some(booking => 
    booking.userId === userId && 
    booking.venueId === venueId && 
    (booking.status === "completed" || new Date(booking.date) < new Date())
  )
}

export const saveReview = (review: Omit<Review, "id" | "createdAt">): void => {
  const storedReviews = JSON.parse(localStorage.getItem("venue_reviews") || "[]")
  const newReview: Review = {
    ...review,
    id: `r${Date.now()}`,
    createdAt: new Date().toISOString()
  }
  storedReviews.push(newReview)
  localStorage.setItem("venue_reviews", JSON.stringify(storedReviews))
}
