"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, CheckCircle } from "lucide-react"

interface Review {
  id: string
  rating: number
  comment?: string
  isVerified: boolean
  createdAt: string
  reviewer: {
    id: string
    name: string
    image?: string
  }
  contract?: {
    id: string
    title: string
  }
}

interface ReviewListProps {
  userId: string
  type?: "received" | "given"
  limit?: number
}

export function ReviewList({ userId, type = "received", limit = 10 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState<number | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [userId, type, limit])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/reviews?userId=${userId}&type=${type}&limit=${limit}`
      )
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews)
        setAverageRating(data.meta.averageRating)
      } else {
        console.error("Error fetching reviews:", data.error)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {averageRating !== null && type === "received" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-2xl font-bold">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600">
              No reviews {type === "received" ? "received" : "given"} yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={review.reviewer.image} />
                    <AvatarFallback>
                      {review.reviewer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{review.reviewer.name}</h3>
                      {review.isVerified && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
            </CardHeader>
            {(review.comment || review.contract) && (
              <CardContent className="space-y-2">
                {review.contract && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Project:</span>{" "}
                    {review.contract.title}
                  </div>
                )}
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  )
}
