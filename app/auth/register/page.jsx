"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, ArrowLeft, User, Mail, Lock, MapPin, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BLOOD_GROUPS, ORGANS, TISSUE_TYPES, URGENCY_LEVELS, createDonor, createReceiver } from "@/lib/types"
import { saveDonor, saveReceiver, generateId } from "@/lib/storage"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialUserType = searchParams.get("type") || "donor"

  const [userType, setUserType] = useState(initialUserType)
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Common fields
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    organ: "",
    organTissueType: "",
    location: "",
    email: "",
    hospitalName: "",
    medicalHistory: "",
    password: "",
    confirmPassword: "",
    // Donor specific
    organHealthScore: "",
    hospitalTransportation: "",
    // Receiver specific
    urgency: "",
  })

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    const { name, age, gender, email, password, confirmPassword } = formData

    if (!name || !age || !gender || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields")
      return false
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }

    if (Number.parseInt(age) < 18 || Number.parseInt(age) > 80) {
      setError("Age must be between 18 and 80")
      return false
    }

    return true
  }

  const validateStep2 = () => {
    const { bloodGroup, organ, organTissueType, location, hospitalName, medicalHistory } = formData

    if (!bloodGroup || !organ || !organTissueType || !location || !hospitalName || !medicalHistory) {
      setError("Please fill in all medical information")
      return false
    }

    if (userType === "donor" && !formData.organHealthScore) {
      setError("Please provide organ health score")
      return false
    }

    if (userType === "receiver" && !formData.urgency) {
      setError("Please select urgency level")
      return false
    }

    return true
  }

  const handleNext = () => {
    setError("")

    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!validateStep2()) {
      setLoading(false)
      return
    }

    try {
      if (userType === "donor") {
        const donor = createDonor({
          donorId: generateId("DONOR"),
          name: formData.name,
          age: Number.parseInt(formData.age),
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          organ: formData.organ,
          organTissueType: formData.organTissueType,
          organHealthScore: Number.parseInt(formData.organHealthScore),
          location: formData.location,
          email: formData.email,
          hospitalName: formData.hospitalName,
          hospitalTransportation: formData.hospitalTransportation,
          medicalHistory: formData.medicalHistory,
          password: formData.password,
        })

        saveDonor(donor)
      } else {
        const receiver = createReceiver({
          receiverId: generateId("RECEIVER"),
          name: formData.name,
          age: Number.parseInt(formData.age),
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          organ: formData.organ,
          organTissueType: formData.organTissueType,
          urgency: formData.urgency,
          location: formData.location,
          email: formData.email,
          hospitalName: formData.hospitalName,
          medicalHistory: formData.medicalHistory,
          password: formData.password,
        })

        saveReceiver(receiver)
      }

      // Redirect to login
      router.push("/auth/login")
    } catch (error) {
      setError("Registration failed. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">LifeBridge</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join LifeBridge</h1>
          <p className="text-gray-600">Create your account to save lives</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration - Step {step} of 2</CardTitle>
            <CardDescription>{step === 1 ? "Personal Information" : "Medical Information"}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="space-y-6">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <Label>I want to:</Label>
                  <RadioGroup value={userType} onValueChange={setUserType} className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="donor" id="donor" />
                      <Label htmlFor="donor" className="flex items-center cursor-pointer">
                        <Heart className="h-4 w-4 mr-2 text-green-600" />
                        Donate Organs
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="receiver" id="receiver" />
                      <Label htmlFor="receiver" className="flex items-center cursor-pointer">
                        <User className="h-4 w-4 mr-2 text-blue-600" />
                        Receive Organs
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="80"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <RadioGroup value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleNext} className="w-full">
                  Next Step
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Medical Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Blood Group *</Label>
                    <Select value={formData.bloodGroup} onValueChange={(value) => updateFormData("bloodGroup", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Organ *</Label>
                    <Select value={formData.organ} onValueChange={(value) => updateFormData("organ", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organ" />
                      </SelectTrigger>
                      <SelectContent>
                        {ORGANS.map((organ) => (
                          <SelectItem key={organ} value={organ}>
                            {organ}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tissue Type *</Label>
                    <Select
                      value={formData.organTissueType}
                      onValueChange={(value) => updateFormData("organTissueType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tissue type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TISSUE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {userType === "donor" ? (
                    <div className="space-y-2">
                      <Label htmlFor="organHealthScore">Organ Health Score (1-10) *</Label>
                      <Input
                        id="organHealthScore"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="Rate organ health"
                        value={formData.organHealthScore}
                        onChange={(e) => updateFormData("organHealthScore", e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Urgency Level *</Label>
                      <Select value={formData.urgency} onValueChange={(value) => updateFormData("urgency", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          {URGENCY_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="hospitalName"
                        placeholder="Hospital name"
                        value={formData.hospitalName}
                        onChange={(e) => updateFormData("hospitalName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {userType === "donor" && (
                  <div className="space-y-2">
                    <Label htmlFor="hospitalTransportation">Hospital Transportation</Label>
                    <Input
                      id="hospitalTransportation"
                      placeholder="Transportation details (optional)"
                      value={formData.hospitalTransportation}
                      onChange={(e) => updateFormData("hospitalTransportation", e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Medical History *</Label>
                  <Textarea
                    id="medicalHistory"
                    placeholder="Describe your medical history, current conditions, medications, etc."
                    value={formData.medicalHistory}
                    onChange={(e) => updateFormData("medicalHistory", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            )}

            {/* Login Link */}
            <div className="text-center text-sm mt-6">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
