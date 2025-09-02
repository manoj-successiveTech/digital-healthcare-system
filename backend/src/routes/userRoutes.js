import express from "express";
import User from "../models/User.js";
import { authenticateToken, isDoctor, isAdmin } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Private
router.get(
  "/doctors",
  asyncHandler(async (req, res) => {
    const { department, page = 1, limit = 10, search } = req.query;

    let query = { userType: "doctor", isActive: true };

    if (department) {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const doctors = await User.find(query)
      .select("-password")
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      doctors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);

// @desc    Get all patients (for doctors and admins)
// @route   GET /api/users/patients
// @access  Private (Doctor/Admin)
router.get(
  "/patients",
  isDoctor,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;

    let query = { userType: "patient", isActive: true };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const patients = await User.find(query)
      .select("-password")
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Users can view their own profile, doctors can view patients, admins can view all
    const canView =
      user._id.toString() === req.user.userId ||
      req.user.userType === "admin" ||
      (req.user.userType === "doctor" && user.userType === "patient");

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      user,
    });
  })
);

// @desc    Get departments
// @route   GET /api/users/departments
// @access  Public
router.get(
  "/departments",
  asyncHandler(async (req, res) => {
    const departments = [
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
    ];

    // Get doctor count for each department
    const departmentStats = await User.aggregate([
      { $match: { userType: "doctor", isActive: true } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    const departmentsWithStats = departments.map((dept) => {
      const stat = departmentStats.find((s) => s._id === dept);
      return {
        name: dept,
        doctorCount: stat ? stat.count : 0,
      };
    });

    res.json({
      success: true,
      departments: departmentsWithStats,
    });
  })
);

// @desc    Deactivate user (Admin only)
// @route   PUT /api/users/:id/deactivate
// @access  Private (Admin)
router.put(
  "/:id/deactivate",
  isAdmin,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: "User deactivated successfully",
    });
  })
);

// @desc    Activate user (Admin only)
// @route   PUT /api/users/:id/activate
// @access  Private (Admin)
router.put(
  "/:id/activate",
  isAdmin,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = true;
    await user.save();

    res.json({
      success: true,
      message: "User activated successfully",
    });
  })
);

export default router;
