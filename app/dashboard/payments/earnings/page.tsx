"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Calendar
} from "lucide-react"

interface EarningsData {
  totalEarned: number
  totalAvailable: number
  totalPending: number
  totalWithdrawn: number
  monthlyBreakdown: Array<{
    month: string
    year: number
    amount: number
    transactions: number
  }>
  recentTransactions: Array<{
    id: string
    amount: number
    currency: string
    description: string
    date: string
    counterparty: {
      name: string
      image?: string
    }
  }>
}

export default function EarningsPage() {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEarnings()
  }, [])

  const fetchEarnings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/earnings')
      const data = await response.json()

      if (response.ok) {
        setEarningsData(data)
      } else {
        console.error("Error fetching earnings:", data.error)
      }
    } catch (error) {
      console.error("Error fetching earnings:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amountCents: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amountCents / 100)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (!earningsData) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            Earnings
          </h1>
          <p className="text-gray-600">Track your income and earnings</p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Earnings</h3>
            <p className="text-gray-600">Please try again later</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-purple-600" />
          Earnings
        </h1>
        <p className="text-gray-600">Track your income and earnings analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Earned
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(earningsData.totalEarned)}
            </div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Available
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(earningsData.totalAvailable)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <Clock className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatAmount(earningsData.totalPending)}
            </div>
            <p className="text-xs text-gray-600 mt-1">In escrow</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Payments
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earningsData.recentTransactions.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Recent transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Monthly Earnings
            </CardTitle>
            <CardDescription>
              Your earnings breakdown by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {earningsData.monthlyBreakdown.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No earnings data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {earningsData.monthlyBreakdown.slice(0, 6).map((month, index) => (
                  <div key={`${month.year}-${month.month}`} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{month.month} {month.year}</p>
                      <p className="text-xs text-gray-600">{month.transactions} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatAmount(month.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>
              Your latest completed transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {earningsData.recentTransactions.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No earnings yet</p>
                <p className="text-xs">Completed project payments will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {earningsData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={transaction.counterparty.image} />
                        <AvatarFallback>
                          {transaction.counterparty.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{transaction.counterparty.name}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </p>
                      <Badge variant="outline" className="mt-1">Completed</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Growth Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Insights</CardTitle>
          <CardDescription>
            Track your freelance business growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {earningsData.monthlyBreakdown.length > 0
                  ? earningsData.monthlyBreakdown[0]?.transactions ?? 0
                  : 0}
              </div>
              <p className="text-sm text-gray-600">Projects this month</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatAmount(earningsData.totalEarned)}
              </div>
              <p className="text-sm text-gray-600">Total career earnings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {earningsData.totalEarned > 0
                  ? Math.round((earningsData.totalAvailable / earningsData.totalEarned) * 100)
                  : 0}%
              </div>
              <p className="text-sm text-gray-600">Available to withdraw</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}