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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40">
        <Image
          src={venue.images[0] || "/placeholder.svg?height=160&width=300&query=sports venue"}
          alt={venue.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-blue-600 text-white">₹{venue.priceRange.min}/hr</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{venue.name}</h3>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">{venue.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {venue.location.area}, {venue.location.city}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {venue.sports.slice(0, 2).map((sport) => (
            <Badge key={sport} variant="outline" className="text-xs">
              {sport}
            </Badge>
          ))}
          {venue.sports.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{venue.sports.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {venue.courts.length} court{venue.courts.length !== 1 ? "s" : ""}
          </span>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/venues/${venue.id}`}>Book Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
