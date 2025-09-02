import express from "express";
import {
  authenticateToken,
  authorizeRoles,
  validateUser,
} from "../middlewares/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get dashboard stats for patients
router.get(
  "/patient/stats",
  authenticateToken,
  authorizeRoles("patient"),
  validateUser,
  async (req, res) => {
    try {
      const userId = req.user.userId;

      // In a real application, you would fetch actual data from relevant collections
      // For now, returning mock structure ready for real data
      const stats = {
        upcomingAppointments: 0,
        medicalRecords: 0,
        prescriptions: 0,
        testResults: 0,
      };

      const upcomingAppointments = [];
      const recentActivity = [];

      res.json({
        success: true,
        data: {
          stats,
          upcomingAppointments,
          recentActivity,
          user: req.userProfile,
        },
      });
    } catch (error) {
      console.error("Patient dashboard error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching patient dashboard data",
      });
    }
  }
);

// Get dashboard stats for doctors
router.get(
  "/doctor/stats",
  authenticateToken,
  authorizeRoles("doctor"),
  validateUser,
  async (req, res) => {
    try {
      const userId = req.user.userId;

      const stats = {
        todayAppointments: 0,
        totalPatients: 0,
        pendingReviews: 0,
        consultations: 0,
      };

      const todayAppointments = [];
      const recentPatients = [];
      const pendingTasks = [];

      res.json({
        success: true,
        data: {
          stats,
          todayAppointments,
          recentPatients,
          pendingTasks,
          user: req.userProfile,
        },
      });
    } catch (error) {
      console.error("Doctor dashboard error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching doctor dashboard data",
      });
    }
  }
);

// Get dashboard stats for admins
router.get(
  "/admin/stats",
  authenticateToken,
  authorizeRoles("admin"),
  validateUser,
  async (req, res) => {
    try {
      // Get actual user counts from database
      const totalUsers = await User.countDocuments();
      const totalDoctors = await User.countDocuments({ userType: "doctor" });
      const totalPatients = await User.countDocuments({ userType: "patient" });
      const totalAdmins = await User.countDocuments({ userType: "admin" });

      const stats = {
        totalUsers,
        activeDoctors: totalDoctors,
        totalPatients,
        appointmentsToday: 0, // This would come from appointments collection
      };

      // Get recent users (last 10)
      const recentUsers = await User.find()
        .select("firstName lastName email userType createdAt isActive")
        .sort({ createdAt: -1 })
        .limit(10);

      const systemAlerts = [];

      const systemMetrics = {
        serverUptime: "99.9%",
        databasePerformance: "95%",
        apiResponseTime: "120ms",
        storageUsage: "45%",
      };

      res.json({
        success: true,
        data: {
          stats,
          recentUsers,
          systemAlerts,
          systemMetrics,
          user: req.userProfile,
        },
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching admin dashboard data",
      });
    }
  }
);

// Update user profile
router.put("/profile", authenticateToken, validateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, phoneNumber, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phoneNumber,
        address,
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
});

// Get user profile
router.get("/profile", authenticateToken, validateUser, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.userProfile,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
});

// Admin: Get all users with pagination
router.get(
  "/admin/users",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalUsers = await User.countDocuments();
      const totalPages = Math.ceil(totalUsers / limit);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: page,
            totalPages,
            totalUsers,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      console.error("Users fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching users",
      });
    }
  }
);

// Admin: Update user status
router.patch(
  "/admin/users/:userId/status",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        user,
      });
    } catch (error) {
      console.error("User status update error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating user status",
      });
    }
  }
);

export default router;
