const mongoose = require("mongoose");

const defaultHours = [
  { day: "Monday", time: "9:00 AM – 9:30 PM" },
  { day: "Tuesday", time: "9:00 AM – 9:30 PM" },
  { day: "Wednesday", time: "9:00 AM – 9:30 PM" },
  { day: "Thursday", time: "9:00 AM – 9:30 PM" },
  { day: "Friday", time: "9:00 AM – 9:30 PM" },
  { day: "Saturday", time: "9:00 AM – 9:30 PM" },
  { day: "Sunday", time: "10:00 AM – 6:00 PM" },
];

const defaultServices = [
  {
    id: "general-medicine",
    title: "General Medicine & Health Checkups",
    description: "Treatment for fever, infections, hypertension, diabetes, and comprehensive physical wellness evaluations.",
    tag: "Primary Care",
    icon: "Stethoscope",
  },
  {
    id: "family-health",
    title: "Family Healthcare & Wellness",
    description: "Holistic care for all age groups, preventive screenings, pediatric advice, and lifestyle management.",
    tag: "Family Wellness",
    icon: "HeartPulse",
  },
  {
    id: "surgical-consult",
    title: "Surgical Consultations & Minor Procedures",
    description: "Expert pre/post-operative evaluation, wound dressing, minor surgical procedures, and second opinions.",
    tag: "Specialist Care",
    icon: "Activity",
  },
  {
    id: "chronic-disease",
    title: "Chronic Disease Management",
    description: "Long-term care plans for hypertension, thyroid disorders, asthma, cholesterol, and diabetes.",
    tag: "Chronic Care",
    icon: "ShieldPlus",
  },
  {
    id: "diagnostics",
    title: "Lab Investigations & Diagnostic Guidance",
    description: "Fast referral and clinical evaluation for blood tests, ECG, imaging, and full body health panels.",
    tag: "Diagnostics",
    icon: "ClipboardCheck",
  },
  {
    id: "preventive-counseling",
    title: "Preventive Care & Health Counseling",
    description: "Personalized dietary counseling, immunization advice, stress management, and preventative health plans.",
    tag: "Preventive",
    icon: "Sparkles",
  },
];

const defaultWhyChoose = [
  {
    title: "Experienced Medical Doctors",
    description: "15+ years of combined clinical excellence across internal medicine, family health, and surgery.",
    icon: "Award",
  },
  {
    title: "Patient-Centered Approach",
    description: "Transparent medical advice, unhurried consultations, and detailed explanations of your treatment options.",
    icon: "HeartHandshake",
  },
  {
    title: "Convenient Madhapur Location",
    description: "Easily accessible in Arunodaya Colony, Madhapur with open hours every day of the week.",
    icon: "MapPin",
  },
  {
    title: "Quick Appointment Turnaround",
    description: "Prompt confirmations over call so you never have to wait anxiously for an appointment slot.",
    icon: "Clock",
  },
];

const defaultDoctors = [
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
    image: "/src/assets/dr-karunakar.jpg",
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
    image: "/src/assets/dr-abhigna.jpg",
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
    image: "/src/assets/dr-vamshi.jpg",
  },
];

const siteContentSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      default: "svv-clinic-main",
      unique: true,
    },
    clinicInfo: {
      name: { type: String, default: "S.V.V. Clinic" },
      motto: { type: String, default: "The Right Choices" },
      area: { type: String, default: "Madhapur, Hyderabad" },
      tagline: {
        type: String,
        default: "The Right Choices for Healthcare & Family Wellness",
      },
      phoneDisplay: { type: String, default: "+91 95183 12766" },
      phoneHref: { type: String, default: "tel:+919518312766" },
      address: {
        type: String,
        default:
          "H No: 1, Sri Sai Balaji Avenue, Flat No. 301, 98/9/25/P, Arunodaya Colony, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081",
      },
      hours: {
        type: [
          {
            day: String,
            time: String,
          },
        ],
        default: defaultHours,
      },
      mapsEmbedUrl: {
        type: String,
        default: `https://www.google.com/maps?q=${encodeURIComponent(
          "SVV Poly Clinic, Sri Sai Balaji Avenue, Arunodaya Colony, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081"
        )}&output=embed`,
      },
      directionsUrl: {
        type: String,
        default: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          "SVV Poly Clinic, Sri Sai Balaji Avenue, Arunodaya Colony, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081"
        )}`,
      },
    },
    hero: {
      badge: { type: String, default: "Trusted Healthcare in Madhapur" },
      titleLine1: { type: String, default: "Personalized Medical Care" },
      titleLine2: { type: String, default: "For You & Your Family" },
      description: {
        type: String,
        default:
          "Experienced doctors providing comprehensive primary care, specialist consultations, and diagnostic guidance with empathy and excellence.",
      },
      primaryCta: { type: String, default: "Book Appointment" },
      secondaryCta: { type: String, default: "Call Now" },
      heroImage: { type: String, default: "" },
      careImage: { type: String, default: "" },
      stats: {
        type: [
          {
            value: String,
            label: String,
          },
        ],
        default: [
          { value: "15+", label: "Years Experience" },
          { value: "10k+", label: "Happy Patients" },
          { value: "7 Days", label: "Open Every Week" },
        ],
      },
    },
    about: {
      eyebrow: { type: String, default: "About S.V.V. Clinic" },
      title: {
        type: String,
        default: "Dedicated to Compassionate and Quality Healthcare",
      },
      paragraph1: {
        type: String,
        default:
          "S.V.V. Clinic is an established multi-specialty healthcare facility located in the heart of Madhapur, Hyderabad. We provide primary healthcare, specialist doctor consultations, preventative checkups, and chronic disease management.",
      },
      paragraph2: {
        type: String,
        default:
          "Our clinic is led by seasoned physicians with deep clinical experience who take the time to listen, explain diagnoses thoroughly, and create personalized treatment pathways.",
      },
      experienceYears: { type: String, default: "15+ Years of Care" },
      image: { type: String, default: "" },
      features: {
        type: [String],
        default: [
          "Senior Physicians with 15+ years experience",
          "Comprehensive diagnostics & lifestyle counseling",
          "Open 7 days a week including Sunday consultations",
          "Comfortable, hygienic, patient-first environment",
        ],
      },
    },
    services: {
      type: [
        {
          id: String,
          title: String,
          description: String,
          tag: String,
          icon: String,
        },
      ],
      default: defaultServices,
    },
    whyChooseUs: {
      eyebrow: { type: String, default: "Why Patients Choose Us" },
      title: {
        type: String,
        default: "Clinical Excellence With Human Warmth",
      },
      subtitle: {
        type: String,
        default:
          "We believe medical care should be attentive, transparent, and built on trust.",
      },
      items: {
        type: [
          {
            title: String,
            description: String,
            icon: String,
          },
        ],
        default: defaultWhyChoose,
      },
    },
    doctors: {
      type: [
        {
          doctorId: String,
          name: String,
          designation: String,
          department: String,
          qualification: String,
          specialization: String,
          experience: String,
          availability: String,
          bio: String,
          focusAreas: [String],
          image: String,
        },
      ],
      default: defaultDoctors,
    },
    footer: {
      emergencyNote: {
        type: String,
        default:
          "For severe medical emergencies, please visit the nearest hospital emergency room immediately.",
      },
      copyright: {
        type: String,
        default: `© ${new Date().getFullYear()} S.V.V. Clinic. All rights reserved.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SiteContent", siteContentSchema);
