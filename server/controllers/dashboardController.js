import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Invoice from "../models/Invoice.js";

export async function getDashboardStats(req, res, next) {
  try {
    const [totalPatients, totalDoctors, totalAppointments, invoices] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Invoice.find(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysAppointments = await Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } });
    const availableDoctors = await Doctor.countDocuments({ status: "Available" });
    const pendingBills = invoices.filter((i) => i.paymentStatus === "Pending").length;
    const totalRevenue = invoices.filter((i) => i.paymentStatus === "Paid").reduce((sum, i) => sum + i.total, 0);

    const departmentCounts = {};
    const doctors = await Doctor.find();
    doctors.forEach((d) => {
      departmentCounts[d.department] = (departmentCounts[d.department] || 0) + 1;
    });

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      todaysAppointments,
      availableDoctors,
      pendingBills,
      totalRevenue,
      departmentCounts,
    });
  } catch (err) {
    next(err);
  }
}
