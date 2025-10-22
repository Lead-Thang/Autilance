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
import { useCourseData } from "../../hooks/use-course-data"

export default function DashboardPage() {
  const { stats, recentActivity, courses, isLoading } = useCourseData()

  // Convert stats to the format expected by the UI
  const statItems = [
    {
      title: "Courses Completed",
      value: stats.coursesCompleted.toString(),
      change: "+2 this month",
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Certifications Earned",
      value: stats.certificationsEarned.toString(),
      change: "+1 this week",
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Network Connections",
      value: stats.networkConnections.toString(),
      change: "+12 this week",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Learning Hours",
      value: stats.learningHours.toString(),
      change: "+15 this month",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="flex justify-center w-full">
      <div className="container mx-auto px-6 py-8 w-full max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statItems.map((stat, index) => (
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
              {courses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{course.title}</span>
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
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
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
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
    </div>
  </div>
  )
}