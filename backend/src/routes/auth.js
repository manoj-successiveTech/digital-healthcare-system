import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Register route
router.post("/register", async (req, res) => {
  try {
    console.log("Registration request received:", req.body);

    const {
      firstName,
      lastName,
      email,
      password,
      userType,
      department,
      phoneNumber,
      dateOfBirth,
      address,
    } = req.body;

    console.log("Extracted data:", {
      firstName,
      lastName,
      email,
      userType,
      department,
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const saltRounds = 10;  // You can adjust the salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Increased salt rounds for better security
    console.log("Password hashed successfully");

    // Create new user
    const newUserData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      phoneNumber,
      dateOfBirth,
      address,
    };

    // Add department field for doctors
    if (userType === "doctor" && department) {
      newUserData.department = department;
    }

    const newUser = new User(newUserData);
    console.log("User object created:", newUser);

    await newUser.save();
    console.log("User saved successfully:", newUser._id);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        userType: newUser.userType,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data (without password) and token
    const userData = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      userType: newUser.userType,
      phoneNumber: newUser.phoneNumber,
      dateOfBirth: newUser.dateOfBirth,
      address: newUser.address,
    };

    // Add department for doctors
    if (newUser.userType === "doctor" && newUser.department) {
      userData.department = newUser.department;
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    // Check if it's a duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user type matches
    if (user.userType !== userType) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type selected",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.userType,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data (without password) and token
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
    };

    res.json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// Middleware to verify JWT token
// (moved to middleware/auth.js)

// Protected route to get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Logout route (client-side token removal)
router.post("/logout", (req, res) => {
  // In a stateless JWT setup, logout is handled client-side by removing the token
  res.json({
    success: true,
    message: "Logout successful",
  });
});

// Debug route to check users in database
router.get("/debug/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      count: users.length,
      users: users,
    });
  } catch (error) {
    console.error("Debug users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
});

export default router;
