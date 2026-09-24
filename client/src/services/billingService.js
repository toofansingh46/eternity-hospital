import api from "./api";

export const billingService = {
  list: (params) => api.get("/invoices", { params }).then((r) => r.data),
  create: (payload) => api.post("/invoices", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/invoices/${id}`, payload).then((r) => r.data),
};
