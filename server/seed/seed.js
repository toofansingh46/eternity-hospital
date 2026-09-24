import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Invoice from "../models/Invoice.js";

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Patient.deleteMany({}),
    Doctor.deleteMany({}),
    Appointment.deleteMany({}),
    Invoice.deleteMany({}),
  ]);

  await User.create([
    { name: "Toofan Singh", email: "admin@eternity.com", password: "admin123", role: "Administrator" },
    { name: "Priya Nair", email: "reception@eternity.com", password: "reception123", role: "Receptionist" },
  ]);

  const doctors = await Doctor.create([
    { name: "Dr. Rajiv Malhotra", specialization: "Cardiologist", department: "Cardiology", experienceYears: 14, consultationFee: 900, qualifications: "MBBS, MD (Cardiology)", status: "Available" },
    { name: "Dr. Neha Kapoor", specialization: "Pediatrician", department: "Pediatrics", experienceYears: 9, consultationFee: 600, qualifications: "MBBS, DCH", status: "Available" },
    { name: "Dr. Arjun Mehta", specialization: "Orthopedic Surgeon", department: "Orthopedics", experienceYears: 11, consultationFee: 800, qualifications: "MBBS, MS (Ortho)", status: "In Consultation" },
    { name: "Dr. Sanya Kapoor", specialization: "Dermatologist", department: "Dermatology", experienceYears: 6, consultationFee: 500, qualifications: "MBBS, MD (Derma)", status: "Available" },
    { name: "Dr. Vikram Rao", specialization: "General Physician", department: "General Medicine", experienceYears: 18, consultationFee: 400, qualifications: "MBBS, MD (Medicine)", status: "On Leave" },
    { name: "Dr. Ishaan Bose", specialization: "Neurologist", department: "Neurology", experienceYears: 10, consultationFee: 950, qualifications: "MBBS, DM (Neurology)", status: "Available" },
  ]);

  const patients = await Patient.create([
    { patientCode: "PT-1001", firstName: "Aarav", lastName: "Sharma", dob: new Date("1990-05-12"), gender: "Male", bloodGroup: "O+", phone: "9876543210", email: "aarav.sharma@example.com", address: "12 MG Road", city: "New Delhi", state: "Delhi", emergencyContact: "9876500000", relationship: "Father", allergies: "Penicillin", existingConditions: "Hypertension", status: "Active" },
    { patientCode: "PT-1002", firstName: "Riya", lastName: "Mehta", dob: new Date("1995-08-22"), gender: "Female", bloodGroup: "A+", phone: "9876543211", email: "riya.mehta@example.com", address: "45 Park Street", city: "Mumbai", state: "Maharashtra", emergencyContact: "9876500001", relationship: "Spouse", allergies: "None", existingConditions: "None", status: "Admitted" },
    { patientCode: "PT-1003", firstName: "Kabir", lastName: "Verma", dob: new Date("1988-01-30"), gender: "Male", bloodGroup: "B+", phone: "9876543212", email: "kabir.verma@example.com", address: "8 Lake View", city: "Bengaluru", state: "Karnataka", emergencyContact: "9876500002", relationship: "Brother", allergies: "Dust", existingConditions: "Asthma", status: "Active" },
    { patientCode: "PT-1004", firstName: "Ananya", lastName: "Singh", dob: new Date("2001-11-03"), gender: "Female", bloodGroup: "AB+", phone: "9876543213", email: "ananya.singh@example.com", address: "23 Green Valley", city: "Pune", state: "Maharashtra", emergencyContact: "9876500003", relationship: "Mother", allergies: "None", existingConditions: "None", status: "Discharged" },
    { patientCode: "PT-1005", firstName: "Vivaan", lastName: "Kapoor", dob: new Date("1975-04-18"), gender: "Male", bloodGroup: "O-", phone: "9876543214", email: "vivaan.kapoor@example.com", address: "5 Central Avenue", city: "Chennai", state: "Tamil Nadu", emergencyContact: "9876500004", relationship: "Son", allergies: "Sulfa drugs", existingConditions: "Diabetes Type 2", status: "Active" },
    { patientCode: "PT-1006", firstName: "Ishita", lastName: "Rao", dob: new Date("1998-09-09"), gender: "Female", bloodGroup: "A-", phone: "9876543215", email: "ishita.rao@example.com", address: "19 Hill Road", city: "New Delhi", state: "Delhi", emergencyContact: "9876500005", relationship: "Father", allergies: "None", existingConditions: "None", status: "Active" },
  ]);

  const now = new Date();
  const appointmentsData = [
    { patient: patients[0]._id, doctor: doctors[0]._id, department: "Cardiology", daysOffset: 0, time: "10:00 AM", type: "Consultation", status: "Confirmed" },
    { patient: patients[1]._id, doctor: doctors[2]._id, department: "Orthopedics", daysOffset: 0, time: "11:30 AM", type: "Follow-up", status: "Waiting" },
    { patient: patients[2]._id, doctor: doctors[3]._id, department: "Dermatology", daysOffset: 0, time: "2:00 PM", type: "Consultation", status: "Scheduled" },
    { patient: patients[3]._id, doctor: doctors[1]._id, department: "Pediatrics", daysOffset: -2, time: "9:00 AM", type: "Checkup", status: "Completed" },
    { patient: patients[4]._id, doctor: doctors[5]._id, department: "Neurology", daysOffset: -1, time: "3:30 PM", type: "Consultation", status: "Completed" },
    { patient: patients[5]._id, doctor: doctors[0]._id, department: "Cardiology", daysOffset: 1, time: "10:30 AM", type: "Follow-up", status: "Scheduled" },
    { patient: patients[0]._id, doctor: doctors[4]._id, department: "General Medicine", daysOffset: -5, time: "9:30 AM", type: "Consultation", status: "Completed" },
    { patient: patients[2]._id, doctor: doctors[0]._id, department: "Cardiology", daysOffset: 3, time: "1:00 PM", type: "Consultation", status: "Scheduled" },
  ];

  const appointments = await Appointment.create(
    appointmentsData.map((a) => {
      const date = new Date(now);
      date.setDate(date.getDate() + a.daysOffset);
      return { ...a, date };
    })
  );

  await Invoice.create([
    { invoiceCode: "INV-5001", patient: patients[0]._id, doctor: doctors[0]._id, department: "Cardiology", items: [{ service: "Consultation", amount: 900 }, { service: "ECG", amount: 400 }], subtotal: 1300, discount: 0, tax: 65, total: 1365, paymentMethod: "Card", paymentStatus: "Paid", date: new Date(now.getTime() - 5 * 86400000) },
    { invoiceCode: "INV-5002", patient: patients[1]._id, doctor: doctors[2]._id, department: "Orthopedics", items: [{ service: "Consultation", amount: 800 }, { service: "X-Ray", amount: 600 }], subtotal: 1400, discount: 100, tax: 65, total: 1365, paymentMethod: "UPI", paymentStatus: "Pending", date: new Date(now.getTime() - 1 * 86400000) },
    { invoiceCode: "INV-5003", patient: patients[3]._id, doctor: doctors[1]._id, department: "Pediatrics", items: [{ service: "Consultation", amount: 600 }], subtotal: 600, discount: 0, tax: 30, total: 630, paymentMethod: "Cash", paymentStatus: "Paid", date: new Date(now.getTime() - 2 * 86400000) },
    { invoiceCode: "INV-5004", patient: patients[4]._id, doctor: doctors[5]._id, department: "Neurology", items: [{ service: "Consultation", amount: 950 }, { service: "MRI Scan", amount: 4500 }], subtotal: 5450, discount: 200, tax: 262, total: 5512, paymentMethod: "Insurance", paymentStatus: "Pending", date: new Date(now.getTime() - 1 * 86400000) },
    { invoiceCode: "INV-5005", patient: patients[5]._id, doctor: doctors[0]._id, department: "Cardiology", items: [{ service: "Consultation", amount: 900 }], subtotal: 900, discount: 0, tax: 45, total: 945, paymentMethod: "Card", paymentStatus: "Paid", date: new Date() },
  ]);

  console.log("Seed complete:");
  console.log(`  Users: 2 (admin@eternity.com / admin123, reception@eternity.com / reception123)`);
  console.log(`  Doctors: ${doctors.length}`);
  console.log(`  Patients: ${patients.length}`);
  console.log(`  Appointments: ${appointments.length}`);
  console.log(`  Invoices: 5`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
