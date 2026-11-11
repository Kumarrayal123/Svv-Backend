const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"],
    },
    doctor: {
      type: String,
      trim: true,
      default: "Any Available Doctor",
    },
    date: {
      type: String,
      required: [true, "Appointment date is required"],
    },
    time: {
      type: String,
      required: [true, "Appointment time is required"],
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      default: "website",
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ date: 1, time: 1 });
appointmentSchema.index({ mobile: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
