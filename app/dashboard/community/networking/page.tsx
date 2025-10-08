"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function NetworkingPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8 text-purple-600" />
          Networking
        </h1>
        <p className="text-gray-600">Connect with other professionals</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-gray-600">
            Professional networking features coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
