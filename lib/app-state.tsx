"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Venue, Court, Booking } from "./venue-data"
import type { PendingFacility, PlatformUser, AdminStats } from "./admin-data"
import type { FacilityOwnerStats } from "./owner-data"

interface Review {
  id: string
  venueId: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
}

interface AppState {
  venues: Venue[]
  bookings: Booking[]
  pendingFacilities: PendingFacility[]
  platformUsers: PlatformUser[]
  adminStats: AdminStats
  ownerStats: FacilityOwnerStats
  reviews: Review[] // Added reviews to app state
}

interface AppContextType extends AppState {
  // Venue operations
  addVenue: (venue: Omit<Venue, "id">) => void
  updateVenue: (id: string, updates: Partial<Venue>) => void
  deleteVenue: (id: string) => void

  // Booking operations
  createBooking: (booking: Omit<Booking, "id" | "createdAt">) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  cancelBooking: (id: string) => void

  // Admin operations
  approveFacility: (facilityId: string, comments?: string) => void
  rejectFacility: (facilityId: string, comments?: string) => void
  banUser: (userId: string) => void
  unbanUser: (userId: string) => void

  // Facility owner operations
  addCourt: (venueId: string, court: Omit<Court, "id">) => void
  updateCourt: (venueId: string, courtId: string, updates: Partial<Court>) => void
  deleteCourt: (venueId: string, courtId: string) => void

  // Review operations - Added review management functions
  addReview: (review: Omit<Review, "id">) => void
  updateReview: (id: string, updates: Partial<Review>) => void
  deleteReview: (id: string) => void

  // Stats updates
  refreshStats: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage or defaults
  const [state, setState] = useState<AppState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quickcourt_app_state")
      if (saved) {
        return JSON.parse(saved)
      }
    }

    // Default initial state with some sample data
    return {
      venues: [
        {
          id: "1",
          name: "SportZone Arena",
          description: "Premium sports facility with state-of-the-art courts and modern amenities.",
          address: "123 Sports Street, Downtown",
          location: { city: "Mumbai", area: "Bandra West" },
          sports: ["Badminton", "Table Tennis", "Squash"],
          amenities: ["Parking", "Changing Rooms", "Cafeteria", "AC", "Equipment Rental"],
          images: ["/placeholder.svg?height=300&width=400"],
          rating: 4.8,
          reviewCount: 124,
          priceRange: { min: 800, max: 1500 },
          courts: [
            {
              id: "c1",
              name: "Badminton Court 1",
              sportType: "Badminton",
              pricePerHour: 1200,
              operatingHours: { start: "06:00", end: "23:00" },
              isActive: true,
            },
          ],
          isApproved: true,
          ownerId: "2",
        },
      ],
      bookings: [],
      pendingFacilities: [
        {
          id: "pending-1",
          name: "Elite Sports Complex",
          ownerName: "Rajesh Kumar",
          ownerEmail: "rajesh@example.com",
          location: "Andheri West, Mumbai",
          sports: ["Badminton", "Tennis", "Squash"],
          courts: 8,
          submittedAt: new Date().toISOString(),
          description: "Premium sports facility with state-of-the-art equipment and modern amenities.",
          images: ["/placeholder.svg?height=300&width=400"],
          amenities: ["Parking", "AC", "Changing Rooms", "Cafeteria", "Equipment Rental"],
        },
      ],
      platformUsers: [
        {
          id: "user-1",
          fullName: "Rahul Sharma",
          email: "rahul@example.com",
          role: "user",
          isVerified: true,
          isBanned: false,
          joinedAt: new Date().toISOString(),
          totalBookings: 0,
          totalSpent: 0,
          lastActive: new Date().toISOString(),
        },
      ],
      adminStats: {
        totalUsers: 1,
        totalFacilityOwners: 1,
        totalBookings: 0,
        totalActiveCourts: 1,
        pendingApprovals: 1,
        totalRevenue: 0,
        userRegistrationTrends: [],
        bookingActivityTrends: [],
        sportPopularity: [],
        recentActivity: [],
      },
      ownerStats: {
        totalBookings: 0,
        totalEarnings: 0,
        activeFacilities: 1,
        totalCourts: 1,
        bookingTrends: [],
        peakHours: [],
        recentBookings: [],
      },
      reviews: [], // Initialize empty reviews array
    }
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("quickcourt_app_state", JSON.stringify(state))
  }, [state])

  const addVenue = (venueData: Omit<Venue, "id">) => {
    const newVenue: Venue = {
      ...venueData,
      id: Date.now().toString(),
    }
    setState((prev) => ({
      ...prev,
      venues: [...prev.venues, newVenue],
    }))
  }

  const updateVenue = (id: string, updates: Partial<Venue>) => {
    setState((prev) => ({
      ...prev,
      venues: prev.venues.map((venue) => (venue.id === id ? { ...venue, ...updates } : venue)),
    }))
  }

  const deleteVenue = (id: string) => {
    setState((prev) => ({
      ...prev,
      venues: prev.venues.filter((venue) => venue.id !== id),
      bookings: prev.bookings.filter((booking) => booking.venueId !== id),
    }))
  }

  const createBooking = (bookingData: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setState((prev) => ({
      ...prev,
      bookings: [...prev.bookings, newBooking],
    }))
  }

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) => (booking.id === id ? { ...booking, ...updates } : booking)),
    }))
  }

  const cancelBooking = (id: string) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) =>
        booking.id === id ? { ...booking, status: "cancelled" as const } : booking,
      ),
    }))
  }

  const approveFacility = (facilityId: string, comments?: string) => {
    setState((prev) => {
      const facility = prev.pendingFacilities.find((f) => f.id === facilityId)
      if (!facility) return prev

      const newVenue: Venue = {
        id: Date.now().toString(),
        name: facility.name,
        description: facility.description,
        address: facility.location,
        location: { city: "Mumbai", area: facility.location },
        sports: facility.sports,
        amenities: facility.amenities,
        images: facility.images,
        rating: 0,
        reviewCount: 0,
        priceRange: { min: 800, max: 2000 },
        courts: [],
        isApproved: true,
        ownerId: "2",
      }

      return {
        ...prev,
        venues: [...prev.venues, newVenue],
        pendingFacilities: prev.pendingFacilities.filter((f) => f.id !== facilityId),
        adminStats: {
          ...prev.adminStats,
          pendingApprovals: prev.adminStats.pendingApprovals - 1,
          totalActiveCourts: prev.adminStats.totalActiveCourts + facility.courts,
        },
      }
    })
  }

  const rejectFacility = (facilityId: string, comments?: string) => {
    setState((prev) => ({
      ...prev,
      pendingFacilities: prev.pendingFacilities.filter((f) => f.id !== facilityId),
      adminStats: {
        ...prev.adminStats,
        pendingApprovals: prev.adminStats.pendingApprovals - 1,
      },
    }))
  }

  const banUser = (userId: string) => {
    setState((prev) => ({
      ...prev,
      platformUsers: prev.platformUsers.map((user) => (user.id === userId ? { ...user, isBanned: true } : user)),
    }))
  }

  const unbanUser = (userId: string) => {
    setState((prev) => ({
      ...prev,
      platformUsers: prev.platformUsers.map((user) => (user.id === userId ? { ...user, isBanned: false } : user)),
    }))
  }

  const addCourt = (venueId: string, courtData: Omit<Court, "id">) => {
    const newCourt: Court = {
      ...courtData,
      id: Date.now().toString(),
    }
    setState((prev) => ({
      ...prev,
      venues: prev.venues.map((venue) =>
        venue.id === venueId ? { ...venue, courts: [...venue.courts, newCourt] } : venue,
      ),
    }))
  }

  const updateCourt = (venueId: string, courtId: string, updates: Partial<Court>) => {
    setState((prev) => ({
      ...prev,
      venues: prev.venues.map((venue) =>
        venue.id === venueId
          ? {
              ...venue,
              courts: venue.courts.map((court) => (court.id === courtId ? { ...court, ...updates } : court)),
            }
          : venue,
      ),
    }))
  }

  const deleteCourt = (venueId: string, courtId: string) => {
    setState((prev) => ({
      ...prev,
      venues: prev.venues.map((venue) =>
        venue.id === venueId ? { ...venue, courts: venue.courts.filter((court) => court.id !== courtId) } : venue,
      ),
      bookings: prev.bookings.filter((booking) => booking.courtId !== courtId),
    }))
  }

  const addReview = (reviewData: Omit<Review, "id">) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
    }
    setState((prev) => ({
      ...prev,
      reviews: [...prev.reviews, newReview],
    }))
  }

  const updateReview = (id: string, updates: Partial<Review>) => {
    setState((prev) => ({
      ...prev,
      reviews: prev.reviews.map((review) => (review.id === id ? { ...review, ...updates } : review)),
    }))
  }

  const deleteReview = (id: string) => {
    setState((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((review) => review.id !== id),
    }))
  }

  const refreshStats = () => {
    setState((prev) => {
      const totalBookings = prev.bookings.length
      const totalRevenue = prev.bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
      const totalUsers = prev.platformUsers.filter((u) => u.role === "user").length
      const totalOwners = prev.platformUsers.filter((u) => u.role === "facility_owner").length
      const totalCourts = prev.venues.reduce((sum, venue) => sum + venue.courts.length, 0)

      return {
        ...prev,
        adminStats: {
          ...prev.adminStats,
          totalUsers,
          totalFacilityOwners: totalOwners,
          totalBookings,
          totalActiveCourts: totalCourts,
          totalRevenue,
        },
        ownerStats: {
          ...prev.ownerStats,
          totalBookings,
          totalEarnings: totalRevenue,
          activeFacilities: prev.venues.length,
          totalCourts,
        },
      }
    })
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        addVenue,
        updateVenue,
        deleteVenue,
        createBooking,
        updateBooking,
        cancelBooking,
        approveFacility,
        rejectFacility,
        banUser,
        unbanUser,
        addCourt,
        updateCourt,
        deleteCourt,
        addReview, // Added review functions to context
        updateReview,
        deleteReview,
        refreshStats,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}

export type { Review }
