import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Venue } from "@/lib/venue-data"
import Link from "next/link"
import Image from "next/image"

interface VenueCardProps {
  venue: Venue
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
      <div className="relative h-32">
        <Image
          src={venue.images[0] || "/placeholder.svg?height=128&width=300&query=sports venue"}
          alt={venue.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-emerald-600 text-white text-xs">₹{venue.priceRange.min}/hr</Badge>
        </div>
      </div>

      <CardContent className="p-3">
        <div className="mb-2">
          <h3 className="font-semibold text-sm line-clamp-1 mb-1">{venue.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 line-clamp-1">
              {venue.location.area}, {venue.location.city}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-xs font-medium">{venue.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {venue.sports.slice(0, 2).map((sport) => (
            <Badge key={sport} variant="outline" className="text-xs px-2 py-0">
              {sport}
            </Badge>
          ))}
          {venue.sports.length > 2 && (
            <Badge variant="outline" className="text-xs px-2 py-0">
              +{venue.sports.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {venue.courts.length} court{venue.courts.length !== 1 ? "s" : ""}
          </span>
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs px-3 py-1 h-7">
            <Link href={`/venues/${venue.id}`}>Book Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
