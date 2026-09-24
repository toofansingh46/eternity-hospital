import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

export async function listDoctors(req, res, next) {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.json(doctors);
  } catch (err) {
    next(err);
  }
}

export async function getDoctor(req, res, next) {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const appointments = await Appointment.find({ doctor: doctor._id }).populate("patient").sort({ date: -1 });
    res.json({ doctor, appointments });
  } catch (err) {
    next(err);
  }
}

export async function createDoctor(req, res, next) {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    next(err);
  }
}

export async function updateDoctor(req, res, next) {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    next(err);
  }
}
