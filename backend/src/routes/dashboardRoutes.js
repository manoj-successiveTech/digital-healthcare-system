import express from "express";
import {
  getDashboardData,
  getUserStats,
  getRecentActivities,
} from "../controllers/dashboardController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Dashboard routes
router.get("/", getDashboardData);
router.get("/stats", getUserStats);
router.get("/activities", getRecentActivities);

export default router;
