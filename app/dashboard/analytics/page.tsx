"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Progress } from "../../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { TrendingUp, Users, DollarSign, Eye, Store, Calendar, ArrowUp, ArrowDown } from "lucide-react"
import { useAnalyticsData } from "../../../hooks/use-analytics-data"
import { formatCurrency, formatNumber, formatPercentage } from "../../../lib/utils"

export default function AnalyticsPage() {
  const { analyticsData, isLoading, error } = useAnalyticsData()

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your business performance and lead insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Last 30 days</span>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <p>Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error || !analyticsData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your business performance and lead insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Last 30 days</span>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading analytics data: {error}</p>
        </div>
      </div>
    )
  }

  const {
    revenueStats,
    leadStats,
    storeViewStats,
    conversionStats,
    leadSources,
    leadStatuses,
    leadActivities,
    storePerformances,
    trafficMetrics,
    taskStats,
    taskCategories,
    aiMetrics,
    aiUsage
  } = analyticsData

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your business performance and lead insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Last 30 days</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueStats.totalRevenue)}</div>
            <div className={`flex items-center text-xs ${revenueStats.revenueChangeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {revenueStats.revenueChangeType === 'increase' ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {revenueStats.revenueChangeType === 'increase' ? '+' : ''}{revenueStats.revenueChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(leadStats.totalLeads)}</div>
            <div className={`flex items-center text-xs ${leadStats.leadChangeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {leadStats.leadChangeType === 'increase' ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {leadStats.leadChangeType === 'increase' ? '+' : ''}{leadStats.leadChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(storeViewStats.storeViews)}</div>
            <div className={`flex items-center text-xs ${storeViewStats.viewChangeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {storeViewStats.viewChangeType === 'increase' ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {storeViewStats.viewChangeType === 'increase' ? '+' : ''}{storeViewStats.viewChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionStats.conversionRate}%</div>
            <div className={`flex items-center text-xs ${conversionStats.conversionChangeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {conversionStats.conversionChangeType === 'increase' ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {conversionStats.conversionChangeType === 'increase' ? '+' : ''}{conversionStats.conversionChange}% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leads">Lead Analytics</TabsTrigger>
          <TabsTrigger value="stores">Store Performance</TabsTrigger>
          <TabsTrigger value="tasks">Task Analytics</TabsTrigger>
          <TabsTrigger value="ai">AI Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Where your leads are coming from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {leadSources.map((source, index) => (
                  <div className="space-y-2" key={index}>
                    <div className="flex justify-between text-sm">
                      <span>{source.name}</span>
                      <span>{source.percentage}%</span>
                    </div>
                    <Progress value={source.percentage} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
                <CardDescription>Current status of your leads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {leadStatuses.map((status, index) => (
                  <div className="flex items-center justify-between" key={index}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${status.color} rounded-full`}></div>
                      <span className="text-sm">{status.status}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatNumber(status.count)}</div>
                      <div className="text-xs text-gray-600">{formatPercentage(status.percentage)}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Lead Activity</CardTitle>
              <CardDescription>Latest interactions and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadActivities.map((activity) => (
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      activity.status === 'Converted' ? 'bg-green-50' : 
                      activity.status === 'Warm' ? 'bg-yellow-50' : 'bg-blue-50'
                    }`}
                    key={activity.id}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 ${
                        activity.status === 'Converted' ? 'bg-green-500' : 
                        activity.status === 'Warm' ? 'bg-yellow-500' : 'bg-blue-500'
                      } rounded-full`}></div>
                      <div>
                        <p className="text-sm font-medium">{activity.email}</p>
                        <p className="text-xs text-gray-600">{activity.action}</p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        activity.status === 'Converted' ? 'bg-green-100 text-green-800' : 
                        activity.status === 'Warm' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Performance</CardTitle>
                <CardDescription>Revenue and traffic by store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {storePerformances.map((store) => (
                  <div className="flex items-center justify-between p-3 border rounded-lg" key={store.id}>
                    <div className="flex items-center space-x-3">
                      <Store className={`w-8 h-8 ${store.iconColor}`} />
                      <div>
                        <p className="font-medium">{store.name}</p>
                        <p className="text-sm text-gray-600">{store.url}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{formatCurrency(store.revenue)}</p>
                      <p className="text-sm text-gray-600">{formatNumber(store.views)} views</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Analytics</CardTitle>
                <CardDescription>Visitor behavior and engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trafficMetrics.map((metric, index) => (
                  <div className="space-y-2" key={index}>
                    <div className="flex justify-between text-sm">
                      <span>{metric.name}</span>
                      <span>{metric.value}{metric.name.includes('Duration') ? 's' : metric.name.includes('Pages') ? '' : '%'}</span>
                    </div>
                    <Progress value={metric.value} max={metric.maxValue} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>WRV Task Performance</CardTitle>
                <CardDescription>Success rates and completion metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{taskStats.activeTasks}</div>
                    <div className="text-sm text-gray-600">Active Tasks</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{taskStats.completedTasks}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Task Completion Rate</span>
                    <span>{taskStats.completionRate}%</span>
                  </div>
                  <Progress value={taskStats.completionRate} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Response Time</span>
                    <span>{taskStats.avgResponseTime}</span>
                  </div>
                  <Progress value={85} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Categories</CardTitle>
                <CardDescription>Most popular task types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {taskCategories.map((category, index) => (
                  <div className="flex items-center justify-between" key={index}>
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="secondary">{category.count} tasks</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Metrics</CardTitle>
                <CardDescription>Performance of your AI assistant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{formatNumber(aiMetrics.messagesHandled)}</div>
                    <div className="text-sm text-gray-600">Messages Handled</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{aiMetrics.satisfactionRate}%</div>
                    <div className="text-sm text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Accuracy</span>
                    <span>{aiMetrics.accuracy}%</span>
                  </div>
                  <Progress value={aiMetrics.accuracy} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Response Time</span>
                    <span>{aiMetrics.avgResponseTime}</span>
                  </div>
                  <Progress value={88} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Usage Breakdown</CardTitle>
                <CardDescription>How your AI assistant is being used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiUsage.map((usage, index) => (
                  <div className="space-y-2" key={index}>
                    <div className="flex justify-between text-sm">
                      <span>{usage.category}</span>
                      <span>{usage.percentage}%</span>
                    </div>
                    <Progress value={usage.percentage} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
