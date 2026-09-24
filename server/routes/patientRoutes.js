import { Router } from "express";
import { listPatients, getPatient, createPatient, updatePatient, deletePatient } from "../controllers/patientController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", listPatients);
router.get("/:id", getPatient);
router.post("/", createPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
