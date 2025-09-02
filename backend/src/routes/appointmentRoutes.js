import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots,
  getAppointmentStats,
} from "../controllers/appointmentController.js";
import {
  authenticateToken,
  isPatient,
  isDoctor,
  isDoctorOrAdmin,
} from "../middlewares/auth.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Appointment routes
router.route("/").get(getAppointments).post(isPatient, createAppointment);

router.get("/stats", isDoctorOrAdmin, getAppointmentStats);
router.get("/available-slots/:doctorId", getAvailableSlots);

router
  .route("/:id")
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(cancelAppointment);

export default router;
