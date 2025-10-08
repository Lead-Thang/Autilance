"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  type: "incoming" | "outgoing"
  amount: number
  currency: string
  status: string
  description: string
  date: string
  counterparty: {
    name: string
    image?: string
  }
  category: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      // Mock data - would fetch from actual API
      setTransactions([
        {
          id: "1",
          type: "incoming",
          amount: 2500,
          currency: "USD",
          status: "completed",
          description: "Payment for Website Redesign Project",
          date: "2024-01-15T10:30:00Z",
          counterparty: {
            name: "Tech Corp Inc",
            image: "/avatars/techcorp.jpg"
          },
          category: "escrow"
        },
        {
          id: "2",
          type: "outgoing",
          amount: 1200,
          currency: "USD",
          status: "completed",
          description: "Payment to freelancer - Mobile App",
          date: "2024-01-14T14:20:00Z",
          counterparty: {
            name: "John Doe",
            image: "/avatars/john.jpg"
          },
          category: "escrow"
        },
        {
          id: "3",
          type: "incoming",
          amount: 500,
          currency: "USD",
          status: "pending",
          description: "Milestone payment - API Integration",
          date: "2024-01-13T09:15:00Z",
          counterparty: {
            name: "StartupXYZ",
            image: "/avatars/startup.jpg"
          },
          category: "milestone"
        },
        {
          id: "4",
          type: "outgoing",
          amount: 50,
          currency: "USD",
          status: "completed",
          description: "Platform fee",
          date: "2024-01-12T16:45:00Z",
          counterparty: {
            name: "Autilance",
            image: "/logo.png"
          },
          category: "fee"
        },
        {
          id: "5",
          type: "incoming",
          amount: 3200,
          currency: "USD",
          status: "completed",
          description: "Full project payment - E-commerce Site",
          date: "2024-01-10T11:00:00Z",
          counterparty: {
            name: "Retail Pro LLC",
            image: "/avatars/retail.jpg"
          },
          category: "project"
        }
      ])
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.counterparty.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  // Calculate stats
  const totalIncoming = transactions
    .filter(t => t.type === "incoming" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOutgoing = transactions
    .filter(t => t.type === "outgoing" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingAmount = transactions
    .filter(t => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-purple-600" />
            Transactions
          </h1>
          <p className="text-gray-600">
            View and manage all your payment transactions
          </p>
        </div>

        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Received
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(totalIncoming, "USD")}
            </div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Paid
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatAmount(totalOutgoing, "USD")}
            </div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Balance
            </CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(totalIncoming - totalOutgoing, "USD")}
            </div>
            <p className="text-xs text-gray-600 mt-1">Balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <Filter className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatAmount(pendingAmount, "USD")}
            </div>
            <p className="text-xs text-gray-600 mt-1">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
            <p className="text-gray-600">
              {searchQuery || filterType !== "all" || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Your transactions will appear here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      transaction.type === "incoming"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}>
                      {transaction.type === "incoming" ? (
                        <ArrowDownRight className="w-6 h-6 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 text-red-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{transaction.description}</h3>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={transaction.counterparty.image} />
                          <AvatarFallback>{transaction.counterparty.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{transaction.counterparty.name}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        transaction.type === "incoming"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                        {transaction.type === "incoming" ? "+" : "-"}
                        {formatAmount(transaction.amount, transaction.currency)}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
