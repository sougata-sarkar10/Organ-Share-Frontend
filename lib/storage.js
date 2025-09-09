// Local storage utilities for the organ donation platform

const STORAGE_KEYS = {
  DONORS: "organ_donors",
  RECEIVERS: "organ_receivers",
  CURRENT_USER: "current_user",
  USER_TYPE: "user_type",
}

// Generic storage functions
export const getFromStorage = (key) => {
  if (typeof window === "undefined") return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return null
  }
}

export const setToStorage = (key, value) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("Error writing to localStorage:", error)
  }
}

// Donor storage functions
export const getAllDonors = () => {
  return getFromStorage(STORAGE_KEYS.DONORS) || []
}

export const saveDonor = (donor) => {
  const donors = getAllDonors()
  const existingIndex = donors.findIndex((d) => d.donorId === donor.donorId)

  if (existingIndex >= 0) {
    donors[existingIndex] = donor
  } else {
    donors.push(donor)
  }

  setToStorage(STORAGE_KEYS.DONORS, donors)
  return donor
}

export const getDonorById = (donorId) => {
  const donors = getAllDonors()
  return donors.find((d) => d.donorId === donorId)
}

// Receiver storage functions
export const getAllReceivers = () => {
  return getFromStorage(STORAGE_KEYS.RECEIVERS) || []
}

export const saveReceiver = (receiver) => {
  const receivers = getAllReceivers()
  const existingIndex = receivers.findIndex((r) => r.receiverId === receiver.receiverId)

  if (existingIndex >= 0) {
    receivers[existingIndex] = receiver
  } else {
    receivers.push(receiver)
  }

  setToStorage(STORAGE_KEYS.RECEIVERS, receivers)
  return receiver
}

export const getReceiverById = (receiverId) => {
  const receivers = getAllReceivers()
  return receivers.find((r) => r.receiverId === receiverId)
}

// Authentication functions
export const getCurrentUser = () => {
  return getFromStorage(STORAGE_KEYS.CURRENT_USER)
}

export const getUserType = () => {
  return getFromStorage(STORAGE_KEYS.USER_TYPE)
}

export const setCurrentUser = (user, userType) => {
  setToStorage(STORAGE_KEYS.CURRENT_USER, user)
  setToStorage(STORAGE_KEYS.USER_TYPE, userType)
}

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  localStorage.removeItem(STORAGE_KEYS.USER_TYPE)
}

// Authentication validation
export const authenticateUser = (email, password, userType) => {
  if (userType === "donor") {
    const donors = getAllDonors()
    return donors.find((d) => d.email === email && d.password === password)
  } else if (userType === "receiver") {
    const receivers = getAllReceivers()
    return receivers.find((r) => r.email === email && r.password === password)
  }
  return null
}

// Generate unique IDs
export const generateId = (prefix) => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
