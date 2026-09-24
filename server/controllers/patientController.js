import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Invoice from "../models/Invoice.js";

async function nextPatientCode() {
  const count = await Patient.countDocuments();
  return `PT-${String(count + 1001)}`;
}

export async function listPatients(req, res, next) {
  try {
    const { search = "", status } = req.query;
    const query = {};
    if (status && status !== "All") query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { patientCode: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    next(err);
  }
}

export async function getPatient(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    const appointments = await Appointment.find({ patient: patient._id }).populate("doctor").sort({ date: -1 });
    const invoices = await Invoice.find({ patient: patient._id }).sort({ date: -1 });
    res.json({ patient, appointments, invoices });
  } catch (err) {
    next(err);
  }
}

export async function createPatient(req, res, next) {
  try {
    const patientCode = await nextPatientCode();
    const patient = await Patient.create({ ...req.body, patientCode });
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
}

export async function updatePatient(req, res, next) {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    next(err);
  }
}

export async function deletePatient(req, res, next) {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient removed" });
  } catch (err) {
    next(err);
  }
}
