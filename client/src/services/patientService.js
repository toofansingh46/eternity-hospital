import api from "./api";

export const patientService = {
  list: (params) => api.get("/patients", { params }).then((r) => r.data),
  get: (id) => api.get(`/patients/${id}`).then((r) => r.data),
  create: (payload) => api.post("/patients", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/patients/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/patients/${id}`).then((r) => r.data),
};
