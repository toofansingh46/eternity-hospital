import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";

export async function listAppointments(req, res, next) {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== "All") query.status = status;
    const appointments = await Appointment.find(query)
      .populate("patient")
      .populate("doctor")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
}

export async function createAppointment(req, res, next) {
  try {
    const appointment = await Appointment.create(req.body);
    await Patient.findByIdAndUpdate(req.body.patient, { lastVisit: new Date() });
    const populated = await appointment.populate(["patient", "doctor"]);
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

export async function updateAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("patient")
      .populate("doctor");
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
}

export async function deleteAppointment(req, res, next) {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    next(err);
  }
}
