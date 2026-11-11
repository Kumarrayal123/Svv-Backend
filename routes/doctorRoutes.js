const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getDoctors);

// Proxy routes for Timely Health doctors API to bypass browser CORS
router.get("/timely", async (req, res, next) => {
  try {
    const response = await fetch("https://api.timelyhealth.in/api/doctors/getalldoctors", {
      headers: { accept: "application/json" },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/getalldoctors", async (req, res, next) => {
  try {
    const response = await fetch("https://api.timelyhealth.in/api/doctors/getalldoctors", {
      headers: { accept: "application/json" },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", getDoctorById);
router.post("/", protect, authorize("admin"), createDoctor);
router.put("/:id", protect, authorize("admin"), updateDoctor);
router.delete("/:id", protect, authorize("admin"), deleteDoctor);

module.exports = router;
