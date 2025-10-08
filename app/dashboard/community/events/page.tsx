"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Calendar,
  Plus,
  Users,
  MapPin,
  Clock,
  Video,
  Globe,
  CheckCircle
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CommunityEvent {
  id: string
  title: string
  description: string
  eventType: string
  startTime: string
  endTime: string
  timezone: string
  isVirtual: boolean
  location?: string
  meetingLink?: string
  maxAttendees?: number
  createdAt: string
  organizer: {
    id: string
    name: string
    image?: string
  }
  _count: {
    attendees: number
  }
}

export default function CommunityEventsPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")

  // New event form
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    eventType: "webinar",
    startTime: "",
    endTime: "",
    timezone: "UTC",
    isVirtual: true,
    location: "",
    meetingLink: "",
    maxAttendees: undefined as number | undefined
  })

  useEffect(() => {
    fetchEvents()
  }, [activeTab])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const upcoming = activeTab === "upcoming"
      const response = await fetch(`/api/community/events?upcoming=${upcoming}`)
      const data = await response.json()

      if (response.ok) {
        setEvents(data.events)
      } else {
        console.error("Error fetching events:", data.error)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.startTime || !newEvent.endTime) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch('/api/community/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      })

      if (response.ok) {
        setShowCreateDialog(false)
        setNewEvent({
          title: "",
          description: "",
          eventType: "webinar",
          startTime: "",
          endTime: "",
          timezone: "UTC",
          isVirtual: true,
          location: "",
          meetingLink: "",
          maxAttendees: undefined
        })
        fetchEvents()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to create event")
      }
    } catch (error) {
      console.error("Error creating event:", error)
      alert("An error occurred")
    }
  }

  const formatEventTime = (startTime: string, endTime: string, timezone: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)

    return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${timezone}`
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "webinar": return "bg-blue-100 text-blue-800"
      case "workshop": return "bg-purple-100 text-purple-800"
      case "meetup": return "bg-green-100 text-green-800"
      case "networking": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-8 h-8 text-purple-600" />
            Community Events
          </h1>
          <p className="text-gray-600">
            Join webinars, workshops, and networking events
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Organize a community event for members to join
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Title</label>
                <Input
                  placeholder="e.g., Introduction to Web3 Development"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe what attendees will learn or experience..."
                  rows={4}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Type</label>
                  <Select
                    value={newEvent.eventType}
                    onValueChange={(value) => setNewEvent({ ...newEvent, eventType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="meetup">Meetup</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Attendees (Optional)</label>
                  <Input
                    type="number"
                    placeholder="Unlimited"
                    value={newEvent.maxAttendees || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value ? parseInt(e.target.value) : undefined })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <Input
                  placeholder="e.g., UTC, EST, PST"
                  value={newEvent.timezone}
                  onChange={(e) => setNewEvent({ ...newEvent, timezone: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVirtual"
                  checked={newEvent.isVirtual}
                  onChange={(e) => setNewEvent({ ...newEvent, isVirtual: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isVirtual" className="text-sm font-medium">
                  Virtual Event
                </label>
              </div>

              {newEvent.isVirtual ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meeting Link</label>
                  <Input
                    placeholder="https://zoom.us/j/..."
                    value={newEvent.meetingLink}
                    onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="Enter physical address"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  Create Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
                <p className="text-gray-600 mb-4">
                  Be the first to organize an event for the community
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getEventTypeColor(event.eventType)}>
                        {event.eventType}
                      </Badge>
                      {event.isVirtual ? (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          Virtual
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          In-Person
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatEventTime(event.startTime, event.endTime, event.timezone)}</span>
                      </div>

                      {event.isVirtual ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="w-4 h-4" />
                          <span>Online Event</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          {event._count.attendees} registered
                          {event.maxAttendees && ` / ${event.maxAttendees} max`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={event.organizer.image} />
                        <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Organized by</p>
                        <p className="text-sm text-gray-600">{event.organizer.name}</p>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Register for Event
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Past Events</h3>
                <p className="text-gray-600">
                  Past events will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
