"use client"

import { useState, useMemo } from "react"
import { VenueCard } from "@/components/venues/venue-card"
import { VenueFilters, type FilterState } from "@/components/venues/venue-filters"
import { mockVenues } from "@/lib/venue-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VenuesPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sport: "",
    priceRange: "",
    rating: "",
    location: "",
  })

  const filteredVenues = useMemo(() => {
    return mockVenues.filter((venue) => {
      // Search filter
      if (
        filters.search &&
        !venue.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !venue.location.area.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Sport filter
      if (filters.sport && filters.sport !== "All Sports" && !venue.sports.includes(filters.sport)) {
        return false
      }

      // Price range filter
      if (filters.priceRange && filters.priceRange !== "All Prices") {
        const min = venue.priceRange.min
        const max = venue.priceRange.max

        switch (filters.priceRange) {
          case "Under ₹1000":
            if (min >= 1000) return false
            break
          case "₹1000-₹2000":
            if (max < 1000 || min > 2000) return false
            break
          case "₹2000-₹3000":
            if (max < 2000 || min > 3000) return false
            break
          case "Above ₹3000":
            if (max <= 3000) return false
            break
        }
      }

      // Rating filter
      if (filters.rating && filters.rating !== "All Ratings") {
        const minRating = Number.parseFloat(filters.rating.split("+")[0])
        if (venue.rating < minRating) return false
      }

      // Location filter
      if (filters.location && filters.location !== "All Areas" && venue.location.area !== filters.location) {
        return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sports Venues</h1>
              <p className="text-gray-600 mt-1">Discover and book premium sports facilities</p>
            </div>
            <Button asChild variant="outline" className="border-indigo-200 hover:bg-indigo-50">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <VenueFilters onFiltersChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredVenues.length} venue{filteredVenues.length !== 1 ? "s" : ""} found
              </h2>
            </div>

            {filteredVenues.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
