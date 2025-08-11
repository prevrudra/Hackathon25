"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { mockVenues } from "@/lib/venue-data"
import { VenueCard } from "@/components/venues/venue-card"

export default function HomePage() {
  const { user, isLoading, logout } = useAuth()

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

  // Header for logged-in users
  const LoggedInHeader = () => (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">QuickCourt</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ""} alt={user?.fullName || ""} />
                <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Badge variant="secondary" className="hidden md:inline-flex">
                {user?.role === "facility_owner" ? "Facility Owner" : "User"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/profile">Profile</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={logout} variant="ghost" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )

  // Header for guests
  const GuestHeader = () => (
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
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Header */}
      {user ? <LoggedInHeader /> : <GuestHeader />}

      {/* Welcome Section for Logged-in Users */}
      {user && (
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar || ""} alt={user.fullName} />
                <AvatarFallback className="text-xl bg-white/20 text-white">
                  {user.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold">Welcome back, {user.fullName}!</h2>
                <p className="text-blue-100 text-lg">Ready to book your next sports session?</p>
                <div className="flex gap-4 mt-3">
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/venues">Browse Venues</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-blue-600">
                    <Link href="/my-bookings">My Bookings</Link>
                  </Button>
                  {user.role === "facility_owner" && (
                    <Button asChild variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-blue-600">
                      <Link href="/owner/dashboard">Owner Dashboard</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section for Guests */}
      {!user && (
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
      )}

      {/* Quick Stats for Logged-in Users */}
      {user && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Favorite Sport</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">🏸 Badminton</div>
                  <p className="text-sm text-muted-foreground">Most played</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">₹2,450</div>
                  <p className="text-sm text-muted-foreground">This year</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Popular Sports */}
      <section className={user ? "py-8" : "py-12"}>
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">
            {user ? "Quick Sport Selection" : "Popular Sports"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Badminton", icon: "🏸" },
              { name: "Football", icon: "⚽" },
              { name: "Table Tennis", icon: "🏓" },
              { name: "Tennis", icon: "🎾" },
              { name: "Basketball", icon: "🏀" },
              { name: "Cricket", icon: "🏏" },
            ].map((sport) => (
              <Card 
                key={sport.name} 
                className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-500"
              >
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
      <section className={`${user ? "py-8" : "py-12"} bg-white`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">
              {user ? "Recommended Venues" : "Popular Venues"}
            </h3>
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

      {/* Additional Section for Logged-in Users */}
      {user && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📅 Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/venues">
                      🔍 Find Venues
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/my-bookings">
                      📋 View My Bookings
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/profile">
                      ⚙️ Account Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎯 Your Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Account Status</span>
                      <Badge variant={user.isVerified ? "default" : "secondary"}>
                        {user.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Member Since</span>
                      <span className="text-sm font-medium">2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">User Type</span>
                      <Badge variant="outline">
                        {user.role === "facility_owner" ? "Facility Owner" : "Player"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

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
