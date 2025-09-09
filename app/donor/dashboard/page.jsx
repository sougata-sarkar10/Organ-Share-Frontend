"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Edit, LogOut, MapPin, Building2, Mail, Activity, Users, AlertCircle } from "lucide-react"
import { getAllReceivers, saveDonor } from "@/lib/storage"
import DonorProfileEdit from "@/components/DonorProfileEdit"

function DonorDashboard() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [matches, setMatches] = useState([])
  const [stats, setStats] = useState({
    totalMatches: 0,
    criticalMatches: 0,
    sameLocation: 0,
  })

  useEffect(() => {
    if (user) {
      findMatches()
    }
  }, [user])

  const findMatches = () => {
    const receivers = getAllReceivers()

    // Find compatible receivers based on blood group, organ, and tissue type
    const compatibleReceivers = receivers.filter((receiver) => {
      const bloodCompatible = isBloodCompatible(user.bloodGroup, receiver.bloodGroup)
      const organMatch = user.organ === receiver.organ
      const tissueMatch = user.organTissueType === receiver.organTissueType

      return bloodCompatible && organMatch && tissueMatch && receiver.isActive
    })

    // Sort by urgency and location
    const sortedMatches = compatibleReceivers.sort((a, b) => {
      const urgencyOrder = {
        "Critical (1-7 days)": 4,
        "High (1-30 days)": 3,
        "Medium (1-6 months)": 2,
        "Low (6+ months)": 1,
      }

      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
      if (urgencyDiff !== 0) return urgencyDiff

      // Secondary sort by location match
      const aLocationMatch = a.location.toLowerCase().includes(user.location.toLowerCase())
      const bLocationMatch = b.location.toLowerCase().includes(user.location.toLowerCase())

      if (aLocationMatch && !bLocationMatch) return -1
      if (!aLocationMatch && bLocationMatch) return 1

      return 0
    })

    setMatches(sortedMatches)

    // Calculate stats
    setStats({
      totalMatches: sortedMatches.length,
      criticalMatches: sortedMatches.filter((r) => r.urgency === "Critical (1-7 days)").length,
      sameLocation: sortedMatches.filter((r) => r.location.toLowerCase().includes(user.location.toLowerCase())).length,
    })
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
        return "bg-red-100 text-red-800"
      case "High (1-30 days)":
        return "bg-orange-100 text-orange-800"
      case "Medium (1-6 months)":
        return "bg-yellow-100 text-yellow-800"
      case "Low (6+ months)":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleProfileUpdate = (updatedProfile) => {
    saveDonor(updatedProfile)
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
              <Badge variant="secondary" className="ml-2">
                Donor
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Matches</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalMatches}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Cases</p>
                  <p className="text-3xl font-bold text-red-600">{stats.criticalMatches}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Same Location</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.sameLocation}</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="matches">Compatible Recipients ({matches.length})</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Donor Profile</CardTitle>
                    <CardDescription>Your organ donation information</CardDescription>
                  </div>
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <DonorProfileEdit donor={user} onSave={handleProfileUpdate} onCancel={() => setIsEditing(false)} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">Donor ID: {user.donorId}</p>
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
                          <p className="text-sm font-medium text-gray-600">Organ</p>
                          <Badge className="mt-1 bg-green-100 text-green-800">{user.organ}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tissue Type</p>
                          <p className="text-gray-900">{user.organTissueType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Health Score</p>
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <p className="text-gray-900">{user.organHealthScore}/10</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600">Hospital</p>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">{user.hospitalName}</p>
                        </div>
                      </div>

                      {user.hospitalTransportation && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Transportation</p>
                          <p className="text-gray-900">{user.hospitalTransportation}</p>
                        </div>
                      )}

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
                <CardTitle>Compatible Recipients</CardTitle>
                <CardDescription>Recipients who match your blood type, organ, and tissue compatibility</CardDescription>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No compatible recipients found at this time.</p>
                    <p className="text-sm text-gray-500 mt-2">We'll notify you when new matches become available.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matches.map((receiver) => (
                      <Card key={receiver.receiverId} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {receiver.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">{receiver.name}</p>
                                  <p className="text-sm text-gray-600">ID: {receiver.receiverId}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Age</p>
                                  <p className="font-medium">{receiver.age} years</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Blood Group</p>
                                  <p className="font-medium">{receiver.bloodGroup}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Location</p>
                                  <p className="font-medium">{receiver.location}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Hospital</p>
                                  <p className="font-medium">{receiver.hospitalName}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end space-y-2">
                              <Badge className={getUrgencyColor(receiver.urgency)}>{receiver.urgency}</Badge>
                              {receiver.location.toLowerCase().includes(user.location.toLowerCase()) && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
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

export default function DonorDashboardPage() {
  return (
    <ProtectedRoute requiredUserType="donor">
      <DonorDashboard />
    </ProtectedRoute>
  )
}
