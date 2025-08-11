import { useState, useEffect } from 'react'

export interface UserStats {
  totalBookings: number
  activeBookings: number
  favoriteVenues: number
  totalSpent: number
}

export function useUserStats(userId: string | null) {
  const [stats, setStats] = useState<UserStats>({
    totalBookings: 0,
    activeBookings: 0,
    favoriteVenues: 0,
    totalSpent: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch user bookings from database
        const response = await fetch(`/api/bookings?userId=${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user bookings')
        }
        const bookings = await response.json()

        // Get bookings from localStorage as fallback
        const localBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
        const userLocalBookings = localBookings.filter((b: any) => b.userId === userId)

        // Combine all bookings
        const allBookings = [...bookings, ...userLocalBookings]
        
        // Remove duplicates by ID
        const uniqueBookings = allBookings.filter((booking, index, self) =>
          index === self.findIndex((b) => b.id === booking.id)
        )

        // Calculate stats
        const totalBookings = uniqueBookings.length
        const activeBookings = uniqueBookings.filter(b => 
          b.status === 'confirmed' || b.status === 'pending'
        ).length
        
        const totalSpent = uniqueBookings.reduce((sum, booking) => {
          // Handle both database format (total_amount) and localStorage format (totalPrice)
          const amount = booking.total_amount || booking.totalPrice || 0
          return sum + Number(amount)
        }, 0)

        // Get unique venues the user has booked (handle both venue_id and venueId)
        const uniqueVenues = new Set(uniqueBookings.map(b => b.venue_id || b.venueId).filter(Boolean))
        const favoriteVenues = uniqueVenues.size

        setStats({
          totalBookings,
          activeBookings,
          favoriteVenues,
          totalSpent
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        
        // Fallback to localStorage only
        try {
          const localBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]")
          const userLocalBookings = localBookings.filter((b: any) => b.userId === userId)
          
          const totalBookings = userLocalBookings.length
          const activeBookings = userLocalBookings.filter((b: any) => 
            b.status === 'confirmed' || b.status === 'pending'
          ).length
          
          const totalSpent = userLocalBookings.reduce((sum: number, booking: any) => {
            return sum + (booking.totalPrice || 0)
          }, 0)

          const uniqueVenues = new Set(userLocalBookings.map((b: any) => b.venueId))
          const favoriteVenues = uniqueVenues.size

          setStats({
            totalBookings,
            activeBookings,
            favoriteVenues,
            totalSpent
          })
        } catch (localError) {
          console.error('Failed to load local bookings:', localError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  return { stats, loading, error }
}
