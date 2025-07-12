"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Progress } from "../../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { TrendingUp, Users, DollarSign, Eye, Store, Calendar, ArrowUp, ArrowDown } from "lucide-react"

export default function AnalyticsPage() {
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
            <div className="text-2xl font-bold">$12,345</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="w-3 h-3 mr-1" />
              +20.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="w-3 h-3 mr-1" />
              +15.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,234</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDown className="w-3 h-3 mr-1" />
              -2.4% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="w-3 h-3 mr-1" />
              +0.8% from last month
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
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Social Feed</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Direct Store Visits</span>
                    <span>32%</span>
                  </div>
                  <Progress value={32} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>WRV Tasks</span>
                    <span>18%</span>
                  </div>
                  <Progress value={18} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Referrals</span>
                    <span>5%</span>
                  </div>
                  <Progress value={5} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
                <CardDescription>Current status of your leads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Hot Leads</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">234</div>
                    <div className="text-xs text-gray-600">9.5%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Warm Leads</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">567</div>
                    <div className="text-xs text-gray-600">23.1%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Cold Leads</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">1,234</div>
                    <div className="text-xs text-gray-600">50.2%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Converted</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">421</div>
                    <div className="text-xs text-gray-600">17.1%</div>
                  </div>
                </div>
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
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">john.doe@email.com</p>
                      <p className="text-xs text-gray-600">Visited Anime Store → Made Purchase</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Converted</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">sarah.miller@email.com</p>
                      <p className="text-xs text-gray-600">Responded to WRV Task → Awaiting Review</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Warm</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">mike.johnson@email.com</p>
                      <p className="text-xs text-gray-600">Viewed Store → Left without Action</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Cold</Badge>
                </div>
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
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Store className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="font-medium">Anime Fitness Hub</p>
                      <p className="text-sm text-gray-600">anime-fitness.Autilance.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">$2,456</p>
                    <p className="text-sm text-gray-600">1.2k views</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Store className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium">Tech Gadgets Pro</p>
                      <p className="text-sm text-gray-600">tech-gadgets.Autilance.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">$1,789</p>
                    <p className="text-sm text-gray-600">856 views</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Analytics</CardTitle>
                <CardDescription>Visitor behavior and engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bounce Rate</span>
                    <span>34%</span>
                  </div>
                  <Progress value={34} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avg. Session Duration</span>
                    <span>2m 45s</span>
                  </div>
                  <Progress value={68} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pages per Session</span>
                    <span>3.2</span>
                  </div>
                  <Progress value={64} />
                </div>
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
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-gray-600">Active Tasks</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">15</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Task Completion Rate</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Response Time</span>
                    <span>2.3 days</span>
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
                <div className="flex items-center justify-between">
                  <span className="text-sm">Web Development</span>
                  <Badge variant="secondary">12 tasks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Design</span>
                  <Badge variant="secondary">8 tasks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Content Writing</span>
                  <Badge variant="secondary">6 tasks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Marketing</span>
                  <Badge variant="secondary">4 tasks</Badge>
                </div>
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
                    <div className="text-2xl font-bold text-purple-600">1,234</div>
                    <div className="text-sm text-gray-600">Messages Handled</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Accuracy</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Response Time</span>
                    <span>1.2s</span>
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
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Customer Support</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Content Generation</span>
                    <span>28%</span>
                  </div>
                  <Progress value={28} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lead Qualification</span>
                    <span>18%</span>
                  </div>
                  <Progress value={18} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Marketing Tasks</span>
                    <span>9%</span>
                  </div>
                  <Progress value={9} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
