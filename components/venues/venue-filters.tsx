"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VenueFiltersProps {
  onFiltersChange: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  sport: string
  priceRange: string
  rating: string
  location: string
}

const sports = ["All Sports", "Badminton", "Football", "Tennis", "Basketball", "Table Tennis", "Cricket"]
const priceRanges = ["All Prices", "Under ₹1000", "₹1000-₹2000", "₹2000-₹3000", "Above ₹3000"]
const ratings = ["All Ratings", "4.5+ Stars", "4.0+ Stars", "3.5+ Stars"]
const locations = ["All Areas", "Bandra West", "Andheri East", "Powai", "Malad West", "Goregaon West"]

export function VenueFilters({ onFiltersChange }: VenueFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sport: "",
    priceRange: "",
    rating: "",
    location: "",
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)

    // Update active filters for display
    const active = Object.entries(newFilters)
      .filter(([_, v]) => v && v !== "All Sports" && v !== "All Prices" && v !== "All Ratings" && v !== "All Areas")
      .map(([k, v]) => `${k}: ${v}`)
    setActiveFilters(active)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      sport: "",
      priceRange: "",
      rating: "",
      location: "",
    }
    setFilters(clearedFilters)
    setActiveFilters([])
    onFiltersChange(clearedFilters)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filter Venues</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search venues..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Sport Type</Label>
          <Select value={filters.sport} onValueChange={(value) => handleFilterChange("sport", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Rating</Label>
          <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {ratings.map((rating) => (
                <SelectItem key={rating} value={rating}>
                  {rating}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm">Active Filters</Label>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary">
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
