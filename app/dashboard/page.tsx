"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import {
  TrendingUp,
  Users,
  Trophy,
  BookOpen,
  Target,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  BarChart3,
} from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/app-sidebar"

export default function DashboardPage() {
  const stats = [
    {
      title: "Courses Completed",
      value: "12",
      change: "+2 this month",
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Certifications Earned",
      value: "8",
      change: "+1 this week",
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Network Connections",
      value: "156",
      change: "+12 this week",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Learning Hours",
      value: "89",
      change: "+15 this month",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  const recentActivity = [
    {
      title: "Completed Advanced React Course",
      description: "Earned certification in React development",
      time: "2 hours ago",
      type: "completion",
    },
    {
      title: "Connected with Sarah Johnson",
      description: "New connection in your professional network",
      time: "5 hours ago",
      type: "connection",
    },
    {
      title: "Started AI Fundamentals Course",
      description: "Beginning your journey in artificial intelligence",
      time: "1 day ago",
      type: "start",
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="flex items-center gap-4 mb-8">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">Welcome back!</h1>
            <p className="text-muted-foreground">Here's what's happening with your learning journey</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-lift border-border/50 bg-card/50 backdrop-blur-sm group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div
                  className={`p-2 ${stat.bgColor} rounded-lg group-hover:scale-110 transition-transform duration-200`}
                >
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient-primary">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Progress */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Learning Progress
              </CardTitle>
              <CardDescription>Your current course progress and goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">AI Fundamentals</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Digital Marketing</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Data Science Basics</span>
                  <span className="text-sm text-muted-foreground">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <Button className="w-full bg-gradient-primary hover:scale-105 transition-all duration-200">
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gradient-primary">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col hover-lift border-border/50 hover:bg-primary/5 hover:border-primary/50 bg-transparent"
            >
              <Sparkles className="h-6 w-6 mb-2 text-primary" />
              <span>AI Assistant</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col hover-lift border-border/50 hover:bg-primary/5 hover:border-primary/50 bg-transparent"
            >
              <Award className="h-6 w-6 mb-2 text-primary" />
              <span>View Certificates</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col hover-lift border-border/50 hover:bg-primary/5 hover:border-primary/50 bg-transparent"
            >
              <Users className="h-6 w-6 mb-2 text-primary" />
              <span>Network</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col hover-lift border-border/50 hover:bg-primary/5 hover:border-primary/50 bg-transparent"
            >
              <TrendingUp className="h-6 w-6 mb-2 text-primary" />
              <span>Analytics</span>
            </Button>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
