import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientCode: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    bloodGroup: { type: String, default: "Unknown" },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    emergencyContact: { type: String },
    relationship: { type: String },
    allergies: { type: String },
    existingConditions: { type: String },
    currentMedication: { type: String },
    notes: { type: String },
    status: { type: String, enum: ["Active", "Admitted", "Discharged"], default: "Active" },
    lastVisit: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

patientSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
patientSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Patient", patientSchema);
