require("dotenv").config();
const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");

const doctors = [
  {
    doctorId: "dr-s-karunakar",
    name: "Dr. S. Karunakar",
    designation: "General Physician",
    department: "General Medicine",
    qualification: "MBBS, MD (Internal Medicine)",
    specialization: "General Medicine & Chronic Care",
    experience: "15+ Years Experience",
    availability: "Mon - Sat  10:00 AM – 5:00 PM",
    bio: "Expert in preventive healthcare, general medicine, and lifestyle management. Focused on holistic and patient-centered care.",
    focusAreas: ["Preventive Care", "Lifestyle Guidance", "Health Checkups"],
    active: true,
  },
  {
    doctorId: "dr-abhigna-jupaka",
    name: "Dr. Abhigna Jupaka",
    designation: "Family Physician",
    department: "Family Health",
    qualification: "MBBS, DNB (Family Medicine)",
    specialization: "Family Health & Preventive Care",
    experience: "8+ Years Experience",
    availability: "Mon - Sat  10:00 AM – 5:00 PM",
    bio: "Specializing in patient-centered primary care, preventive screenings, women's health, and lifestyle counseling. Focused on holistic and compassionate family healthcare.",
    focusAreas: ["Preventive Care", "Lifestyle Guidance", "Women's Health"],
    active: true,
  },
  {
    doctorId: "dr-vamshi-krishna",
    name: "Dr. Vamshi Krishna",
    designation: "Consultant Specialist & Surgeon",
    department: "General Surgery",
    qualification: "MBBS, MS, MCh",
    specialization: "Specialist Consultations & Surgical Assessments",
    experience: "12+ Years Experience",
    availability: "Mon - Sat  10:00 AM – 5:00 PM",
    bio: "Providing comprehensive specialist consultations, surgical assessments, wound care, and advanced therapeutic guidance for complex conditions.",
    focusAreas: ["Surgical Guidance", "Pre/Post-Op Care", "Clinical Evaluations"],
    active: true,
  },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("Please define MONGODB_URI in .env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected successfully!");

    console.log("Clearing existing doctors...");
    await Doctor.deleteMany({});

    console.log("Inserting clinic doctors...");
    await Doctor.insertMany(doctors);

    console.log("Doctors seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seed();
