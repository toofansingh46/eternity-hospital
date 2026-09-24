import api from "./api";

export const doctorService = {
  list: () => api.get("/doctors").then((r) => r.data),
  get: (id) => api.get(`/doctors/${id}`).then((r) => r.data),
  create: (payload) => api.post("/doctors", payload).then((r) => r.data),
};
