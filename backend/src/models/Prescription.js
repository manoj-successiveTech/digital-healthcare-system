import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
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
    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
    },
    prescriptionNumber: {
      type: String,
      unique: true,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    medications: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        genericName: {
          type: String,
          trim: true,
        },
        strength: {
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
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        instructions: {
          type: String,
          trim: true,
          maxlength: 500,
        },
        route: {
          type: String,
          enum: [
            "oral",
            "topical",
            "injection",
            "inhalation",
            "sublingual",
            "rectal",
          ],
          default: "oral",
        },
        refills: {
          type: Number,
          default: 0,
          min: 0,
          max: 5,
        },
      },
    ],
    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "expired"],
      default: "active",
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isDispensed: {
      type: Boolean,
      default: false,
    },
    dispensedBy: {
      pharmacyName: String,
      pharmacistName: String,
      dispensedDate: Date,
      batchNumbers: [String],
    },
    warnings: [
      {
        type: String,
        trim: true,
      },
    ],
    interactions: [
      {
        medication: String,
        severity: {
          type: String,
          enum: ["minor", "moderate", "major"],
          default: "minor",
        },
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
prescriptionSchema.index({ patient: 1, issueDate: -1 });
prescriptionSchema.index({ doctor: 1, issueDate: -1 });
prescriptionSchema.index({ prescriptionNumber: 1 });
prescriptionSchema.index({ status: 1 });

// Pre-save middleware to generate prescription number
prescriptionSchema.pre("save", async function (next) {
  if (this.isNew && !this.prescriptionNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      },
    });
    this.prescriptionNumber = `RX${year}${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

// Method to check if prescription is expired
prescriptionSchema.methods.isExpired = function () {
  return new Date() > this.validUntil;
};

// Method to check if prescription can be refilled
prescriptionSchema.methods.canRefill = function () {
  return (
    !this.isExpired() &&
    this.status === "active" &&
    this.medications.some((med) => med.refills > 0)
  );
};

export default mongoose.model("Prescription", prescriptionSchema);
