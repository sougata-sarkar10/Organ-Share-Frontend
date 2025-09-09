// Data types for the organ donation platform

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export const ORGANS = [
  "Heart",
  "Liver",
  "Kidney",
  "Lung",
  "Pancreas",
  "Small Intestine",
  "Cornea",
  "Skin",
  "Bone",
  "Heart Valve",
]

export const TISSUE_TYPES = ["HLA-A", "HLA-B", "HLA-C", "HLA-DR", "HLA-DQ", "HLA-DP"]

export const URGENCY_LEVELS = ["Critical (1-7 days)", "High (1-30 days)", "Medium (1-6 months)", "Low (6+ months)"]

// Donor data structure
export const createDonor = ({
  donorId,
  name,
  age,
  gender,
  bloodGroup,
  organ,
  organTissueType,
  organHealthScore,
  location,
  email,
  hospitalName,
  hospitalTransportation,
  medicalHistory,
  password,
}) => ({
  donorId,
  name,
  age,
  gender,
  bloodGroup,
  organ,
  organTissueType,
  organHealthScore,
  location,
  email,
  hospitalName,
  hospitalTransportation,
  medicalHistory,
  password,
  registeredAt: new Date().toISOString(),
  isActive: true,
})

// Receiver data structure
export const createReceiver = ({
  receiverId,
  name,
  age,
  gender,
  bloodGroup,
  organ,
  organTissueType,
  urgency,
  location,
  email,
  hospitalName,
  medicalHistory,
  password,
}) => ({
  receiverId,
  name,
  age,
  gender,
  bloodGroup,
  organ,
  organTissueType,
  urgency,
  location,
  email,
  hospitalName,
  medicalHistory,
  password,
  registeredAt: new Date().toISOString(),
  isActive: true,
})
