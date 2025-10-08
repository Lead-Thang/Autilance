"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bookmark } from "lucide-react"

export default function SavedJobsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bookmark className="w-8 h-8 text-purple-600" />
          Saved Jobs
        </h1>
        <p className="text-gray-600">Jobs you've bookmarked for later</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Bookmark className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Saved Jobs</h3>
          <p className="text-gray-600">
            Start saving jobs that interest you
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
