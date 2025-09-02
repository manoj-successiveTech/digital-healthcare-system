import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    visitDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    chiefComplaint: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    symptoms: [
      {
        symptom: {
          type: String,
          required: true,
        },
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
          default: "moderate",
        },
        duration: {
          type: String,
          required: true,
        },
      },
    ],
    vitalSigns: {
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
      },
      heartRate: Number,
      temperature: Number,
      weight: Number,
      height: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number,
    },
    physicalExamination: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    diagnosis: {
      primary: {
        type: String,
        required: true,
        trim: true,
      },
      secondary: [
        {
          type: String,
          trim: true,
        },
      ],
      icdCodes: [
        {
          code: String,
          description: String,
        },
      ],
    },
    treatment: {
      medications: [
        {
          name: {
            type: String,
            required: true,
          },
          dosage: {
            type: String,
            required: true,
          },
          frequency: {
            type: String,
            required: true,
          },
          duration: {
            type: String,
            required: true,
          },
          instructions: String,
        },
      ],
      procedures: [
        {
          name: {
            type: String,
            required: true,
          },
          description: String,
          date: Date,
        },
      ],
      recommendations: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    labResults: [
      {
        testName: {
          type: String,
          required: true,
        },
        result: {
          type: String,
          required: true,
        },
        referenceRange: String,
        unit: String,
        status: {
          type: String,
          enum: ["normal", "abnormal", "critical"],
          default: "normal",
        },
        testDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [
      {
        filename: String,
        originalName: String,
        path: String,
        type: {
          type: String,
          enum: ["image", "document", "lab-report", "x-ray", "scan"],
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    followUpInstructions: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    nextAppointment: {
      recommendedDate: Date,
      reason: String,
    },
    allergies: [
      {
        allergen: {
          type: String,
          required: true,
        },
        reaction: String,
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
          default: "moderate",
        },
      },
    ],
    isConfidential: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "completed", "reviewed", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
medicalRecordSchema.index({ patient: 1, visitDate: -1 });
medicalRecordSchema.index({ doctor: 1, visitDate: -1 });
medicalRecordSchema.index({ appointment: 1 });
medicalRecordSchema.index({ "diagnosis.primary": 1 });

// Virtual for BMI calculation
medicalRecordSchema.virtual("bmi").get(function () {
  if (this.vitalSigns.weight && this.vitalSigns.height) {
    const heightInMeters = this.vitalSigns.height / 100;
    return (this.vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(
      2
    );
  }
  return null;
});

// Method to check if record is recent
medicalRecordSchema.methods.isRecent = function () {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  return this.visitDate > threeDaysAgo;
};

export default mongoose.model("MedicalRecord", medicalRecordSchema);
