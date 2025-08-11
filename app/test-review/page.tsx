// Test component to verify review functionality works
"use client"

import { ReviewDialog } from "@/components/venues/review-dialog"
import { Button } from "@/components/ui/button"

export default function TestReview() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Review System Test</h1>
      
      <ReviewDialog
        venueId="1"
        venueName="SportZone Arena"
        bookingId="b1"
        onReviewSubmitted={() => console.log("Review submitted!")}
      >
        <Button>Test Review Dialog</Button>
      </ReviewDialog>
    </div>
  )
}
