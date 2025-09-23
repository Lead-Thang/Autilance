"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Switch } from "../../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"
import { Separator } from "../../../components/ui/separator"
import {
  User,
  Building,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Globe,
  Phone,
  MapPin,
  Camera,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useUser } from "../../../hooks/use-user"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  firstName: string
  lastName: string
  displayName: string
  email: string
  phone: string
  location: string
  bio: string
  website: string
  avatar: string
}

interface CompanyProfile {
  name: string
  industry: string
  description: string
  size: string
  foundedYear: string
  logo: string
  certificationPrefix: string
}

interface NotificationSettings {
  email: boolean
  push: boolean
  marketing: boolean
  certifications: boolean
  applications: boolean
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user, isLoading } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    marketing: false,
    certifications: true,
    applications: true,
  })
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    avatar: ""
  })
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: "",
    industry: "",
    description: "",
    size: "",
    foundedYear: "",
    logo: "",
    certificationPrefix: ""
  })

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      fetchCompanyProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    if (!user?.id) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, display_name, phone, location, bio, website, avatar')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return
      }

      setUserProfile({
        firstName: data.first_name || user.name?.split(' ')[0] || "",
        lastName: data.last_name || user.name?.split(' ')[1] || "",
        displayName: data.display_name || user.displayName || user.name || "",
        email: user.email || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
        website: data.website || "",
        avatar: data.avatar || user.avatar || ""
      })
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const fetchCompanyProfile = async () => {
    if (!user?.id) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('companies')
        .select('name, industry, description, size, founded_year, logo, certification_prefix')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error("Error fetching company profile:", error)
        return
      }

      setCompanyProfile({
        name: data.name || "",
        industry: data.industry || "",
        description: data.description || "",
        size: data.size || "",
        foundedYear: data.founded_year || "",
        logo: data.logo || "",
        certificationPrefix: data.certification_prefix || ""
      })
    } catch (error) {
      console.error("Error fetching company profile:", error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user?.id) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({
          first_name: userProfile.firstName,
          last_name: userProfile.lastName,
          display_name: userProfile.displayName,
          phone: userProfile.phone,
          location: userProfile.location,
          bio: userProfile.bio,
          website: userProfile.website,
          avatar: userProfile.avatar
        })
        .eq('id', user.id)

      if (error) {
        console.error("Error updating user profile:", error)
        return
      }

      // Show success message
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error saving user profile:", error)
      alert("Error updating profile. Please try again.")
    }
  }

  const handleSaveCompany = async () => {
    if (!user?.id) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('companies')
        .update({
          name: companyProfile.name,
          industry: companyProfile.industry,
          description: companyProfile.description,
          size: companyProfile.size,
          founded_year: companyProfile.foundedYear,
          logo: companyProfile.logo,
          certification_prefix: companyProfile.certificationPrefix
        })
        .eq('user_id', user.id)

      if (error) {
        console.error("Error updating company profile:", error)
        return
      }

      // Show success message
      alert("Company profile updated successfully!")
    } catch (error) {
      console.error("Error saving company profile:", error)
      alert("Error updating company profile. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account and platform preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Update your personal details and profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={userProfile.avatar || "/placeholder.svg?height=80&width=80"} />
                  <AvatarFallback className="text-lg">
                    {userProfile.firstName?.charAt(0)}{userProfile.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-600">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={userProfile.firstName} 
                    onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={userProfile.lastName} 
                    onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName" 
                  value={userProfile.displayName} 
                  onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})} 
                  placeholder="How you want to be addressed" 
                />
                <p className="text-sm text-gray-600">This is how you'll be greeted throughout the platform</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="email" 
                    type="email" 
                    value={userProfile.email} 
                    className="flex-1" 
                    readOnly
                  />
                  {user?.provider && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">Connected via {user?.provider ? user.provider.charAt(0).toUpperCase() + user.provider.slice(1) + " OAuth" : "email"} </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="phone" 
                    placeholder="+1 (555) 123-4567" 
                    className="pl-10" 
                    value={userProfile.phone} 
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="location" 
                    placeholder="San Francisco, CA" 
                    className="pl-10" 
                    value={userProfile.location} 
                    onChange={(e) => setUserProfile({...userProfile, location: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell others about yourself and your expertise..." 
                  rows={4} 
                  value={userProfile.bio} 
                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="website" 
                    placeholder="https://yourwebsite.com" 
                    className="pl-10" 
                    value={userProfile.website} 
                    onChange={(e) => setUserProfile({...userProfile, website: e.target.value})} 
                  />
                </div>
              </div>

              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600"
                onClick={handleSaveProfile}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-green-600" />
                <span>Company Profile</span>
              </CardTitle>
              <CardDescription>Manage your company information for issuing certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-gray-600">Company logo for certificates</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName" 
                    placeholder="Your Company Inc." 
                    value={companyProfile.name} 
                    onChange={(e) => setCompanyProfile({...companyProfile, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    placeholder="Technology, Healthcare, etc." 
                    value={companyProfile.industry} 
                    onChange={(e) => setCompanyProfile({...companyProfile, industry: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  placeholder="Describe your company and what certifications you offer..."
                  rows={4}
                  value={companyProfile.description}
                  onChange={(e) => setCompanyProfile({...companyProfile, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Input 
                    id="companySize" 
                    placeholder="1-10, 11-50, 51-200, etc." 
                    value={companyProfile.size} 
                    onChange={(e) => setCompanyProfile({...companyProfile, size: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded">Founded Year</Label>
                  <Input 
                    id="founded" 
                    placeholder="2020" 
                    value={companyProfile.foundedYear} 
                    onChange={(e) => setCompanyProfile({...companyProfile, foundedYear: e.target.value})} 
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Certification Authority</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Verified Company Status</span>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your company is verified to issue professional certifications on Autilance
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificationPrefix">Certification Prefix</Label>
                  <Input 
                    id="certificationPrefix" 
                    placeholder="TECH-" 
                    value={companyProfile.certificationPrefix} 
                    onChange={(e) => setCompanyProfile({...companyProfile, certificationPrefix: e.target.value})} 
                  />
                  <p className="text-sm text-gray-600">
                    This prefix will appear on all certificates you issue (e.g., TECH-001)
                  </p>
                </div>
              </div>

              <Button 
                className="bg-gradient-to-r from-green-600 to-blue-600"
                onClick={handleSaveCompany}
              >
                <Save className="w-4 h-4 mr-2" />
                Update Company Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose how you want to be notified about platform activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="marketing-notifications">Marketing Updates</Label>
                    <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                  </div>
                  <Switch
                    id="marketing-notifications"
                    checked={notifications.marketing}
                    onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, marketing: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Platform Activity</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="cert-notifications">New Certifications</Label>
                    <p className="text-sm text-gray-600">When new certification opportunities are posted</p>
                  </div>
                  <Switch
                    id="cert-notifications"
                    checked={notifications.certifications}
                    onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, certifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="app-notifications">Application Updates</Label>
                    <p className="text-sm text-gray-600">When someone applies for your certifications</p>
                  </div>
                  <Switch
                    id="app-notifications"
                    checked={notifications.applications}
                    onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, applications: checked })}
                  />
                </div>
              </div>

              <Button className="bg-gradient-to-r from-yellow-600 to-orange-600">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Manage your account security and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Password</h3>

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                  </div>
                </div>

                <Button variant="outline">Update Password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">2FA Status</span>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                  <Button size="sm" className="bg-gradient-to-r from-green-600 to-blue-600">
                    Enable 2FA
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Privacy</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Certifications</Label>
                    <p className="text-sm text-gray-600">Display your earned certifications publicly</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Activity Status</Label>
                    <p className="text-sm text-gray-600">Show when you're online</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                <div className="border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Account</h4>
                      <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span>Billing & Subscription</span>
              </CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Pro Plan</h3>
                    <p className="text-gray-600">Full access to all features</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Monthly Cost:</span>
                    <p className="font-semibold">$29/month</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Billing:</span>
                    <p className="font-semibold">Jan 15, 2024</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="font-semibold text-green-600">Active</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-600">Expires 12/25</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Billing History</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Pro Plan - December 2023</p>
                      <p className="text-sm text-gray-600">Dec 15, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$29.00</p>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Pro Plan - November 2023</p>
                      <p className="text-sm text-gray-600">Nov 15, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$29.00</p>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline">Download Invoices</Button>
                <Button variant="destructive">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-purple-600" />
                <span>Appearance Settings</span>
              </CardTitle>
              <CardDescription>Customize how Autilance looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`border-2 ${theme === "light" ? "border-purple-500" : "border-border"} rounded-lg p-4 cursor-pointer transition-colors hover:border-purple-300`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="w-full h-20 bg-gradient-to-r from-white to-gray-100 rounded mb-2 border"></div>
                    <p className="text-sm font-medium text-center">Light</p>
                  </div>
                  <div
                    className={`border-2 ${theme === "dark" ? "border-purple-500" : "border-border"} rounded-lg p-4 cursor-pointer transition-colors hover:border-purple-300`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="w-full h-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded mb-2"></div>
                    <p className="text-sm font-medium text-center">Dark</p>
                  </div>
                  <div
                    className={`border-2 ${theme === "system" ? "border-purple-500" : "border-border"} rounded-lg p-4 cursor-pointer transition-colors hover:border-purple-300`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="w-full h-20 bg-gradient-to-r from-white via-gray-100 to-gray-800 rounded mb-2 border"></div>
                    <p className="text-sm font-medium text-center">Auto</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Accent Color</h3>
                <div className="grid grid-cols-6 gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full cursor-pointer ring-2 ring-purple-600 ring-offset-2"></div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-600 hover:ring-offset-2"></div>
                  <div className="w-8 h-8 bg-green-600 rounded-full cursor-pointer hover:ring-2 hover:ring-green-600 hover:ring-offset-2"></div>
                  <div className="w-8 h-8 bg-red-600 rounded-full cursor-pointer hover:ring-2 hover:ring-red-600 hover:ring-offset-2"></div>
                  <div className="w-8 h-8 bg-yellow-600 rounded-full cursor-pointer hover:ring-2 hover:ring-yellow-600 hover:ring-offset-2"></div>
                  <div className="w-8 h-8 bg-pink-600 rounded-full cursor-pointer hover:ring-2 hover:ring-pink-600 hover:ring-offset-2"></div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Display Options</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-gray-600">Reduce spacing and padding</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Animations</Label>
                    <p className="text-sm text-gray-600">Enable smooth transitions and animations</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>High Contrast</Label>
                    <p className="text-sm text-gray-600">Increase contrast for better accessibility</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Save className="w-4 h-4 mr-2" />
                Save Appearance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
