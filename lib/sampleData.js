import { createDonor, createReceiver } from "./types"
import { saveDonor, saveReceiver } from "./storage"

// Sample donors data
const sampleDonors = [
  {
    donorId: "DONOR_001",
    name: "John Smith",
    age: 35,
    gender: "male",
    bloodGroup: "O+",
    organ: "Kidney",
    organTissueType: "HLA-A",
    organHealthScore: 9,
    location: "New York, NY",
    email: "john.smith@email.com",
    hospitalName: "Mount Sinai Hospital",
    hospitalTransportation: "Ambulance available 24/7",
    medicalHistory:
      "Healthy individual with no major medical conditions. Regular exercise, non-smoker, occasional social drinker.",
    password: "password123",
    registeredAt: "2024-01-15T10:30:00.000Z",
    isActive: true,
  },
  {
    donorId: "DONOR_002",
    name: "Sarah Johnson",
    age: 28,
    gender: "female",
    bloodGroup: "A+",
    organ: "Liver",
    organTissueType: "HLA-B",
    organHealthScore: 8,
    location: "Los Angeles, CA",
    email: "sarah.johnson@email.com",
    hospitalName: "UCLA Medical Center",
    hospitalTransportation: "Hospital transport service",
    medicalHistory: "Excellent health, vegetarian diet, regular medical checkups. No history of liver disease.",
    password: "password123",
    registeredAt: "2024-02-01T14:20:00.000Z",
    isActive: true,
  },
  {
    donorId: "DONOR_003",
    name: "Michael Chen",
    age: 42,
    gender: "male",
    bloodGroup: "B+",
    organ: "Heart",
    organTissueType: "HLA-DR",
    organHealthScore: 7,
    location: "Chicago, IL",
    email: "michael.chen@email.com",
    hospitalName: "Northwestern Memorial Hospital",
    hospitalTransportation: "Emergency medical services",
    medicalHistory: "Good cardiovascular health, regular cardio exercise, no smoking history.",
    password: "password123",
    registeredAt: "2024-01-20T09:15:00.000Z",
    isActive: true,
  },
]

// Sample receivers data
const sampleReceivers = [
  {
    receiverId: "RECEIVER_001",
    name: "Emily Davis",
    age: 45,
    gender: "female",
    bloodGroup: "O+",
    organ: "Kidney",
    organTissueType: "HLA-A",
    urgency: "High (1-30 days)",
    location: "New York, NY",
    email: "emily.davis@email.com",
    hospitalName: "Mount Sinai Hospital",
    medicalHistory: "Chronic kidney disease stage 5, on dialysis for 2 years. Diabetes type 2 managed with medication.",
    password: "password123",
    registeredAt: "2024-01-10T08:00:00.000Z",
    isActive: true,
  },
  {
    receiverId: "RECEIVER_002",
    name: "Robert Wilson",
    age: 38,
    gender: "male",
    bloodGroup: "A+",
    organ: "Liver",
    organTissueType: "HLA-B",
    urgency: "Critical (1-7 days)",
    location: "Los Angeles, CA",
    email: "robert.wilson@email.com",
    hospitalName: "UCLA Medical Center",
    medicalHistory: "End-stage liver disease due to hepatitis C. Currently hospitalized and on priority waiting list.",
    password: "password123",
    registeredAt: "2024-02-10T16:45:00.000Z",
    isActive: true,
  },
  {
    receiverId: "RECEIVER_003",
    name: "Lisa Thompson",
    age: 52,
    gender: "female",
    bloodGroup: "B+",
    organ: "Heart",
    organTissueType: "HLA-DR",
    urgency: "Medium (1-6 months)",
    location: "Chicago, IL",
    email: "lisa.thompson@email.com",
    hospitalName: "Northwestern Memorial Hospital",
    medicalHistory: "Cardiomyopathy with reduced ejection fraction. Heart failure symptoms managed with medications.",
    password: "password123",
    registeredAt: "2024-01-25T11:30:00.000Z",
    isActive: true,
  },
]

// Function to initialize sample data
export const initializeSampleData = () => {
  // Check if data already exists
  const existingDonors = JSON.parse(localStorage.getItem("organ_donors") || "[]")
  const existingReceivers = JSON.parse(localStorage.getItem("organ_receivers") || "[]")

  // Only add sample data if no existing data
  if (existingDonors.length === 0) {
    sampleDonors.forEach((donorData) => {
      const donor = createDonor(donorData)
      saveDonor(donor)
    })
  }

  if (existingReceivers.length === 0) {
    sampleReceivers.forEach((receiverData) => {
      const receiver = createReceiver(receiverData)
      saveReceiver(receiver)
    })
  }
}
