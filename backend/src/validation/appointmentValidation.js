import Joi from "joi";

// Appointment validation schemas
export const createAppointmentSchema = Joi.object({
  doctor: Joi.string().hex().length(24).required(),
  appointmentDate: Joi.date().min("now").required(),
  timeSlot: Joi.object({
    start: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required(),
    end: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required(),
  }).required(),
  reason: Joi.string().max(500).required(),
  symptoms: Joi.string().max(1000).allow("").optional(),
  priority: Joi.string().valid("low", "normal", "high", "urgent").optional(),
  isEmergency: Joi.boolean().optional(),
});

export const updateAppointmentSchema = Joi.object({
  appointmentDate: Joi.date().min("now").optional(),
  timeSlot: Joi.object({
    start: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
    end: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
  }).optional(),
  reason: Joi.string().max(500).optional(),
  symptoms: Joi.string().max(1000).allow("").optional(),
  status: Joi.string()
    .valid(
      "scheduled",
      "confirmed",
      "in-progress",
      "completed",
      "cancelled",
      "no-show"
    )
    .optional(),
  priority: Joi.string().valid("low", "normal", "high", "urgent").optional(),
  notes: Joi.string().max(2000).allow("").optional(),
  diagnosis: Joi.string().max(1000).allow("").optional(),
  followUpDate: Joi.date().min("now").optional(),
  consultationFee: Joi.number().min(0).optional(),
});

export const prescriptionSchema = Joi.object({
  medication: Joi.string().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  duration: Joi.string().required(),
  instructions: Joi.string().allow("").optional(),
});

export const addPrescriptionSchema = Joi.object({
  prescription: Joi.array().items(prescriptionSchema).min(1).required(),
});
