import { useState, useEffect } from 'react'
import { 
  OwnerStats, 
  BookingTrend, 
  PeakHour, 
  OwnerBooking, 
  OwnerVenue, 
  OwnerCourt 
} from '@/lib/sqlite-owner-database'

export function useOwnerStats(ownerId: number | null) {
  const [stats, setStats] = useState<OwnerStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ownerId) return

    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/owner/stats?ownerId=${ownerId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch owner stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [ownerId])

  return { stats, loading, error }
}

export function useBookingTrends(ownerId: number | null, days: number = 7) {
  const [trends, setTrends] = useState<BookingTrend[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ownerId) return

    const fetchTrends = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/owner/trends?ownerId=${ownerId}&days=${days}`)
        if (!response.ok) {
          throw new Error('Failed to fetch booking trends')
        }
        const data = await response.json()
        setTrends(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [ownerId, days])

  return { trends, loading, error }
}

export function usePeakHours(ownerId: number | null) {
  const [peakHours, setPeakHours] = useState<PeakHour[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ownerId) return

    const fetchPeakHours = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/owner/peak-hours?ownerId=${ownerId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch peak hours')
        }
        const data = await response.json()
        setPeakHours(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPeakHours()
  }, [ownerId])

  return { peakHours, loading, error }
}

export function useOwnerBookings(
  ownerId: number | null,
  status?: string,
  dateFrom?: string,
  dateTo?: string,
  page: number = 1,
  limit: number = 20
) {
  const [bookings, setBookings] = useState<OwnerBooking[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ownerId) return

    const fetchBookings = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const params = new URLSearchParams({
          ownerId: ownerId.toString(),
          page: page.toString(),
          limit: limit.toString()
        })

        if (status) params.append('status', status)
        if (dateFrom) params.append('dateFrom', dateFrom)
        if (dateTo) params.append('dateTo', dateTo)

        const response = await fetch(`/api/owner/bookings?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }
        const data = await response.json()
        setBookings(data.bookings)
        setTotal(data.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [ownerId, status, dateFrom, dateTo, page, limit])

  return { bookings, total, loading, error }
}

export function useOwnerVenues(ownerId: number | null) {
  const [venues, setVenues] = useState<OwnerVenue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVenues = async () => {
    if (!ownerId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/owner/venues?ownerId=${ownerId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch venues')
      }
      const data = await response.json()
      setVenues(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVenues()
  }, [ownerId])

  return { venues, loading, error, refetch: fetchVenues }
}

export function useOwnerCourts(ownerId: number | null, venueId?: number) {
  const [courts, setCourts] = useState<OwnerCourt[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCourts = async () => {
    if (!ownerId) return

    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({ ownerId: ownerId.toString() })
      if (venueId) params.append('venueId', venueId.toString())

      const response = await fetch(`/api/owner/courts?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch courts')
      }
      const data = await response.json()
      setCourts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourts()
  }, [ownerId, venueId])

  return { courts, loading, error, refetch: fetchCourts }
}

// Helper hook to get current owner ID from auth context
export function useCurrentOwnerId(): number | null {
  const [ownerId, setOwnerId] = useState<number | null>(null)

  useEffect(() => {
    // Check localStorage for logged-in user
    const user = localStorage.getItem('quickcourt_user')
    if (user) {
      const userData = JSON.parse(user)
      if (userData.role === 'facility_owner') {
        // Map auth user ID to database owner ID
        // Auth user "1" -> database owner 1
        // Auth user "2" -> database owner 2
        const authUserId = parseInt(userData.id)
        setOwnerId(authUserId)
      }
    }
  }, [])

  return ownerId
}
