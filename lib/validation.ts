// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation (supports various formats)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Required field validation
export const validateRequired = (value: string | number): boolean => {
  if (typeof value === 'number') {
    return value > 0
  }
  return value && value.trim().length > 0
}

// Time range validation
export const validateTimeRange = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  const startInMinutes = startHour * 60 + startMin
  const endInMinutes = endHour * 60 + endMin
  return startInMinutes < endInMinutes
}

// Delivery time validation
export const validateDeliveryTime = (minTime: number, maxTime: number): boolean => {
  return minTime > 0 && maxTime > 0 && minTime < maxTime
}

export const validateCoordinate = (
  value: string | number | null | undefined,
  min: number,
  max: number
): boolean => {
  if (value === '' || value === null || value === undefined) {
    return true
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed)) {
    return false
  }

  return parsed >= min && parsed <= max
}

// Validation result type
export interface ValidationResult {
  isValid: boolean
  errors: { [key: string]: string }
}

// Branch form validation
export const validateBranchForm = (formData: any, operatingHoursStart: string, operatingHoursEnd: string): ValidationResult => {
  const errors: { [key: string]: string } = {}

  // Basic information validation
  if (!validateRequired(formData.name)) {
    errors.name = 'Branch name is required'
  }
  if (!validateRequired(formData.city)) {
    errors.city = 'City is required'
  }
  if (!validateRequired(formData.address)) {
    errors.address = 'Address is required'
  }

  // Contact information validation
  if (!validateRequired(formData.phone)) {
    errors.phone = 'Phone number is required'
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Invalid phone number format'
  }

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format'
  }

  // Operating details validation
  if (!validateTimeRange(operatingHoursStart, operatingHoursEnd)) {
    errors.operating_hours = 'Please select valid operating hours (start time must be before end time)'
  }

  if (!validateDeliveryTime(formData.delivery_time_min, formData.delivery_time_max)) {
    errors.delivery_time = 'Please select valid delivery time (min must be less than max)'
  }

  // Maps iframe validation
  if (!validateRequired(formData.maps_iframe)) {
    errors.maps_iframe = 'Maps iframe is required'
  }

  if (!validateCoordinate(formData.latitude, -90, 90)) {
    errors.latitude = 'Latitude must be a decimal value between -90 and 90'
  }

  if (!validateCoordinate(formData.longitude, -180, 180)) {
    errors.longitude = 'Longitude must be a decimal value between -180 and 180'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// User form validation
export const validateUserForm = (formData: any): ValidationResult => {
  const errors: { [key: string]: string } = {}

  // Name validation
  if (!validateRequired(formData.name)) {
    errors.name = 'Name is required'
  }

  // Email validation
  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format'
  }

  // Phone validation
  if (!validateRequired(formData.phone)) {
    errors.phone = 'Phone number is required'
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Invalid phone number format'
  }

  // Role validation
  if (!validateRequired(formData.role)) {
    errors.role = 'Role is required'
  }

  // Branch validation
  if (!validateRequired(formData.branch)) {
    errors.branch = 'Branch is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Menu form validation
export const validateMenuForm = (formData: any): ValidationResult => {
  const errors: { [key: string]: string } = {}

  // Name validation
  if (!validateRequired(formData.name)) {
    errors.name = 'Item name is required'
  }

  // Category validation
  if (!validateRequired(formData.category)) {
    errors.category = 'Category is required'
  }

  // Price validation
  if (!formData.price || formData.price <= 0) {
    errors.price = 'Price must be greater than 0'
  }

  // Description validation (optional but if provided should be reasonable)
  if (formData.description && formData.description.length > 500) {
    errors.description = 'Description should not exceed 500 characters'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Franchise form validation
export const validateFranchiseForm = (formData: any): ValidationResult => {
  const errors: { [key: string]: string } = {}

  // Full name validation
  if (!validateRequired(formData.full_name)) {
    errors.full_name = 'Full name is required'
  }

  // Email validation
  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format'
  }

  // Phone validation
  if (!validateRequired(formData.phone)) {
    errors.phone = 'Phone number is required'
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Invalid phone number format'
  }

  // Location validation
  if (!validateRequired(formData.location)) {
    errors.location = 'Location is required'
  }

  // Business experience validation
  if (!validateRequired(formData.business_experience)) {
    errors.business_experience = 'Business experience is required'
  }

  // Investment capacity validation
  if (!validateRequired(formData.investment_capacity)) {
    errors.investment_capacity = 'Investment capacity is required'
  }

  // Status validation
  if (!validateRequired(formData.status)) {
    errors.status = 'Status is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Generic form validation helper
export const validateForm = (formData: any, requiredFields: string[]): ValidationResult => {
  const errors: { [key: string]: string } = {}

  requiredFields.forEach((field) => {
    if (!validateRequired(formData[field])) {
      const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      errors[field] = `${fieldName} is required`
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
