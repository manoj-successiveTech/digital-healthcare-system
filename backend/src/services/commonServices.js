import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";

// Email service (placeholder - integrate with actual email service)
export const emailService = {
  sendWelcomeEmail: async (user) => {
    console.log(`Sending welcome email to ${user.email}`);
    // Integrate with SendGrid, Mailgun, or other email service
    return true;
  },

  sendAppointmentConfirmation: async (appointment) => {
    console.log(
      `Sending appointment confirmation for appointment ${appointment._id}`
    );
    // Send confirmation email to both patient and doctor
    return true;
  },

  sendAppointmentReminder: async (appointment) => {
    console.log(
      `Sending appointment reminder for appointment ${appointment._id}`
    );
    // Send reminder email 24 hours before appointment
    return true;
  },

  sendPasswordResetEmail: async (user, resetToken) => {
    console.log(`Sending password reset email to ${user.email}`);
    // Send password reset email with token
    return true;
  },
};

// Notification service
export const notificationService = {
  sendPushNotification: async (userId, message, type = "info") => {
    console.log(`Sending notification to user ${userId}: ${message}`);
    // Integrate with Firebase Cloud Messaging or other push service
    return true;
  },

  sendAppointmentNotification: async (appointment, type) => {
    const messages = {
      created: "Your appointment has been scheduled",
      updated: "Your appointment has been updated",
      cancelled: "Your appointment has been cancelled",
      reminder: "Appointment reminder: You have an appointment tomorrow",
    };

    await this.sendPushNotification(
      appointment.patient,
      messages[type],
      "appointment"
    );

    if (type === "created" || type === "updated") {
      await this.sendPushNotification(
        appointment.doctor,
        `New patient appointment: ${messages[type]}`,
        "appointment"
      );
    }
  },
};

// Analytics service
export const analyticsService = {
  trackUserAction: (userId, action, data = {}) => {
    console.log(`User ${userId} performed action: ${action}`, data);
    // Track user actions for analytics
  },

  getDashboardAnalytics: async (userType, userId = null) => {
    const analytics = {};

    if (userType === "admin") {
      analytics.totalUsers = await User.countDocuments({ isActive: true });
      analytics.totalAppointments = await Appointment.countDocuments();
      analytics.totalRecords = await MedicalRecord.countDocuments();

      // Get user growth data
      const userGrowth = await User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      analytics.userGrowth = userGrowth;
    }

    return analytics;
  },
};

// Appointment service
export const appointmentService = {
  checkConflicts: async (doctorId, date, timeSlot) => {
    const conflicts = await Appointment.find({
      doctor: doctorId,
      appointmentDate: date,
      "timeSlot.start": timeSlot.start,
      status: { $in: ["scheduled", "confirmed"] },
    });

    return conflicts.length > 0;
  },

  generateTimeSlots: (startHour = 9, endHour = 17, slotDuration = 30) => {
    const slots = [];
    let currentTime = startHour * 60; // Convert to minutes
    const endTime = endHour * 60;

    while (currentTime < endTime) {
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      const start = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      currentTime += slotDuration;

      const endHours = Math.floor(currentTime / 60);
      const endMinutes = currentTime % 60;
      const end = `${endHours.toString().padStart(2, "0")}:${endMinutes
        .toString()
        .padStart(2, "0")}`;

      slots.push({ start, end });
    }

    return slots;
  },

  getAvailableSlots: async (doctorId, date) => {
    const allSlots = this.generateTimeSlots();
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: date,
      status: { $in: ["scheduled", "confirmed"] },
    }).select("timeSlot.start");

    const bookedTimes = bookedAppointments.map((apt) => apt.timeSlot.start);
    return allSlots.filter((slot) => !bookedTimes.includes(slot.start));
  },
};

// File service
export const fileService = {
  deleteFile: (filePath) => {
    const fs = require("fs");
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  },

  getFileSize: (filePath) => {
    const fs = require("fs");
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  },

  isValidImageType: (mimetype) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    return validTypes.includes(mimetype);
  },

  isValidDocumentType: (mimetype) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    return validTypes.includes(mimetype);
  },
};
