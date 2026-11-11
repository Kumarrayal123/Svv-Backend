const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentStats,
} = require("../controllers/appointmentController");

// Proxy: TimelyHealth appointment slots (bypasses CORS for localhost:8080)
router.get("/slots/:doctorId", async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    const url = `https://api.timelyhealth.in/api/appointment-slots/doctorslots/${doctorId}${date ? `?date=${date}` : ""}`;
    const response = await fetch(url, { headers: { accept: "application/json" } });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
});

// Public endpoints
router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/stats", getAppointmentStats);
router.get("/:id", getAppointmentById);

// Staff / Admin update and delete endpoints
router.patch("/:id/status", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);

module.exports = router;
