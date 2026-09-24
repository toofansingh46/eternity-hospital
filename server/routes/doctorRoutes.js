import { Router } from "express";
import { listDoctors, getDoctor, createDoctor, updateDoctor } from "../controllers/doctorController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", listDoctors);
router.get("/:id", getDoctor);
router.post("/", createDoctor);
router.put("/:id", updateDoctor);

export default router;
