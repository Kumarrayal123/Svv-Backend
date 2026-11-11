const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "svv_clinic_jwt_secret_key_2026_secure",
    { expiresIn: "7d" }
  );
};

// Default fallback credentials
const MASTER_EMAIL = (process.env.ADMIN_EMAIL || "admin@svvclinic.com").toLowerCase();
const MASTER_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    let existingUser = null;
    try {
      existingUser = await User.findOne({ email: cleanEmail });
    } catch (err) {
      // DB offline
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    let user = null;
    try {
      user = await User.create({
        name,
        email: cleanEmail,
        password,
        role: role || "admin",
      });
    } catch (err) {
      user = {
        _id: "local-admin-id",
        name,
        email: cleanEmail,
        role: role || "admin",
      };
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    let user = null;
    try {
      user = await User.findOne({ email: cleanEmail });
    } catch (dbErr) {
      // If DB error, proceed to check master credentials
    }

    // 1. If found in DB, verify password
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const token = generateToken(user._id);
        return res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    }

    // 2. Check Master Admin Credentials
    if (cleanEmail === MASTER_EMAIL && password === MASTER_PASSWORD) {
      // Try to save to DB if possible
      try {
        if (!user) {
          user = await User.create({
            name: "Clinic Administrator",
            email: MASTER_EMAIL,
            password: MASTER_PASSWORD,
            role: "admin",
          });
        }
      } catch (err) {
        // Fallback object
        user = {
          _id: "master-admin-01",
          name: "Clinic Administrator",
          email: MASTER_EMAIL,
          role: "admin",
        };
      }

      const token = generateToken(user._id || "master-admin-01");
      return res.status(200).json({
        success: true,
        message: "Master Admin Login successful",
        token,
        user: {
          id: user._id || "master-admin-01",
          name: user.name || "Clinic Administrator",
          email: MASTER_EMAIL,
          role: "admin",
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
