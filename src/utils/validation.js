// Validation utility functions

export const validateString = (value, fieldName, minLength = 1, maxLength = 100) => {
  if (!value || typeof value !== "string") {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  const trimmed = value.trim();
  
  if (trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} character(s)` };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }
  
  // Check if contains only valid characters (letters, spaces, hyphens, apostrophes)
  const namePattern = /^[a-zA-Z\s\-']+$/;
  if (fieldName.toLowerCase().includes("name") && !namePattern.test(trimmed)) {
    return { valid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { valid: true, value: trimmed };
};

export const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }
  
  const trimmed = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  
  return { valid: true, value: trimmed };
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== "string") {
    return { valid: true, value: "" }; // Phone is optional
  }
  
  const trimmed = phone.trim();
  
  if (trimmed === "") {
    return { valid: true, value: "" };
  }
  
  // Allow numbers, spaces, +, -, (, )
  const phonePattern = /^[\d\s\+\-\(\)]+$/;
  
  if (!phonePattern.test(trimmed)) {
    return { valid: false, error: "Phone can only contain numbers, spaces, +, -, (, )" };
  }
  
  if (trimmed.replace(/\D/g, "").length < 10) {
    return { valid: false, error: "Phone number must have at least 10 digits" };
  }
  
  return { valid: true, value: trimmed };
};

export const validateTaskTitle = (title) => {
  if (!title || typeof title !== "string") {
    return { valid: false, error: "Task title is required" };
  }
  
  const trimmed = title.trim();
  
  if (trimmed.length < 3) {
    return { valid: false, error: "Task title must be at least 3 characters" };
  }
  
  if (trimmed.length > 100) {
    return { valid: false, error: "Task title must be less than 100 characters" };
  }
  
  return { valid: true, value: trimmed };
};

export const validateTaskDescription = (description) => {
  if (!description || typeof description !== "string") {
    return { valid: true, value: "" }; // Description is optional
  }
  
  const trimmed = description.trim();
  
  if (trimmed.length > 500) {
    return { valid: false, error: "Description must be less than 500 characters" };
  }
  
  return { valid: true, value: trimmed };
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true, value };
};

export const validateDepartment = (department) => {
  if (!department || typeof department !== "string") {
    return { valid: true, value: "" }; // Department is optional
  }
  
  const trimmed = department.trim();
  
  if (trimmed === "") {
    return { valid: true, value: "" };
  }
  
  // Allow letters, numbers, spaces, hyphens
  const deptPattern = /^[a-zA-Z0-9\s\-]+$/;
  
  if (!deptPattern.test(trimmed)) {
    return { valid: false, error: "Department can only contain letters, numbers, spaces, and hyphens" };
  }
  
  return { valid: true, value: trimmed };
};
