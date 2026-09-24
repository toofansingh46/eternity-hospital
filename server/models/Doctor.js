import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    department: { type: String, required: true },
    experienceYears: { type: Number, default: 1 },
    consultationFee: { type: Number, default: 500 },
    qualifications: { type: String, default: "MBBS" },
    workingHours: { type: String, default: "9:00 AM - 5:00 PM" },
    status: { type: String, enum: ["Available", "On Leave", "In Consultation"], default: "Available" },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
