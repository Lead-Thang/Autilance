"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Wallet,
  Plus,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  ArrowDownRight,
  ArrowUpRight
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EscrowTransaction {
  id: string
  amountCents: number
  currency: string
  status: string
  createdAt: string
  releasedAt?: string
  client: {
    id: string
    name: string
    image?: string
  }
  freelancer: {
    id: string
    name: string
    image?: string
  }
  contract?: {
    id: string
    title: string
  }
  milestone?: {
    id: string
    title: string
  }
}

export default function EscrowPage() {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // New escrow form
  const [newEscrow, setNewEscrow] = useState({
    freelancerId: "",
    amountCents: 0,
    currency: "USD",
    contractId: "",
    milestoneId: ""
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/escrow')
      const data = await response.json()

      if (response.ok) {
        setTransactions(data.transactions)
      } else {
        console.error("Error fetching transactions:", data.error)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEscrow = async () => {
    if (!newEscrow.freelancerId || newEscrow.amountCents <= 0) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEscrow)
      })

      if (response.ok) {
        setShowCreateDialog(false)
        setNewEscrow({
          freelancerId: "",
          amountCents: 0,
          currency: "USD",
          contractId: "",
          milestoneId: ""
        })
        fetchTransactions()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to create escrow")
      }
    } catch (error) {
      console.error("Error creating escrow:", error)
      alert("An error occurred")
    }
  }

  const handleReleaseEscrow = async (transactionId: string) => {
    if (!confirm("Are you sure you want to release these funds to the freelancer?")) {
      return
    }

    try {
      const response = await fetch(`/api/escrow/${transactionId}/release`, {
        method: 'POST'
      })

      if (response.ok) {
        alert("Funds released successfully!")
        fetchTransactions()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to release funds")
      }
    } catch (error) {
      console.error("Error releasing escrow:", error)
      alert("An error occurred")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case "held":
        return <Badge className="bg-blue-100 text-blue-800"><Shield className="w-3 h-3 mr-1" />Held</Badge>
      case "released":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Released</Badge>
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatAmount = (amountCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amountCents / 100)
  }

  const filteredTransactions = activeTab === "all"
    ? transactions
    : transactions.filter(t => t.status === activeTab)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="w-8 h-8 text-purple-600" />
            Escrow Payments
          </h1>
          <p className="text-gray-600">
            Secure milestone-based payments with escrow protection
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Escrow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Escrow Transaction</DialogTitle>
              <DialogDescription>
                Hold funds securely until milestone completion
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Freelancer ID</label>
                <Input
                  placeholder="Enter freelancer ID"
                  value={newEscrow.freelancerId}
                  onChange={(e) => setNewEscrow({ ...newEscrow, freelancerId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newEscrow.amountCents / 100}
                  onChange={(e) => setNewEscrow({ ...newEscrow, amountCents: Math.round(parseFloat(e.target.value) * 100) })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select
                  value={newEscrow.currency}
                  onValueChange={(value) => setNewEscrow({ ...newEscrow, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Contract ID (Optional)</label>
                <Input
                  placeholder="Enter contract ID"
                  value={newEscrow.contractId}
                  onChange={(e) => setNewEscrow({ ...newEscrow, contractId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Milestone ID (Optional)</label>
                <Input
                  placeholder="Enter milestone ID"
                  value={newEscrow.milestoneId}
                  onChange={(e) => setNewEscrow({ ...newEscrow, milestoneId: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEscrow}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  Create Escrow
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Held</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-gray-600 mt-1">In escrow</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Released</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$48,320</div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">$3,200</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-600 mt-1">With escrow</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="held">Held</TabsTrigger>
          <TabsTrigger value="released">Released</TabsTrigger>
          <TabsTrigger value="refunded">Refunded</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Wallet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any {activeTab === "all" ? "" : activeTab} escrow transactions yet
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Escrow
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {formatAmount(transaction.amountCents, transaction.currency)}
                          </h3>
                          {transaction.contract && (
                            <p className="text-sm text-gray-600">{transaction.contract.title}</p>
                          )}
                          {transaction.milestone && (
                            <p className="text-xs text-gray-500">Milestone: {transaction.milestone.title}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-gray-600">From</p>
                            <div className="flex items-center gap-1">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={transaction.client.image} />
                                <AvatarFallback>{transaction.client.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{transaction.client.name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <ArrowDownRight className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-gray-600">To</p>
                            <div className="flex items-center gap-1">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={transaction.freelancer.image} />
                                <AvatarFallback>{transaction.freelancer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{transaction.freelancer.name}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-600">Created</p>
                          <p className="font-medium">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                        </div>

                        {transaction.releasedAt && (
                          <div>
                            <p className="text-gray-600">Released</p>
                            <p className="font-medium">{new Date(transaction.releasedAt).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(transaction.status)}

                      {transaction.status === "held" && (
                        <Button
                          size="sm"
                          onClick={() => handleReleaseEscrow(transaction.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Release Funds
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
