"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BLOOD_GROUPS, ORGANS, TISSUE_TYPES } from "@/lib/types"

export default function DonorProfileEdit({ donor, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    ...donor,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!formData.name || !formData.age || !formData.location || !formData.hospitalName) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (Number.parseInt(formData.age) < 18 || Number.parseInt(formData.age) > 80) {
      setError("Age must be between 18 and 80")
      setLoading(false)
      return
    }

    if (!formData.organHealthScore || formData.organHealthScore < 1 || formData.organHealthScore > 10) {
      setError("Organ health score must be between 1 and 10")
      setLoading(false)
      return
    }

    try {
      // Convert age and health score to numbers
      const updatedDonor = {
        ...formData,
        age: Number.parseInt(formData.age),
        organHealthScore: Number.parseInt(formData.organHealthScore),
      }

      onSave(updatedDonor)
    } catch (error) {
      setError("Failed to update profile. Please try again.")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="80"
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
                <RadioGroupItem value="male" id="edit-male" />
                <Label htmlFor="edit-male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="edit-female" />
                <Label htmlFor="edit-female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="edit-other" />
                <Label htmlFor="edit-other">Other</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => updateFormData("location", e.target.value)}
            placeholder="City, State"
            required
          />
        </div>
      </div>

      {/* Medical Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>

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
          <div className="space-y-2">
            <Label htmlFor="organHealthScore">Organ Health Score (1-10) *</Label>
            <Input
              id="organHealthScore"
              type="number"
              min="1"
              max="10"
              value={formData.organHealthScore}
              onChange={(e) => updateFormData("organHealthScore", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hospitalName">Hospital Name *</Label>
            <Input
              id="hospitalName"
              value={formData.hospitalName}
              onChange={(e) => updateFormData("hospitalName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hospitalTransportation">Hospital Transportation</Label>
            <Input
              id="hospitalTransportation"
              value={formData.hospitalTransportation || ""}
              onChange={(e) => updateFormData("hospitalTransportation", e.target.value)}
              placeholder="Transportation details (optional)"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalHistory">Medical History *</Label>
          <Textarea
            id="medicalHistory"
            value={formData.medicalHistory}
            onChange={(e) => updateFormData("medicalHistory", e.target.value)}
            rows={4}
            required
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
