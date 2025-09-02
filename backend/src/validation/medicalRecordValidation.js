import Joi from "joi";

// Medical Record validation schemas
export const createMedicalRecordSchema = Joi.object({
  patient: Joi.string().hex().length(24).required(),
  appointment: Joi.string().hex().length(24).optional(),
  visitDate: Joi.date().max("now").optional(),
  chiefComplaint: Joi.string().max(500).required(),
  symptoms: Joi.array()
    .items(
      Joi.object({
        symptom: Joi.string().required(),
        severity: Joi.string().valid("mild", "moderate", "severe").optional(),
        duration: Joi.string().required(),
      })
    )
    .optional(),
  vitalSigns: Joi.object({
    bloodPressure: Joi.object({
      systolic: Joi.number().min(50).max(300).optional(),
      diastolic: Joi.number().min(30).max(200).optional(),
    }).optional(),
    heartRate: Joi.number().min(30).max(250).optional(),
    temperature: Joi.number().min(90).max(110).optional(),
    weight: Joi.number().min(1).max(500).optional(),
    height: Joi.number().min(30).max(300).optional(),
    respiratoryRate: Joi.number().min(5).max(60).optional(),
    oxygenSaturation: Joi.number().min(70).max(100).optional(),
  }).optional(),
  physicalExamination: Joi.string().max(2000).allow("").optional(),
  diagnosis: Joi.object({
    primary: Joi.string().required(),
    secondary: Joi.array().items(Joi.string()).optional(),
    icdCodes: Joi.array()
      .items(
        Joi.object({
          code: Joi.string().optional(),
          description: Joi.string().optional(),
        })
      )
      .optional(),
  }).required(),
  treatment: Joi.object({
    medications: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          dosage: Joi.string().required(),
          frequency: Joi.string().required(),
          duration: Joi.string().required(),
          instructions: Joi.string().allow("").optional(),
        })
      )
      .optional(),
    procedures: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          description: Joi.string().allow("").optional(),
          date: Joi.date().optional(),
        })
      )
      .optional(),
    recommendations: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  labResults: Joi.array()
    .items(
      Joi.object({
        testName: Joi.string().required(),
        result: Joi.string().required(),
        referenceRange: Joi.string().allow("").optional(),
        unit: Joi.string().allow("").optional(),
        status: Joi.string().valid("normal", "abnormal", "critical").optional(),
        testDate: Joi.date().optional(),
      })
    )
    .optional(),
  followUpInstructions: Joi.string().max(1000).allow("").optional(),
  nextAppointment: Joi.object({
    recommendedDate: Joi.date().min("now").optional(),
    reason: Joi.string().allow("").optional(),
  }).optional(),
  allergies: Joi.array()
    .items(
      Joi.object({
        allergen: Joi.string().required(),
        reaction: Joi.string().allow("").optional(),
        severity: Joi.string().valid("mild", "moderate", "severe").optional(),
      })
    )
    .optional(),
  isConfidential: Joi.boolean().optional(),
});

export const updateMedicalRecordSchema = Joi.object({
  chiefComplaint: Joi.string().max(500).optional(),
  symptoms: Joi.array()
    .items(
      Joi.object({
        symptom: Joi.string().required(),
        severity: Joi.string().valid("mild", "moderate", "severe").optional(),
        duration: Joi.string().required(),
      })
    )
    .optional(),
  vitalSigns: Joi.object({
    bloodPressure: Joi.object({
      systolic: Joi.number().min(50).max(300).optional(),
      diastolic: Joi.number().min(30).max(200).optional(),
    }).optional(),
    heartRate: Joi.number().min(30).max(250).optional(),
    temperature: Joi.number().min(90).max(110).optional(),
    weight: Joi.number().min(1).max(500).optional(),
    height: Joi.number().min(30).max(300).optional(),
    respiratoryRate: Joi.number().min(5).max(60).optional(),
    oxygenSaturation: Joi.number().min(70).max(100).optional(),
  }).optional(),
  physicalExamination: Joi.string().max(2000).allow("").optional(),
  diagnosis: Joi.object({
    primary: Joi.string().optional(),
    secondary: Joi.array().items(Joi.string()).optional(),
    icdCodes: Joi.array()
      .items(
        Joi.object({
          code: Joi.string().optional(),
          description: Joi.string().optional(),
        })
      )
      .optional(),
  }).optional(),
  treatment: Joi.object({
    medications: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          dosage: Joi.string().required(),
          frequency: Joi.string().required(),
          duration: Joi.string().required(),
          instructions: Joi.string().allow("").optional(),
        })
      )
      .optional(),
    procedures: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          description: Joi.string().allow("").optional(),
          date: Joi.date().optional(),
        })
      )
      .optional(),
    recommendations: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  labResults: Joi.array()
    .items(
      Joi.object({
        testName: Joi.string().required(),
        result: Joi.string().required(),
        referenceRange: Joi.string().allow("").optional(),
        unit: Joi.string().allow("").optional(),
        status: Joi.string().valid("normal", "abnormal", "critical").optional(),
        testDate: Joi.date().optional(),
      })
    )
    .optional(),
  followUpInstructions: Joi.string().max(1000).allow("").optional(),
  nextAppointment: Joi.object({
    recommendedDate: Joi.date().min("now").optional(),
    reason: Joi.string().allow("").optional(),
  }).optional(),
  allergies: Joi.array()
    .items(
      Joi.object({
        allergen: Joi.string().required(),
        reaction: Joi.string().allow("").optional(),
        severity: Joi.string().valid("mild", "moderate", "severe").optional(),
      })
    )
    .optional(),
  isConfidential: Joi.boolean().optional(),
  status: Joi.string()
    .valid("draft", "completed", "reviewed", "archived")
    .optional(),
});
