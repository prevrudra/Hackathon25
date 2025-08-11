"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useAppState } from "@/lib/app-state"

interface ReviewFormProps {
  venueId: string
  onReviewSubmitted: () => void
}

export function ReviewForm({ venueId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth()
  const { addReview } = useAppState()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || rating === 0) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    addReview({
      id: Date.now().toString(),
      venueId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString(),
    })

    setRating(0)
    setComment("")
    setIsSubmitting(false)
    onReviewSubmitted()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  } hover:text-yellow-400 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience at this venue..."
              className="mt-1"
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={rating === 0 || !comment.trim() || isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
