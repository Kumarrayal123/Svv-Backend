const Appointment = require("../models/Appointment");

// @desc    Create / Book a new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res, next) => {
  try {
    const { name, mobile, doctor, date, time, reason } = req.body;

    if (!name || !mobile || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, mobile, date, time",
      });
    }

    // Clean mobile number
    const cleanMobile = mobile.toString().replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit mobile number",
      });
    }

    const appointment = await Appointment.create({
      name: name.trim(),
      mobile: cleanMobile,
      doctor: doctor?.trim() || "Any Available Doctor",
      date,
      time,
      reason: reason?.trim() || "",
      status: "pending",
      source: "website",
    });

    res.status(201).json({
      success: true,
      message: "Appointment request submitted successfully. The clinic will call you to confirm.",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (supports filtering, sorting, pagination)
// @route   GET /api/appointments
// @access  Public / Staff / Admin
const getAppointments = async (req, res, next) => {
  try {
    const { status, date, doctor, mobile, limit = 50, page = 1 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (date) filter.date = date;
    if (doctor) filter.doctor = new RegExp(doctor, "i");
    if (mobile) filter.mobile = new RegExp(mobile);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Appointment.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Public / Staff
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status / notes
// @route   PATCH /api/appointments/:id/status
// @access  Staff / Admin
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const updateFields = {};
    if (status) {
      const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }
      updateFields.status = status;
    }

    if (typeof notes === "string") {
      updateFields.notes = notes;
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Staff / Admin
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments summary statistics
// @route   GET /api/appointments/stats
// @access  Staff / Admin
const getAppointmentStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [total, pending, confirmed, completed, cancelled, todayCount] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "confirmed" }),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.countDocuments({ status: "cancelled" }),
      Appointment.countDocuments({ date: today }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        confirmed,
        completed,
        cancelled,
        todayCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentStats,
};
