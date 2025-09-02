import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    userType: {
      type: String,
      required: true,
      enum: ["patient", "doctor", "admin"],
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"],
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      zipCode: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
    },
    // Doctor-specific fields
    department: {
      type: String,
      required: function () {
        return this.userType === "doctor";
      },
      trim: true,
      enum: [
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
        "Family Medicine",
      ],
    },
    specialization: {
      type: String,
      required: false, // Make optional for registration
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: false, // Make optional for registration
      trim: true,
      unique: true,
      sparse: true, // Allows null values but enforces uniqueness when present
    },
    // Patient-specific fields
    emergencyContact: {
      name: {
        type: String,
        required: false, // Make optional for registration
        trim: true,
      },
      phone: {
        type: String,
        required: false, // Make optional for registration
        trim: true,
      },
      relationship: {
        type: String,
        required: false, // Make optional for registration
        trim: true,
      },
    },
    // Common fields
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster queries (removed duplicate email index)
userSchema.index({ userType: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialised
userSchema.set("toJSON", {
  virtuals: true,
});

// Pre-save middleware to ensure consistent data
userSchema.pre("save", function (next) {
  // Ensure userType is lowercase
  if (this.userType) {
    this.userType = this.userType.toLowerCase();
  }

  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }

  next();
});

export default mongoose.model("User", userSchema);
