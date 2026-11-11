require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS configuration
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".lovable.app") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check / API status
app.get(["/", "/api/health"], (req, res) => {
  const dbStates = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    status: "ok",
    clinic: "S.V.V. Clinic API",
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStates[dbState] || "Unknown",
      readyState: dbState,
    },
    endpoints: {
      appointments: "/api/appointments",
      appointmentStats: "/api/appointments/stats",
      doctors: "/api/doctors",
      contacts: "/api/contacts",
      content: "/api/content",
      auth: "/api/auth",
    },
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/auth", authRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 S.V.V. Clinic Backend running on http://localhost:${PORT}`);
  console.log(`📌 Health check available at http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
});

module.exports = { app, server };
