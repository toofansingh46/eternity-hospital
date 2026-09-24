import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    department: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    type: { type: String, enum: ["Consultation", "Follow-up", "Emergency", "Checkup"], default: "Consultation" },
    status: {
      type: String,
      enum: ["Scheduled", "Confirmed", "Waiting", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
