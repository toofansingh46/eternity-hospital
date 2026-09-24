import Invoice from "../models/Invoice.js";

async function nextInvoiceCode() {
  const count = await Invoice.countDocuments();
  return `INV-${String(count + 5001)}`;
}

export async function listInvoices(req, res, next) {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== "All") query.paymentStatus = status;
    const invoices = await Invoice.find(query).populate("patient").populate("doctor").sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    next(err);
  }
}

export async function createInvoice(req, res, next) {
  try {
    const invoiceCode = await nextInvoiceCode();
    const invoice = await Invoice.create({ ...req.body, invoiceCode });
    const populated = await invoice.populate(["patient", "doctor"]);
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

export async function updateInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("patient")
      .populate("doctor");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
}
