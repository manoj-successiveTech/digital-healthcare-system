import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "../validation/appointmentValidation.js";

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const createAppointment = asyncHandler(async (req, res) => {
  const { error } = createAppointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
    });
  }

  const {
    doctor,
    appointmentDate,
    timeSlot,
    reason,
    symptoms,
    priority,
    isEmergency,
  } = req.body;

  // Verify doctor exists and is active
  const doctorUser = await User.findById(doctor);
  if (!doctorUser || doctorUser.userType !== "doctor" || !doctorUser.isActive) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found or inactive",
    });
  }

  // Check if doctor is available at the requested time
  const existingAppointment = await Appointment.findOne({
    doctor,
    appointmentDate: {
      $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
      $lt: new Date(appointmentDate).setHours(23, 59, 59, 999),
    },
    "timeSlot.start": timeSlot.start,
    status: { $in: ["scheduled", "confirmed"] },
  });

  if (existingAppointment) {
    return res.status(400).json({
      success: false,
      message: "Doctor is not available at the requested time",
    });
  }

  // Create appointment
  const appointment = await Appointment.create({
    patient: req.user.userId,
    doctor,
    appointmentDate,
    timeSlot,
    reason,
    symptoms,
    priority,
    isEmergency,
  });

  // Populate doctor and patient details
  await appointment.populate([
    { path: "doctor", select: "firstName lastName department specialization" },
    { path: "patient", select: "firstName lastName email phoneNumber" },
  ]);

  res.status(201).json({
    success: true,
    message: "Appointment created successfully",
    appointment,
  });
});

// @desc    Get all appointments for user
// @route   GET /api/appointments
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
  const { status, date, page = 1, limit = 10 } = req.query;

  let query = {};

  // Filter by user role
  if (req.user.userType === "patient") {
    query.patient = req.user.userId;
  } else if (req.user.userType === "doctor") {
    query.doctor = req.user.userId;
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by date
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    query.appointmentDate = { $gte: startDate, $lte: endDate };
  }

  const skip = (page - 1) * limit;

  const appointments = await Appointment.find(query)
    .populate("doctor", "firstName lastName department specialization")
    .populate("patient", "firstName lastName email phoneNumber")
    .sort({ appointmentDate: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Appointment.countDocuments(query);

  res.json({
    success: true,
    appointments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate(
      "doctor",
      "firstName lastName department specialization email phoneNumber"
    )
    .populate(
      "patient",
      "firstName lastName email phoneNumber dateOfBirth address"
    );

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  // Check if user has access to this appointment
  const hasAccess =
    appointment.patient._id.toString() === req.user.userId ||
    appointment.doctor._id.toString() === req.user.userId ||
    req.user.userType === "admin";

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  res.json({
    success: true,
    appointment,
  });
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(async (req, res) => {
  const { error } = updateAppointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
    });
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  // Check permissions
  const canUpdate =
    appointment.patient.toString() === req.user.userId ||
    appointment.doctor.toString() === req.user.userId ||
    req.user.userType === "admin";

  if (!canUpdate) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  // Patients can only update certain fields
  if (req.user.userType === "patient") {
    const allowedFields = ["reason", "symptoms"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    Object.assign(appointment, updates);
  } else {
    // Doctors can update more fields
    Object.assign(appointment, req.body);
  }

  await appointment.save();

  await appointment.populate([
    { path: "doctor", select: "firstName lastName department specialization" },
    { path: "patient", select: "firstName lastName email phoneNumber" },
  ]);

  res.json({
    success: true,
    message: "Appointment updated successfully",
    appointment,
  });
});

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  // Check permissions
  const canCancel =
    appointment.patient.toString() === req.user.userId ||
    appointment.doctor.toString() === req.user.userId ||
    req.user.userType === "admin";

  if (!canCancel) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  // Check if appointment can be cancelled
  if (!appointment.canBeCancelled()) {
    return res.status(400).json({
      success: false,
      message:
        "Appointment cannot be cancelled (less than 24 hours notice or already completed)",
    });
  }

  appointment.status = "cancelled";
  await appointment.save();

  res.json({
    success: true,
    message: "Appointment cancelled successfully",
  });
});

// @desc    Get available time slots for a doctor
// @route   GET /api/appointments/available-slots/:doctorId
// @access  Private
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Date is required",
    });
  }

  // Verify doctor exists
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.userType !== "doctor") {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }

  // Get existing appointments for the date
  const existingAppointments = await Appointment.find({
    doctor: doctorId,
    appointmentDate: {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lt: new Date(date).setHours(23, 59, 59, 999),
    },
    status: { $in: ["scheduled", "confirmed"] },
  }).select("timeSlot");

  // Define working hours (can be made configurable)
  const workingHours = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  // Filter out booked slots
  const bookedSlots = existingAppointments.map((apt) => apt.timeSlot.start);
  const availableSlots = workingHours.filter(
    (slot) => !bookedSlots.includes(slot)
  );

  res.json({
    success: true,
    availableSlots,
    date,
  });
});

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats
// @access  Private (Doctor/Admin)
export const getAppointmentStats = asyncHandler(async (req, res) => {
  let matchStage = {};

  if (req.user.userType === "doctor") {
    matchStage.doctor = req.user.userId;
  }

  const stats = await Appointment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const endOfToday = new Date(today.setHours(23, 59, 59, 999));

  const todayAppointments = await Appointment.countDocuments({
    ...matchStage,
    appointmentDate: { $gte: startOfToday, $lte: endOfToday },
  });

  res.json({
    success: true,
    stats,
    todayAppointments,
  });
});
