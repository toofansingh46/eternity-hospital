import { Router } from "express";
import { listAppointments, createAppointment, updateAppointment, deleteAppointment } from "../controllers/appointmentController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", listAppointments);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
