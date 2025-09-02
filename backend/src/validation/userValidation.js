import Joi from "joi";

// User validation schemas
export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  userType: Joi.string().valid("patient", "doctor", "admin").required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]+$/)
    .required(),
  dateOfBirth: Joi.date().max("now").required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  department: Joi.when("userType", {
    is: "doctor",
    then: Joi.string()
      .valid(
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Dermatology",
        "Gynecology",
        "Internal Medicine",
        "General Surgery",
        "Emergency Medicine",
        "Radiology",
        "Psychiatry",
        "Family Medicine"
      )
      .required(),
    otherwise: Joi.string().allow("").optional(),
  }),
  specialization: Joi.string().allow("").optional(),
  licenseNumber: Joi.string().allow("").optional(),
  emergencyContact: Joi.object({
    name: Joi.string().allow("").optional(),
    phone: Joi.string().allow("").optional(),
    relationship: Joi.string().allow("").optional(),
  }).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  userType: Joi.string().valid("patient", "doctor", "admin").optional(),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phoneNumber: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]+$/)
    .optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    country: Joi.string().optional(),
  }).optional(),
  specialization: Joi.string().allow("").optional(),
  licenseNumber: Joi.string().allow("").optional(),
  emergencyContact: Joi.object({
    name: Joi.string().allow("").optional(),
    phone: Joi.string().allow("").optional(),
    relationship: Joi.string().allow("").optional(),
  }).optional(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});
