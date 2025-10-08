"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReviewForm } from "@/components/reviews/review-form"
import { Search, Star, CheckCircle } from "lucide-react"

interface Contract {
  id: string
  title: string
  status: string
  freelancer?: {
    id: string
    name: string
    image?: string
  }
  client?: {
    id: string
    name: string
    image?: string
  }
}

export default function GiveReviewPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  useEffect(() => {
    fetchCompletedContracts()
  }, [])

  const fetchCompletedContracts = async () => {
    try {
      setLoading(true)
      // This would fetch actual contracts from the API
      // For now using mock data
      setContracts([
        {
          id: "1",
          title: "Website Redesign Project",
          status: "completed",
          freelancer: {
            id: "user123",
            name: "John Doe",
            image: "/avatars/john.jpg"
          }
        },
        {
          id: "2",
          title: "Mobile App Development",
          status: "completed",
          client: {
            id: "client456",
            name: "Tech Corp Inc",
            image: "/avatars/techcorp.jpg"
          }
        }
      ])
    } catch (error) {
      console.error("Error fetching contracts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContracts = contracts.filter(contract =>
    contract.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Star className="w-8 h-8 text-purple-600" />
            Give a Review
          </h1>
          <p className="text-gray-600">
            Share your experience working with others
          </p>
        </div>
      </div>

      {selectedContract ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reviewing: {selectedContract.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {selectedContract.freelancer ? (
                      <div className="flex items-center gap-2">
                        <span>Freelancer:</span>
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={selectedContract.freelancer.image} />
                          <AvatarFallback>{selectedContract.freelancer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{selectedContract.freelancer.name}</span>
                      </div>
                    ) : selectedContract.client ? (
                      <div className="flex items-center gap-2">
                        <span>Client:</span>
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={selectedContract.client.image} />
                          <AvatarFallback>{selectedContract.client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{selectedContract.client.name}</span>
                      </div>
                    ) : null}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedContract(null)}
                >
                  Change
                </Button>
              </div>
            </CardHeader>
          </Card>

          <ReviewForm
            revieweeId={selectedContract.freelancer?.id || selectedContract.client?.id || ""}
            revieweeName={selectedContract.freelancer?.name || selectedContract.client?.name || ""}
            contractId={selectedContract.id}
            onSubmitSuccess={() => {
              alert("Review submitted successfully!")
              setSelectedContract(null)
              fetchCompletedContracts()
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search completed projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Contracts List */}
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredContracts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Projects</h3>
                <p className="text-gray-600">
                  You don't have any completed projects to review yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredContracts.map((contract) => (
                <Card key={contract.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{contract.title}</h3>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>

                        {contract.freelancer ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Review freelancer:</span>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={contract.freelancer.image} />
                              <AvatarFallback>{contract.freelancer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{contract.freelancer.name}</span>
                          </div>
                        ) : contract.client ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Review client:</span>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={contract.client.image} />
                              <AvatarFallback>{contract.client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{contract.client.name}</span>
                          </div>
                        ) : null}
                      </div>

                      <Button
                        onClick={() => setSelectedContract(contract)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Write Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
