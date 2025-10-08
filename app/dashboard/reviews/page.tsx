"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/hooks/use-user"
import { ReviewList } from "@/components/reviews/review-list"
import { Star, TrendingUp, Award } from "lucide-react"

export default function ReviewsPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("received")

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Please log in to view your reviews</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Star className="w-8 h-8 text-yellow-500" />
            My Reviews
          </h1>
          <p className="text-gray-600">
            Build your reputation with verified reviews
          </p>
        </div>

        <Button
          className="bg-gradient-to-r from-purple-600 to-blue-600"
          onClick={() => window.location.href = '/dashboard/reviews/give'}
        >
          Give a Review
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Rating
            </CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.8</div>
            <p className="text-xs text-gray-600 mt-1">Out of 5 stars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reviews
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-gray-600 mt-1">Reviews received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Verified Reviews
            </CardTitle>
            <Award className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-gray-600 mt-1">From completed projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">Reviews Received</TabsTrigger>
          <TabsTrigger value="given">Reviews Given</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          <ReviewList userId={user.id} type="received" limit={20} />
        </TabsContent>

        <TabsContent value="given" className="mt-6">
          <ReviewList userId={user.id} type="given" limit={20} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
