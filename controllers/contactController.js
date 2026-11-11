const Contact = require("../models/Contact");

// @desc    Submit contact message
// @route   POST /api/contacts
// @access  Public
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Name and message are required",
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email?.trim() || "",
      mobile: mobile?.trim() || "",
      subject: subject?.trim() || "General Inquiry",
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Message received. We will get back to you soon.",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Staff / Admin
const getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message status
// @route   PATCH /api/contacts/:id/status
// @access  Staff / Admin
const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  updateMessageStatus,
};
