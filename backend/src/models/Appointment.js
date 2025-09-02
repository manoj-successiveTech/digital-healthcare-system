import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      start: {
        type: String,
        required: true, // Format: "09:00"
      },
      end: {
        type: String,
        required: true, // Format: "09:30"
      },
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    symptoms: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "scheduled",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    diagnosis: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    prescription: [
      {
        medication: {
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
        instructions: {
          type: String,
          trim: true,
        },
      },
    ],
    followUpDate: {
      type: Date,
    },
    consultationFee: {
      type: Number,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending",
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });

// Virtual for appointment duration
appointmentSchema.virtual("duration").get(function () {
  const start = this.timeSlot.start.split(":");
  const end = this.timeSlot.end.split(":");
  const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
  const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
  return endMinutes - startMinutes;
});

// Method to check if appointment is in the past
appointmentSchema.methods.isPastAppointment = function () {
  return new Date() > this.appointmentDate;
};

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function () {
  const now = new Date();
  const appointmentTime = new Date(this.appointmentDate);
  const timeDiff = appointmentTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  return hoursDiff > 24 && ["scheduled", "confirmed"].includes(this.status);
};

// Pre-save middleware
appointmentSchema.pre("save", function (next) {
  // Ensure appointment date is in the future for new appointments
  if (this.isNew && this.appointmentDate < new Date()) {
    return next(new Error("Appointment date cannot be in the past"));
  }
  next();
});

export default mongoose.model("Appointment", appointmentSchema);
