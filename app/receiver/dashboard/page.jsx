"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Edit, LogOut, MapPin, Building2, Mail, Activity, Users, Clock, AlertCircle } from "lucide-react"
import { getAllDonors, saveReceiver } from "@/lib/storage"
import ReceiverProfileEdit from "@/components/ReceiverProfileEdit"

function ReceiverDashboard() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [matches, setMatches] = useState([])
  const [stats, setStats] = useState({
    totalMatches: 0,
    highQualityMatches: 0,
    sameLocation: 0,
    waitingDays: 0,
  })

  useEffect(() => {
    if (user) {
      findMatches()
      calculateWaitingTime()
    }
  }, [user])

  const findMatches = () => {
    const donors = getAllDonors()

    // Find compatible donors based on blood group, organ, and tissue type
    const compatibleDonors = donors.filter((donor) => {
      const bloodCompatible = isBloodCompatible(donor.bloodGroup, user.bloodGroup)
      const organMatch = donor.organ === user.organ
      const tissueMatch = donor.organTissueType === user.organTissueType

      return bloodCompatible && organMatch && tissueMatch && donor.isActive
    })

    // Sort by organ health score and location
    const sortedMatches = compatibleDonors.sort((a, b) => {
      // Primary sort by organ health score (higher is better)
      const healthDiff = b.organHealthScore - a.organHealthScore
      if (healthDiff !== 0) return healthDiff

      // Secondary sort by location match
      const aLocationMatch = a.location.toLowerCase().includes(user.location.toLowerCase())
      const bLocationMatch = b.location.toLowerCase().includes(user.location.toLowerCase())

      if (aLocationMatch && !bLocationMatch) return -1
      if (!aLocationMatch && bLocationMatch) return 1

      return 0
    })

    setMatches(sortedMatches)

    // Calculate stats
    setStats((prev) => ({
      ...prev,
      totalMatches: sortedMatches.length,
      highQualityMatches: sortedMatches.filter((d) => d.organHealthScore >= 8).length,
      sameLocation: sortedMatches.filter((d) => d.location.toLowerCase().includes(user.location.toLowerCase())).length,
    }))
  }

  const calculateWaitingTime = () => {
    if (user.registeredAt) {
      const registeredDate = new Date(user.registeredAt)
      const currentDate = new Date()
      const diffTime = Math.abs(currentDate - registeredDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      setStats((prev) => ({
        ...prev,
        waitingDays: diffDays,
      }))
    }
  }

  const isBloodCompatible = (donorBlood, receiverBlood) => {
    const compatibility = {
      "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
      "O+": ["O+", "A+", "B+", "AB+"],
      "A-": ["A-", "A+", "AB-", "AB+"],
      "A+": ["A+", "AB+"],
      "B-": ["B-", "B+", "AB-", "AB+"],
      "B+": ["B+", "AB+"],
      "AB-": ["AB-", "AB+"],
      "AB+": ["AB+"],
    }

    return compatibility[donorBlood]?.includes(receiverBlood) || false
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Critical (1-7 days)":
        return "bg-red-100 text-red-800 border-red-200"
      case "High (1-30 days)":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium (1-6 months)":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low (6+ months)":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getHealthScoreColor = (score) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const handleProfileUpdate = (updatedProfile) => {
    saveReceiver(updatedProfile)
    setIsEditing(false)
    findMatches() // Refresh matches after profile update
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">LifeBridge</span>
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                Receiver
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Urgency Alert */}
        {user.urgency === "Critical (1-7 days)" && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Critical Priority Status</p>
                  <p className="text-red-700 text-sm">
                    Your case has been marked as critical. Our team is actively working to find a match.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Donors</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalMatches}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Quality</p>
                  <p className="text-3xl font-bold text-green-600">{stats.highQualityMatches}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Same Location</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.sameLocation}</p>
                </div>
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Waiting Days</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.waitingDays}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="matches">Available Donors ({matches.length})</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Receiver Profile</CardTitle>
                    <CardDescription>Your organ recipient information</CardDescription>
                  </div>
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <ReceiverProfileEdit
                    receiver={user}
                    onSave={handleProfileUpdate}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">Receiver ID: {user.receiverId}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Age</p>
                          <p className="text-gray-900">{user.age} years</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Gender</p>
                          <p className="text-gray-900 capitalize">{user.gender}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">{user.email}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600">Location</p>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">{user.location}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600">Registered</p>
                        <p className="text-gray-900">
                          {new Date(user.registeredAt).toLocaleDateString()} ({stats.waitingDays} days ago)
                        </p>
                      </div>
                    </div>

                    {/* Medical Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Blood Group</p>
                          <Badge variant="outline" className="mt-1">
                            {user.bloodGroup}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Needed Organ</p>
                          <Badge className="mt-1 bg-blue-100 text-blue-800">{user.organ}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tissue Type</p>
                          <p className="text-gray-900">{user.organTissueType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Urgency Level</p>
                          <Badge className={`mt-1 ${getUrgencyColor(user.urgency)}`}>{user.urgency}</Badge>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600">Hospital</p>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">{user.hospitalName}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600">Medical History</p>
                        <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-md mt-1">{user.medicalHistory}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle>Available Donors</CardTitle>
                <CardDescription>Donors who match your blood type, organ, and tissue compatibility</CardDescription>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No compatible donors found at this time.</p>
                    <p className="text-sm text-gray-500 mt-2">We'll notify you when new donors become available.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matches.map((donor) => (
                      <Card key={donor.donorId} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-green-100 text-green-600">
                                    {donor.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">{donor.name}</p>
                                  <p className="text-sm text-gray-600">ID: {donor.donorId}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Age</p>
                                  <p className="font-medium">{donor.age} years</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Blood Group</p>
                                  <p className="font-medium">{donor.bloodGroup}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Location</p>
                                  <p className="font-medium">{donor.location}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Hospital</p>
                                  <p className="font-medium">{donor.hospitalName}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end space-y-2">
                              <div className="flex items-center space-x-2">
                                <Activity className="h-4 w-4 text-gray-400" />
                                <span className={`font-medium ${getHealthScoreColor(donor.organHealthScore)}`}>
                                  {donor.organHealthScore}/10
                                </span>
                              </div>
                              {donor.organHealthScore >= 8 && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">High Quality</Badge>
                              )}
                              {donor.location.toLowerCase().includes(user.location.toLowerCase()) && (
                                <Badge variant="outline" className="text-purple-600 border-purple-600">
                                  Same Location
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function ReceiverDashboardPage() {
  return (
    <ProtectedRoute requiredUserType="receiver">
      <ReceiverDashboard />
    </ProtectedRoute>
  )
}
