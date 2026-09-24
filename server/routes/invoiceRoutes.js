import { Router } from "express";
import { listInvoices, createInvoice, updateInvoice } from "../controllers/invoiceController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", listInvoices);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);

export default router;
