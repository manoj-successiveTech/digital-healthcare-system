import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// @desc    Get dashboard data for user
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const userType = req.user.userType;

  let dashboardData = {};

  if (userType === "patient") {
    // Patient dashboard data
    const upcomingAppointments = await Appointment.find({
      patient: userId,
      appointmentDate: { $gte: new Date() },
      status: { $in: ["scheduled", "confirmed"] },
    })
      .populate("doctor", "firstName lastName department specialization")
      .sort({ appointmentDate: 1 })
      .limit(5);

    const recentMedicalRecords = await MedicalRecord.find({
      patient: userId,
    })
      .populate("doctor", "firstName lastName department")
      .sort({ visitDate: -1 })
      .limit(5);

    const appointmentStats = await Appointment.aggregate([
      { $match: { patient: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    dashboardData = {
      userType: "patient",
      upcomingAppointments,
      recentMedicalRecords,
      appointmentStats,
      totalAppointments: await Appointment.countDocuments({ patient: userId }),
      totalMedicalRecords: await MedicalRecord.countDocuments({
        patient: userId,
      }),
    };
  } else if (userType === "doctor") {
    // Doctor dashboard data
    const todayAppointments = await Appointment.find({
      doctor: userId,
      appointmentDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
    })
      .populate("patient", "firstName lastName phoneNumber")
      .sort({ "timeSlot.start": 1 });

    const upcomingAppointments = await Appointment.find({
      doctor: userId,
      appointmentDate: { $gt: new Date().setHours(23, 59, 59, 999) },
      status: { $in: ["scheduled", "confirmed"] },
    })
      .populate("patient", "firstName lastName phoneNumber")
      .sort({ appointmentDate: 1 })
      .limit(10);

    const recentMedicalRecords = await MedicalRecord.find({
      doctor: userId,
    })
      .populate("patient", "firstName lastName")
      .sort({ visitDate: -1 })
      .limit(5);

    const patientStats = await Appointment.aggregate([
      { $match: { doctor: userId } },
      { $group: { _id: "$patient" } },
      { $count: "totalPatients" },
    ]);

    const appointmentStats = await Appointment.aggregate([
      { $match: { doctor: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    dashboardData = {
      userType: "doctor",
      todayAppointments,
      upcomingAppointments,
      recentMedicalRecords,
      appointmentStats,
      totalPatients:
        patientStats.length > 0 ? patientStats[0].totalPatients : 0,
      totalAppointments: await Appointment.countDocuments({ doctor: userId }),
      totalMedicalRecords: await MedicalRecord.countDocuments({
        doctor: userId,
      }),
    };
  } else if (userType === "admin") {
    // Admin dashboard data
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalDoctors = await User.countDocuments({
      userType: "doctor",
      isActive: true,
    });
    const totalPatients = await User.countDocuments({
      userType: "patient",
      isActive: true,
    });
    const totalAppointments = await Appointment.countDocuments();
    const totalMedicalRecords = await MedicalRecord.countDocuments();

    const todayAppointments = await Appointment.countDocuments({
      appointmentDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
    });

    const appointmentsByStatus = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const recentUsers = await User.find({ isActive: true })
      .select("firstName lastName userType createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    dashboardData = {
      userType: "admin",
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalMedicalRecords,
      todayAppointments,
      appointmentsByStatus,
      recentUsers,
    };
  }

  res.json({
    success: true,
    data: dashboardData,
  });
});

// @desc    Get user statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const userType = req.user.userType;

  let stats = {};

  if (userType === "patient") {
    const totalAppointments = await Appointment.countDocuments({
      patient: userId,
    });
    const completedAppointments = await Appointment.countDocuments({
      patient: userId,
      status: "completed",
    });
    const upcomingAppointments = await Appointment.countDocuments({
      patient: userId,
      appointmentDate: { $gte: new Date() },
      status: { $in: ["scheduled", "confirmed"] },
    });

    stats = {
      totalAppointments,
      completedAppointments,
      upcomingAppointments,
      totalMedicalRecords: await MedicalRecord.countDocuments({
        patient: userId,
      }),
    };
  } else if (userType === "doctor") {
    const totalAppointments = await Appointment.countDocuments({
      doctor: userId,
    });
    const completedAppointments = await Appointment.countDocuments({
      doctor: userId,
      status: "completed",
    });
    const todayAppointments = await Appointment.countDocuments({
      doctor: userId,
      appointmentDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
    });

    const uniquePatients = await Appointment.aggregate([
      { $match: { doctor: userId } },
      { $group: { _id: "$patient" } },
      { $count: "totalPatients" },
    ]);

    stats = {
      totalAppointments,
      completedAppointments,
      todayAppointments,
      totalPatients:
        uniquePatients.length > 0 ? uniquePatients[0].totalPatients : 0,
      totalMedicalRecords: await MedicalRecord.countDocuments({
        doctor: userId,
      }),
    };
  }

  res.json({
    success: true,
    stats,
  });
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
export const getRecentActivities = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const userType = req.user.userType;
  const { limit = 10 } = req.query;

  let activities = [];

  if (userType === "patient") {
    // Get recent appointments and medical records
    const recentAppointments = await Appointment.find({ patient: userId })
      .populate("doctor", "firstName lastName department")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2);

    const recentMedicalRecords = await MedicalRecord.find({ patient: userId })
      .populate("doctor", "firstName lastName department")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2);

    // Format activities
    recentAppointments.forEach((apt) => {
      activities.push({
        type: "appointment",
        action: `Appointment ${apt.status}`,
        description: `${apt.reason} with Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`,
        date: apt.createdAt,
        status: apt.status,
      });
    });

    recentMedicalRecords.forEach((record) => {
      activities.push({
        type: "medical_record",
        action: "Medical record created",
        description: `Visit for ${record.chiefComplaint}`,
        date: record.createdAt,
        status: record.status,
      });
    });
  } else if (userType === "doctor") {
    // Get recent appointments and medical records created by doctor
    const recentAppointments = await Appointment.find({ doctor: userId })
      .populate("patient", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2);

    const recentMedicalRecords = await MedicalRecord.find({ doctor: userId })
      .populate("patient", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2);

    // Format activities
    recentAppointments.forEach((apt) => {
      activities.push({
        type: "appointment",
        action: `Appointment ${apt.status}`,
        description: `${apt.reason} with ${apt.patient.firstName} ${apt.patient.lastName}`,
        date: apt.createdAt,
        status: apt.status,
      });
    });

    recentMedicalRecords.forEach((record) => {
      activities.push({
        type: "medical_record",
        action: "Medical record created",
        description: `Created record for ${record.patient.firstName} ${record.patient.lastName}`,
        date: record.createdAt,
        status: record.status,
      });
    });
  }

  // Sort activities by date and limit
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  activities = activities.slice(0, parseInt(limit));

  res.json({
    success: true,
    activities,
  });
});
