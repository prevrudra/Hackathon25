"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { mockVenues } from "@/lib/venue-data"
import { VenueCard } from "@/components/venues/venue-card"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">QuickCourt</h1>
            <div className="flex gap-2">
              <Button asChild variant="ghost">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Book Your Favorite Sports Venue</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Find and book badminton courts, football turfs, and more near you
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Input placeholder="Search for venues..." className="pl-10 h-12" />
              <svg
                className="absolute left-3 top-3 h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/venues">Explore Venues</Link>
          </Button>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">Popular Sports</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Badminton", icon: "🏸" },
              { name: "Football", icon: "⚽" },
              { name: "Table Tennis", icon: "🏓" },
              { name: "Tennis", icon: "🎾" },
              { name: "Basketball", icon: "🏀" },
              { name: "Cricket", icon: "🏏" },
            ].map((sport) => (
              <Card key={sport.name} className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="text-3xl mb-2">{sport.icon}</div>
                  <p className="font-medium text-sm">{sport.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Popular Venues</h3>
            <Button asChild variant="outline">
              <Link href="/venues">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVenues.slice(0, 6).map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h4 className="text-xl font-bold text-blue-400 mb-2">QuickCourt</h4>
          <p className="text-gray-400">Your favorite sports booking platform</p>
        </div>
      </footer>
    </div>
  )
}
